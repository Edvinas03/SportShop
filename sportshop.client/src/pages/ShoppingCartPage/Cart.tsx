import { useEffect, useState } from "react";
import axios from "axios";
import { useStore } from "@/store";
import { ICart } from "@/interfaces/ICart";
import { Modal } from "@/pages/components/Modal";
import { useNavigate } from "react-router-dom";

export default function Cart() {
    const [cartItems, setCartItems] = useState<ICart[]>([]);
    const [loading, setLoading] = useState(true);

    const [visibleModal, setVisibleModal] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalContent, setModalContent] = useState<JSX.Element | null>(null);
    const auth = useStore((state) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (auth?.isAuthenticated) {
            axios
                .get<ICart[]>("/api/cart/get", { withCredentials: true })
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
            setModalTitle("Klaida");
            setModalContent(<div>Nepavyko pašalinti prekės iš krepšelio. Bandykite dar kartą.</div>);
            setVisibleModal(true);
        }
    };

    const handleQuantityChange = async (cartId: number, newQuantity: number) => {
        try {
            const updatedItem = cartItems.find((item) => item.id === cartId);
            if (!updatedItem) return;

            setCartItems((prev) =>
                prev.map((item) =>
                    item.id === cartId ? { ...item, quantity: newQuantity } : item
                )
            );

            await axios.put(
                '/api/cart/update',
                [
                    {
                        ...updatedItem,
                        quantity: newQuantity,
                        updatedAt: new Date().toISOString(),
                    },
                ],
                { withCredentials: true }
            );
        } catch (error) {
            console.error('Error updating quantity:', error);
            setModalTitle("Klaida");
            setModalContent(<div>Nepavyko atnaujinti kiekio. Bandykite dar kartą.</div>);
            setVisibleModal(true);
        }
    };

    const handlePurchase = () => {
        if (cartItems.length === 0) {
            setModalTitle("Klaida");
            setModalContent(<div>Jūsų krepšelis yra tuščias. Pridėkite bent vieną prekę.</div>);
            setVisibleModal(true);
            return;
        }

        navigate("/checkout");
    };

    const calculateTotal = () => {
        return cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0).toFixed(2);
    };

    if (loading) return <div className="text-center text-lg mt-10">Įkeliamas pirkinių krepšelis...</div>;
    if (!cartItems.length) return <div className="text-center text-lg mt-10">Jūsų pirkinių krepšelis yra tuščias.</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">Pirkinių krepšelis</h1>

            {modalContent && (
                <Modal visibleModal={visibleModal} title={modalTitle} setVisibleModal={setVisibleModal}>
                    {modalContent}
                </Modal>
            )}

            <ul className="space-y-6">
                {cartItems.map((item) => (
                    <li
                        key={item.id}
                        className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 border rounded-xl shadow-sm bg-white"
                    >
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <img
                                src={`/images/${item.imagePath}`}
                                alt={item.title}
                                className="w-24 h-24 sm:w-32 sm:h-32 object-contain rounded-md border"
                            />
                            <div className="text-center sm:text-left">
                                <h2 className="text-xl font-semibold text-gray-800">{item.title}</h2>
                                <p className="text-sm text-gray-500 mt-1">Dydis: {item.size ?? "Nenurodytas"}</p>
                                <p className="text-sm text-gray-500">Kaina: {item.price} €</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <label htmlFor={`quantity-${item.id}`} className="text-sm text-gray-700">
                                Kiekis:
                            </label>
                            <input
                                id={`quantity-${item.id}`}
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) =>
                                    handleQuantityChange(
                                        item.id,
                                        parseInt(e.target.value, 10) || 1
                                    )
                                }
                                className="w-20 px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />

                            <button
                                onClick={() => handleRemoveFromCart(item.id)}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
                            >
                                Pašalinti
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            <div className="mt-10 text-right">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Bendra suma: {calculateTotal()} €</h2>
                <button
                    onClick={handlePurchase}
                    className="bg-green-600 hover:bg-green-700 text-white text-lg px-6 py-3 rounded-md transition"
                >
                    Pirkti
                </button>
            </div>
        </div>
    );
}
