import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useStore } from "@/store";
import { IProduct } from "@/interfaces/IProduct";
import { getApi } from "@/api";
import axios from "axios";
import { Modal } from "@/pages/components/Modal";
import { ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState<IProduct | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isEnlarged, setIsEnlarged] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

    const [visibleModal, setVisibleModal] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalContent, setModalContent] = useState<JSX.Element | null>(null);

    const auth = useStore((state) => state.auth);

    useEffect(() => {
        if (id) {
            getApi<IProduct>(`products/${id}`)
                .then((p) => {
                    setProduct(p ?? null);
                    if (p?.images && p.images.length > 0) {
                        setSelectedImage(p.images[0].path);
                    }
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching product:", error);
                    setLoading(false);
                });
        }
    }, [id]);

    const handleAddToCart = async () => {
        if (!product || !auth?.isAuthenticated) {
            setModalTitle("Prisijunkite");
            setModalContent(
                <div>Prisijunkite, norėdami įdėti produktus į krepšelį.</div>
            );
            setVisibleModal(true);
            return;
        }

        try {
            const cartItem = {
                productId: product.id,
                title: product.title,
                imagePath: selectedImage,
                price: product.price,
                quantity: 1,
                isBought: false,
                isCanceled: null,
                isDelivered: null,
            };

            await axios.post("/api/cart/add", cartItem, { withCredentials: true });
            setModalTitle("Prekė įdėta į krepšelį");
            setModalContent(<div>Prekė buvo sėkmingai įdėta į krepšelį!</div>);
        } catch (error) {
            console.error("Error adding product to cart:", error);
            setModalTitle("Klaida");
            setModalContent(<div>Nepavyko įdėti prekės į krepšelį. Bandykite dar kartą.</div>);
        } finally {
            setVisibleModal(true);
        }
    };

    const closeEnlargedImage = () => {
        setIsEnlarged(false);
    };

    const nextImage = () => {
        if (product?.images) {
            const nextIndex = (currentImageIndex + 1) % product.images.length;
            setSelectedImage(product.images[nextIndex].path);
            setCurrentImageIndex(nextIndex);
        }
    };

    const prevImage = () => {
        if (product?.images) {
            const prevIndex = (currentImageIndex - 1 + product.images.length) % product.images.length;
            setSelectedImage(product.images[prevIndex].path);
            setCurrentImageIndex(prevIndex);
        }
    };

    if (loading) return <div className="text-center py-8">Įkeliama...</div>;
    if (!product) return <div className="text-center py-8">Prekė nerasta</div>;

    return (
        <div className="container mx-auto p-8">
            <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/2">
                    <div className="relative w-full h-96 mb-4">
                       
                        <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-200 focus:outline-none"
                        >
                            <ChevronLeftIcon className="h-6 w-6 text-black" />
                        </button>

                        {selectedImage ? (
                            <img
                                src={`/images/${selectedImage}`}
                                alt={product.title}
                                className="w-full h-full object-contain rounded-lg shadow-lg"
                            />
                        ) : (
                            <div className="text-gray-500 flex items-center justify-center h-full">
                                No image available
                            </div>
                        )}

                        <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-200 focus:outline-none"
                        >
                            <ChevronRightIcon className="h-6 w-6 text-black" />
                        </button>

                        <button
                            onClick={() => setIsEnlarged(true)}
                            className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-200 focus:outline-none"
                        >
                            <MagnifyingGlassIcon className="h-6 w-6 text-gray-800" />
                        </button>
                    </div>

                    <div className="flex gap-2 overflow-x-auto space-x-4">
                        {product.images?.length ? (
                            product.images.map((image, idx) => (
                                <img
                                    key={idx}
                                    src={`/images/${image.path}`}
                                    alt={`${product.title} image ${idx + 1}`}
                                    className={`w-24 h-24 object-cover rounded-lg cursor-pointer ${selectedImage === image.path ? "border-4 border-blue-500" : "border"
                                        }`}
                                    onClick={() => {
                                        setSelectedImage(image.path);
                                        setCurrentImageIndex(idx);
                                    }}
                                />
                            ))
                        ) : (
                            <div>Nėra jokių papildomų nuotraukų</div>
                        )}
                    </div>
                </div>

                <div className="md:w-1/2 space-y-6">
                    <h1 className="text-3xl font-bold">{product.title}</h1>

                    <div className="text-xl font-semibold text-gray-800">Kaina: {product.price} €</div>
                    <div className="text-lg text-gray-600">Lytis: {product.gender}</div>
                    <div className="text-gray-700">{product.description}</div>

                    <button
                        onClick={handleAddToCart}
                        className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition"
                    >
                        Pridėti į krepšelį
                    </button>
                    {modalContent && (
                        <Modal
                            visibleModal={visibleModal}
                            title={modalTitle}
                            setVisibleModal={setVisibleModal}
                        >
                            {modalContent}
                        </Modal>
                    )}
                </div>
            </div>

            {isEnlarged && selectedImage && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="relative">
                        <button
                            onClick={closeEnlargedImage}
                            className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-200 focus:outline-none"
                        >
                            <ChevronLeftIcon className="h-6 w-6 text-black" />
                        </button>

                        <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-200 focus:outline-none"
                        >
                            <ChevronLeftIcon className="h-6 w-6 text-black" />
                        </button>

                        <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-200 focus:outline-none"
                        >
                            <ChevronRightIcon className="h-6 w-6 text-black" />
                        </button>

                        <img
                            src={`/images/${selectedImage}`}
                            alt={product.title}
                            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-lg"
                        />
                    </div>
                </div>
            )}


        </div>
    );
}
