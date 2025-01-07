import { useEffect, useState } from "react";
import axios from "axios";
import { useStore } from "@/store";
import { ICart } from "@/interfaces/ICart";
import { Modal } from "@/pages/components/Modal";

export default function Cart() {
    const [cartItems, setCartItems] = useState<ICart[]>([]);
    const [loading, setLoading] = useState(true);

    const [visibleModal, setVisibleModal] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalContent, setModalContent] = useState<JSX.Element | null>(null);

    const auth = useStore((state) => state.auth);

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
        setModalTitle("Pirkimas");
        setModalContent(<div>Paspaustas pirkti mygtukas!</div>);
        setVisibleModal(true);
    };

    const calculateTotal = () => {
        return cartItems.reduce(
            (sum, item) => sum + item.quantity * item.price,
            0
        ).toFixed(2);
    };

    if (loading) return <div>Įkeliamas pirkinių krepšelis...</div>;

    if (!cartItems.length) return <div>Jūsų pirkinių krepšelis yra tuščias.</div>;

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-4">Pirkinių krepšelis</h1>
            {modalContent && (
                <Modal
                    visibleModal={visibleModal}
                    title={modalTitle}
                    setVisibleModal={setVisibleModal}
                >
                    {modalContent}
                </Modal>
            )}
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
                            <div>
                                <label htmlFor={`quantity-${item.id}`} className="mr-2">Kiekis:</label>
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
                                    className="border rounded p-1 w-16"
                                />
                            </div>
                            <div>Kaina: {item.price} &#8364;</div>
                        </div>
                        <button
                            onClick={() => handleRemoveFromCart(item.id)}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                            Pašalinti
                        </button>
                    </li>
                ))}
            </ul>
            <div className="mt-6 text-right">
                <h2 className="text-xl font-bold">Bendra suma: {calculateTotal()} &#8364;</h2>
                <button
                    onClick={handlePurchase}
                    className="bg-green-500 text-white px-6 py-2 mt-4 rounded hover:bg-green-600"
                >
                    Pirkti
                </button>
            </div>

        </div>
    );
}
