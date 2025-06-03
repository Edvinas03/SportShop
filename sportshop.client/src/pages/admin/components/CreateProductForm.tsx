/*import React, { useState } from 'react';
import useSWR from 'swr';
import Select from 'react-select';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function CreateProductForm() {
    const { data: categories } = useSWR('/api/categories', fetcher);
    const { data: genders } = useSWR('/api/genders', fetcher);

    const [title, setTitle] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const [selectedGender, setSelectedGender] = useState<any>(null);
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [rating, setRating] = useState('');
    const [size1, setSize1] = useState('');
    const [size2, setSize2] = useState('');
    const [size3, setSize3] = useState('');
    const [images, setImages] = useState<FileList | null>(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedCategory || !selectedGender || !images) {
            setErrorMessage('Prašome užpildyti visus laukus ir įkelti nuotraukas.');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('categoryId', selectedCategory.value);
        formData.append('genderId', selectedGender.value);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('rating', rating);
        formData.append('size1', size1);
        formData.append('size2', size2);
        formData.append('size3', size3);

        Array.from(images).forEach((file) => {
            formData.append('images', file);
        });

        const response = await fetch('/api/products', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            setSuccessMessage('Prekė sėkmingai sukurta!');
            setErrorMessage('');
            setTitle('');
            setDescription('');
            setPrice('');
            setRating('');
            setSize1('');
            setSize2('');
            setSize3('');
            setSelectedCategory(null);
            setSelectedGender(null);
            setImages(null);
        } else {
            const error = await response.text();
            setErrorMessage(`Klaida: ${error}`);
            setSuccessMessage('');
        }
    };

    return (
        <div className="max-w-3xl mx-auto bg-white shadow-md p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Sukurti naują prekę</h2>
            {successMessage && <p className="text-green-600 mb-4">{successMessage}</p>}
            {errorMessage && <p className="text-red-600 mb-4">{errorMessage}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Pavadinimas"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border p-2 rounded"
                />
                <Select
                    options={categories?.map(c => ({ value: c.id, label: c.title }))}
                    value={selectedCategory}
                    onChange={setSelectedCategory}
                    placeholder="Pasirinkite kategoriją"
                />
                <Select
                    options={genders?.map(g => ({ value: g.id, label: g.name }))}
                    value={selectedGender}
                    onChange={setSelectedGender}
                    placeholder="Pasirinkite lytį"
                />
                <textarea
                    placeholder="Aprašymas"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border p-2 rounded h-24"
                />
                <input
                    type="number"
                    placeholder="Kaina"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full border p-2 rounded"
                />
                <input
                    type="number"
                    placeholder="Įvertinimas"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full border p-2 rounded"
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                        type="text"
                        placeholder="Dydis 1"
                        value={size1}
                        onChange={(e) => setSize1(e.target.value)}
                        className="border p-2 rounded"
                    />
                    <input
                        type="text"
                        placeholder="Dydis 2"
                        value={size2}
                        onChange={(e) => setSize2(e.target.value)}
                        className="border p-2 rounded"
                    />
                    <input
                        type="text"
                        placeholder="Dydis 3"
                        value={size3}
                        onChange={(e) => setSize3(e.target.value)}
                        className="border p-2 rounded"
                    />
                </div>
                <input
                    type="file"
                    multiple
                    onChange={(e) => setImages(e.target.files)}
                    className="w-full"
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
}*/
