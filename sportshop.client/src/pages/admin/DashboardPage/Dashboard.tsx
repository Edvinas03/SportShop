import useSWR from 'swr';
import { useState, useEffect } from 'react';

const fetcher = (url: string) => fetch(url).then(res => res.json());
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function ProductManager() {
    const { data: products, mutate } = useSWR('/api/products/all', fetcher);
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

    return (
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6 p-4">
            <div>
                <h2 className="text-xl font-bold mb-2">Esamos prekės</h2>
                {products?.length ? (
                    <ul className="space-y-2">
                        {products.map((p: any) => (
                            <li
                                key={p.id}
                                className={`flex items-center gap-3 border p-3 rounded cursor-pointer ${selectedProduct?.id === p.id ? 'bg-blue-100' : ''
                                    }`}
                                onClick={() => setSelectedProduct(p)}
                            >
                                {p.images?.length > 0 && (
                                    <img
                                        src={p.images?.length > 0 ? `${backendUrl}/images/${p.images[0].path}` : `${backendUrl}/images/default.jpg`}
                                        alt={p.title}
                                        className="w-14 h-14 object-cover rounded"
                                    />
                                )}
                                <div>
                                    <strong>{p.title}</strong> – {p.price}€
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Nėra prekių.</p>
                )}
            </div>
            <div>
                <CreateProductForm
                    product={selectedProduct}
                    onFinish={() => {
                        mutate();
                        setSelectedProduct(null);
                    }}
                    onReset={() => setSelectedProduct(null)}
                />
            </div>
        </div>
    );
}

function CreateProductForm({
    product,
    onFinish,
    onReset,
}: {
    product?: any;
    onFinish: () => void;
    onReset: () => void;
    }) {
    const isEditing = !!product;
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

    useEffect(() => {
        if (product && categories && genders) {
            const categoryObj = categories.find((c: any) => c.title === product.category);
            const genderObj = genders.find((g: any) => g.name === product.gender);

            setForm({
                title: product.title || '',
                categoryId: categoryObj ? categoryObj.id.toString() : '',
                genderId: genderObj ? genderObj.id.toString() : '',
                description: product.description || '',
                price: product.price?.toString() || '',
                size1: product.size1 || '',
                size2: product.size2 || '',
                size3: product.size3 || '',
            });
        } else if (!product) {
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
        }
    }, [product, categories, genders]);

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

        if (!form.categoryId || !form.genderId || (!isEditing && images.length === 0)) {
            setStatus('Prašome užpildyti visus laukus ir įkelti bent vieną nuotrauką.');
            return;
        }

        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) => formData.append(key, value));
        images.forEach(file => formData.append('images', file));

        try {
            const url = isEditing ? `/api/products/${product.id}` : '/api/products';
            const method = isEditing ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                body: formData,
            });

            if (res.ok) {
                setStatus(isEditing ? '✏️ Prekė atnaujinta' : '✅ Prekė sukurta');
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
                onFinish();
            } else {
                const error = await res.text();
                setStatus('Klaida: ' + error);
            }
        } catch (err: any) {
            setStatus('Tinklo klaida: ' + err.message);
        }
    };

    const handleDelete = async () => {
        if (!product || !confirm('Ar tikrai norite ištrinti šią prekę?')) return;

        const res = await fetch(`/api/products/${product.id}`, {
            method: 'DELETE',
        });

        if (res.ok) {
            setStatus('Prekė ištrinta');
            onFinish();
        } else {
            const error = await res.text();
            setStatus('Klaida trynimo metu: ' + error);
        }
    };

    return (
        <div className="bg-white shadow-md p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">
                {isEditing ? 'Redaguoti prekę' : 'Sukurti naują prekę'}
            </h2>
            {status && <p className="mb-4 text-sm">{status}</p>}
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
                    <option value="" disabled>Pasirinkite kategoriją</option>
                    {categories?.map((c: { id: number; title: string }) => (
                        <option key={c.id} value={c.id.toString()}>{c.title}</option>
                    ))}
                </select>

                <select
                    name="genderId"
                    value={form.genderId}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required
                >
                    <option value="" disabled>Pasirinkite lytį</option>
                    {genders?.map((g: { id: number; name: string }) => (
                        <option key={g.id} value={g.id.toString()}>{g.name}</option>
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

                <div>
                    <label className="block mb-1 font-medium">Pridėti naujas nuotraukas:</label>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImagesChange}
                        className="w-full border p-2 rounded"
                    />
                    {images.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                            {images.map((file, idx) => (
                                <div key={idx} className="w-20 h-20 overflow-hidden rounded border">
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={`preview-${idx}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {isEditing && product.images?.length > 0 && (
                    <div className="mt-4">
                        <label className="block mb-1 font-medium">Esamos nuotraukos:</label>
                        <div className="flex flex-wrap gap-2">
                            {product.images.map((img: any, idx: number) => (
                                <div key={idx} className="w-20 h-20 overflow-hidden rounded border">
                                    <img
                                        src={`${backendUrl}/images/${img.path}`}
                                        alt={`product-${idx}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex gap-2 flex-wrap">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        {isEditing ? 'Išsaugoti' : 'Sukurti prekę'}
                    </button>
                    {isEditing && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                        >
                            Ištrinti
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={onReset}
                        className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                    >
                        Išvalyti
                    </button>
                </div>
            </form>
        </div>
    );
}
