import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useStore } from "@/store";
import { IProduct } from "@/interfaces/IProduct";
import { getApi } from "@/api";
import axios from "axios";
import { Modal } from "@/pages/components/Modal";
import { ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useNavigate, useLocation } from "react-router-dom";

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
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    const auth = useStore((state) => state.auth);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    function getGenderDisplay(gender: string | null | undefined): string {
        switch (gender) {
            case "Men":
                return "Vyrams";
            case "Wo":
                return "Moterims";
            case "Unisex":
                return "Visiems";
            default:
                return "Nežinoma";
        }
    }

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

        if (!selectedSize) {
            setModalTitle("Pasirinkite dydį");
            setModalContent(<div>Prašome pasirinkti prekės dydį.</div>);
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
                size: selectedSize,
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
                    <button
                        onClick={() => navigate({ pathname: "/", search: location.search })}
                        className="mb-4 text-blue-600 hover:underline"
                    >
                        ← Grįžti į katalogą
                    </button>
                    <div className="relative w-full h-96 mb-4 rounded-lg overflow-hidden border shadow-md">
                        {selectedImage ? (
                            <img
                                src={`${backendUrl}/images/${selectedImage}`}
                                alt={product.title}
                                className="w-full h-full object-contain bg-white"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                                Nėra nuotraukos
                            </div>
                        )}

                        <button
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-100"
                        >
                            <ChevronLeftIcon className="h-6 w-6 text-gray-700" />
                        </button>

                        <button
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-100"
                        >
                            <ChevronRightIcon className="h-6 w-6 text-gray-700" />
                        </button>

                        <button
                            onClick={() => setIsEnlarged(true)}
                            className="absolute top-2 right-2 bg-white p-2 rounded-full shadow hover:bg-gray-100"
                        >
                            <MagnifyingGlassIcon className="h-6 w-6 text-gray-700" />
                        </button>
                    </div>

                    <div className="flex gap-2 overflow-x-auto space-x-4">
                        {product.images?.length ? (
                            product.images.map((image, idx) => (
                                <img
                                    key={idx}
                                    src={`${backendUrl}/images/${image.path}`}
                                    alt={`${product.title} image ${idx + 1}`}
                                    className={`w-24 h-24 object-cover rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 shadow-md ${selectedImage === image.path ? "ring-4 ring-blue-400" : "ring-1 ring-gray-200"}`}
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
                    <h1 className="text-4xl font-extrabold text-gray-900 drop-shadow-sm">{product.title}</h1>

                    <div className="text-2xl font-bold text-blue-700 mt-2">
                        Kaina: <span className="text-green-600">{product.price} €</span>
                    </div>
                    <div className="mt-2 inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                        {getGenderDisplay(product.gender)}
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border mt-4 shadow-inner text-gray-700 leading-relaxed">
                        {product.description}
                    </div>
                    <div className="space-x-2">
                        {[product.size1, product.size2, product.size3].filter(Boolean).map((size) => (
                            <button
                                key={size}
                                className={`px-4 py-2 border rounded-full transition ${selectedSize === size
                                        ? "bg-blue-500 text-white border-blue-500"
                                        : "bg-white text-gray-700 hover:bg-blue-100"
                                    }`}
                                onClick={() => setSelectedSize(size!)}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={handleAddToCart}
                        className="mt-4 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
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
                            <XMarkIcon className="h-6 w-6 text-black" />
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
