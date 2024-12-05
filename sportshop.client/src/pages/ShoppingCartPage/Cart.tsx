import { useEffect, useState } from "react";
import axios from "axios";
import { useStore } from "@/store";

interface CartItem {
    id: number;
    productId: number;
    title: string;
    imagePath: string;
    quantity: number;
    price: number;
    userId: string;
    isBought: boolean;
    IsCanceled: string;
    IsDelivered: string;
    createdAt: string;
    updatedAt: string;
}

export default function Cart() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);

    const auth = useStore((state) => state.auth);

    useEffect(() => {
        if (auth?.isAuthenticated) {
            axios
                .get<CartItem[]>("/api/cart/get", { withCredentials: true })
                .then((response) => {
                    setCartItems(response.data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching cart items:", error);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [auth]);

    const handleRemoveFromCart = async (cartId: number) => {
        try {
            await axios.delete(`/api/cart/remove?cartId=${cartId}`);
            setCartItems((prev) => prev.filter((item) => item.id !== cartId));
        } catch (error) {
            console.error("Error removing item from cart:", error);
            alert("Failed to remove item from cart.");
        }
    };

    if (loading) return <div>Loading cart...</div>;

    if (!cartItems.length) return <div>Your cart is empty.</div>;

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-4">Shopping Cart</h1>
            <ul>
                {cartItems.map((item) => (
                    <li key={item.id} className="flex justify-between items-center mb-4 p-4 border">
                        <div>
                            <img
                                src={`/images/${item.imagePath}`}
                                alt={item.title}
                                className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 object-cover"
                            />
                            <h2 className="text-xl font-semibold">{item.title}</h2>
                            <p>Quantity: {item.quantity}</p>
                            <p>Price: {item.price} &#8364;</p>
                        </div>
                        <button
                            onClick={() => handleRemoveFromCart(item.id)}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                            Remove
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}