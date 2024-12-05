import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useStore } from "@/store";
import { IProduct } from "@/interfaces/IProduct";
import { getApi } from "@/api";
import axios from "axios";

export default function Products() {
    const { id } = useParams();
    const [product, setProduct] = useState<IProduct | null>(null);
    const [loading, setLoading] = useState(true);

    const auth = useStore((state) => state.auth);

    useEffect(() => {
        if (id) {
            getApi<IProduct>(`products/${id}`)
                .then((p) => {
                    setProduct(p ?? null);
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
            alert("Please log in to add products to the cart.");
            return;
        }

        try {
            const cartItem = {
                userId: auth?.userId,
                productId: product.id,
                title: product.title,
                imagePath: product.image?.path,
                price: product.price,
                quantity: 1,
                isBought: false,
                isCanceled: null,
                isDelivered: null,
            };

            console.log("Payload being sent to /api/cart/add:", JSON.stringify(cartItem, null, 2));

            const response = await axios.post("/api/cart/add", cartItem, { withCredentials: true });
            console.log("Response from server:", response.data);

            alert("Product added to cart!");
        } catch (error) {
            const axiosError = error as any;
            console.error("Error adding product to cart:", axiosError?.message);

            if (axiosError?.response) {
                console.log("Server Response Details:", axiosError.response.data);

                if (axiosError.response.data?.errors) {
                    console.error("Validation errors:", axiosError.response.data.errors);
                    alert(
                        "Failed to add product to cart. Errors: " +
                        JSON.stringify(axiosError.response.data.errors, null, 2)
                    );
                }
            }

            alert("Failed to add product to cart.");
        }
    };

    if (loading) return <div className="text-center py-8">Loading...</div>;
    if (!product) return <div className="text-center py-8">Product not found</div>;

    return (
        <div className="container mx-auto p-8">
            <div className="flex flex-col md:flex-row justify-between">
                <div className="md:w-1/3 p-4">
                    {product.image && product.image.path ? (
                        <img
                            src={`/images/${product.image.path}`}
                            alt={product.title}
                            className="w-full h-72 object-contain rounded-lg shadow-md"
                        />
                    ) : (
                        <div className="text-gray-500">Image not available</div>
                    )}
                </div>

                <div className="md:w-2/3 p-4 space-y-4">
                    <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
                    <div className="text-2xl text-gray-800 font-semibold">Kaina: {product.price} €</div>
                    <div className="text-lg text-gray-600">Lytis: {product.gender}</div>
                    <p className="text-gray-600 text-lg">{product.description}</p>
                    <div className="mt-4">
                        <button
                            onClick={handleAddToCart}
                            className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        >
                            Pridėti į krepšelį
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
