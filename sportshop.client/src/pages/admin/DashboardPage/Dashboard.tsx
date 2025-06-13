import useSWR from 'swr';
import { useState } from 'react';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function CreateProductForm() {
    const { data: categories } = useSWR('/api/categories', fetcher);
    const { data: genders } = useSWR('/api/genders', fetcher);

    const [form, setForm] = useState({
        title: '',
        categoryId: '',
        genderId: '',
        description: '',
        price: '',
        size1: '',
        size2: '',
        size3: '',
    });
    const [images, setImages] = useState<File[]>([]);
    const [status, setStatus] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setImages(Array.from(e.target.files || []));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus(null);

        if (!form.categoryId || !form.genderId || images.length === 0) {
            setStatus('Prašome užpildyti visus laukus ir įkelti bent vieną nuotrauką.');
            return;
        }

        const formData = new FormData();
        formData.append('title', form.title);
        formData.append('categoryId', form.categoryId);
        formData.append('genderId', form.genderId);
        formData.append('description', form.description);
        formData.append('price', form.price);
        formData.append('size1', form.size1);
        formData.append('size2', form.size2);
        formData.append('size3', form.size3);

        images.forEach(file => formData.append('images', file));

        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                setStatus('✅ Prekė sėkmingai sukurta!');
                setForm({
                    title: '',
                    categoryId: '',
                    genderId: '',
                    description: '',
                    price: '',
                    size1: '',
                    size2: '',
                    size3: '',
                });
                setImages([]);
            } else {
                const error = await res.text();
                setStatus('❌ Klaida: ' + error);
            }
        } catch (err: any) {
            setStatus('❌ Tinklo klaida: ' + err.message);
        }
    };

    return (
        <div className="max-w-3xl mx-auto bg-white shadow-md p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Sukurti naują prekę</h2>
            {status && <p className="mb-4">{status}</p>}
            <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
                <input
                    type="text"
                    name="title"
                    placeholder="Pavadinimas"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required
                />

                <select
                    name="categoryId"
                    value={form.categoryId}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required
                >
                    <option value="" disabled>
                        Pasirinkite kategoriją
                    </option>
                    {categories?.map((c: { id: number; title: string }) => (
                        <option key={c.id} value={c.id}>
                            {c.title}
                        </option>
                    ))}
                </select>

                <select
                    name="genderId"
                    value={form.genderId}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required
                >
                    <option value="" disabled>
                        Pasirinkite lytį
                    </option>
                    {genders?.map((g: { id: number; name: string }) => (
                        <option key={g.id} value={g.id}>
                            {g.name}
                        </option>
                    ))}
                </select>

                <textarea
                    name="description"
                    placeholder="Aprašymas"
                    value={form.description}
                    onChange={handleChange}
                    className="w-full border p-2 rounded h-24"
                    required
                />

                <input
                    type="number"
                    name="price"
                    placeholder="Kaina"
                    value={form.price}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                        type="text"
                        name="size1"
                        placeholder="Dydis 1"
                        value={form.size1}
                        onChange={handleChange}
                        className="border p-2 rounded"
                    />
                    <input
                        type="text"
                        name="size2"
                        placeholder="Dydis 2"
                        value={form.size2}
                        onChange={handleChange}
                        className="border p-2 rounded"
                    />
                    <input
                        type="text"
                        name="size3"
                        placeholder="Dydis 3"
                        value={form.size3}
                        onChange={handleChange}
                        className="border p-2 rounded"
                    />
                </div>

                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImagesChange}
                    className="w-full"
                    required
                />

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Sukurti prekę
                </button>
            </form>
        </div>
    );
}
