import useSWR from "swr";
import { IDashboard } from "@/interfaces/IDashboard";
import { getApi } from "@/api";
import { useState } from "react";
//import CreateProductForm from '@/pages/admin/components/CreateProductForm';

export default function Dashboard() {
    const { data, error, isLoading } = useSWR<IDashboard | undefined>(
        "admin/dashboard",
        getApi,
        { revalidateOnReconnect: true }
    );

    const [form, setForm] = useState({
        title: "",
        categoryId: "",
        genderId: "",
        description: "",
        price: "",
        rating: "",
        size1: "",
        size2: "",
        size3: "",
        images: [{ path: "", title: "" }],
    });

    const [status, setStatus] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const newImages = [...form.images];
        newImages[index][name] = value;
        setForm(prev => ({ ...prev, images: newImages }));
    };

    const addImageField = () => {
        setForm(prev => ({ ...prev, images: [...prev.images, { path: "", title: "" }] }));
    };

    const removeImageField = (index: number) => {
        const newImages = form.images.filter((_, i) => i !== index);
        setForm(prev => ({ ...prev, images: newImages }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus(null);

        const body = {
            Title: form.title,
            CategoryId: Number(form.categoryId),
            GenderId: Number(form.genderId),
            Description: form.description,
            Price: parseFloat(form.price),
            Rating: parseInt(form.rating),
            Size1: form.size1,
            Size2: form.size2,
            Size3: form.size3,
            Images: form.images.filter(img => img.path.trim() !== ""),
        };

        try {
            const res = await fetch("/api/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                const result = await res.json();
                setStatus(`✅ Produktas pridėtas! ID: ${result}`);
                setForm({
                    title: "",
                    categoryId: "",
                    genderId: "",
                    description: "",
                    price: "",
                    rating: "",
                    size1: "",
                    size2: "",
                    size3: "",
                    images: [{ path: "", title: "" }],
                });
            } else {
                const err = await res.text();
                setStatus("❌ Klaida: " + err);
            }
        } catch (err: any) {
            setStatus("❌ Tinklo klaida: " + err.message);
        }
    };

    return (

        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-extrabold text-blue-900 mb-6 border-b-2 border-blue-600 pb-2">
                Admin Dashboard
            </h1>

            {error && (
                <div className="bg-red-100 text-red-700 p-4 rounded mb-4 shadow">
                    Klaida užkraunant duomenis: {error.toString()}
                </div>
            )}

            {isLoading && (
                <div className="text-center text-gray-500 py-6">Įkeliama...</div>
            )}

            {data && (
                <div className="bg-white p-6 rounded-lg shadow-md text-gray-800 leading-relaxed whitespace-pre-wrap mb-10">
                    {data.text}
                </div>
            )}

            {/* Produkto pridėjimo forma */}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">
                <h2 className="text-xl font-bold mb-4">Pridėti naują produktą</h2>

                <input name="title" value={form.title} onChange={handleChange} required
                    placeholder="Pavadinimas" className="mb-2 block w-full border px-2 py-1 rounded" />

                <input type="number" name="categoryId" value={form.categoryId} onChange={handleChange} required
                    placeholder="Kategorijos ID" className="mb-2 block w-full border px-2 py-1 rounded" />

                <input type="number" name="genderId" value={form.genderId} onChange={handleChange} required
                    placeholder="Lyties ID" className="mb-2 block w-full border px-2 py-1 rounded" />

                <textarea name="description" value={form.description} onChange={handleChange} required
                    placeholder="Aprašymas" className="mb-2 block w-full border px-2 py-1 rounded" rows={3} />

                <input type="number" step="0.01" name="price" value={form.price} onChange={handleChange} required
                    placeholder="Kaina" className="mb-2 block w-full border px-2 py-1 rounded" />

                <input type="number" name="rating" value={form.rating} onChange={handleChange} required
                    placeholder="Įvertinimas (0–255)" className="mb-2 block w-full border px-2 py-1 rounded" />

                <input name="size1" value={form.size1} onChange={handleChange}
                    placeholder="Dydis 1" className="mb-2 block w-full border px-2 py-1 rounded" />
                <input name="size2" value={form.size2} onChange={handleChange}
                    placeholder="Dydis 2" className="mb-2 block w-full border px-2 py-1 rounded" />
                <input name="size3" value={form.size3} onChange={handleChange}
                    placeholder="Dydis 3" className="mb-2 block w-full border px-2 py-1 rounded" />

                <div className="mb-4">
                    <h3 className="font-semibold mb-2">Nuotraukos</h3>
                    {form.images.map((img, idx) => (
                        <div key={idx} className="border p-2 rounded mb-2 bg-gray-50">
                            <input
                                type="text"
                                name="path"
                                placeholder="Kelias"
                                value={img.path}
                                onChange={(e) => handleImageChange(idx, e)}
                                className="mb-1 block w-full border px-2 py-1 rounded"
                                required={idx === 0}
                            />
                            <input
                                type="text"
                                name="title"
                                placeholder="Pavadinimas"
                                value={img.title}
                                onChange={(e) => handleImageChange(idx, e)}
                                className="block w-full border px-2 py-1 rounded"
                            />
                            {idx > 0 && (
                                <button type="button" onClick={() => removeImageField(idx)} className="text-sm text-red-500 mt-1">
                                    Pašalinti
                                </button>
                            )}
                        </div>
                    ))}
                    <button type="button" onClick={addImageField} className="mt-2 px-4 py-1 bg-blue-600 text-white rounded">
                        Pridėti nuotrauką
                    </button>
                </div>

                <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
                    Išsaugoti produktą
                </button>

                {status && <p className="mt-4 text-sm">{status}</p>}
            </form>
        </div>
    );
}
