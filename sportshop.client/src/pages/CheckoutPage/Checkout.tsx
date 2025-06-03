import { useState } from "react";

export default function Checkout() {
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        address: "",
        city: "",
        zip: "",
        country: "",
        paymentMethod: "card",
        comment: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Pateikimo logika (pvz. POST į /api/checkout)
        console.log("Pateikta:", form);
        alert("Užsakymas pateiktas!");
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-6 text-center">Apmokėjimas</h1>
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-md">
                <div>
                    <label className="block text-sm font-medium mb-1">Vardas Pavardė</label>
                    <input
                        type="text"
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-md px-4 py-2 shadow-sm focus:ring focus:ring-blue-200"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">El. paštas</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-md px-4 py-2 shadow-sm focus:ring focus:ring-blue-200"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Adresas</label>
                    <input
                        type="text"
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-md px-4 py-2 shadow-sm focus:ring focus:ring-blue-200"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Miestas</label>
                        <input
                            type="text"
                            name="city"
                            value={form.city}
                            onChange={handleChange}
                            required
                            className="w-full border rounded-md px-4 py-2 shadow-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Pašto kodas</label>
                        <input
                            type="text"
                            name="zip"
                            value={form.zip}
                            onChange={handleChange}
                            required
                            className="w-full border rounded-md px-4 py-2 shadow-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Šalis</label>
                        <input
                            type="text"
                            name="country"
                            value={form.country}
                            onChange={handleChange}
                            required
                            className="w-full border rounded-md px-4 py-2 shadow-sm"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Mokėjimo būdas</label>
                    <select
                        name="paymentMethod"
                        value={form.paymentMethod}
                        onChange={handleChange}
                        className="w-full border rounded-md px-4 py-2 shadow-sm"
                    >
                        <option value="card">Banko kortelė</option>
                        <option value="bank">Bankinis pavedimas</option>
                        <option value="cod">Atsiskaitymas pristatymo metu</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Komentaras</label>
                    <textarea
                        name="comment"
                        value={form.comment}
                        onChange={handleChange}
                        rows={3}
                        className="w-full border rounded-md px-4 py-2 shadow-sm"
                        placeholder="Pvz. pristatykite po 17:00"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-md transition"
                >
                    Patvirtinti užsakymą
                </button>
            </form>
        </div>
    );
}
