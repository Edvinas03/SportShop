import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IProduct } from "@/interfaces/IProduct";
import { getApi } from "@/api";

export default function Home() {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [hasMoreProducts, setHasMoreProducts] = useState(true);
    const pageSize = 4;
    const [category, setCategory] = useState<string | null>(null);
    const [gender, setGender] = useState<string | null>(null);
    const [minPrice, setMinPrice] = useState<number | null>(null);
    const [maxPrice, setMaxPrice] = useState<number | null>(null);

    const fetchProducts = async (currentPage: number) => {
        try {
            let query = `products?page=${currentPage}&pageSize=${pageSize}`;
            if (category) query += `&category=${category}`;
            if (gender) query += `&gender=${gender}`;
            if (minPrice !== null) query += `&minPrice=${minPrice}`;
            if (maxPrice !== null) query += `&maxPrice=${maxPrice}`;

            const response = await getApi<IProduct[]>(query);

            if (response?.error) {
                console.error("API Error:", response.error);
                return;
            }

            if (Array.isArray(response)) {
                if (response.length < pageSize) {
                    setHasMoreProducts(false);
                }

                setProducts((prevProducts) => {
                    const newProducts = response.filter(
                        (newProduct) =>
                            !prevProducts.some((prevProduct) => prevProduct.id === newProduct.id)
                    );
                    return [...prevProducts, ...newProducts];
                });
            } else {
                console.error("Response is not an array");
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(page);
    }, [page]);

    const applyFilters = () => {
        setProducts([]);
        setPage(1);
        setHasMoreProducts(true);
        fetchProducts(1);
    };

    const loadMore = () => {
        if (hasMoreProducts && !loading) {
            setPage((prev) => prev + 1);
        }
    };

    if (loading && page === 1) return <div className="text-center py-8">Loading...</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
                Prekių sąrašas
            </h1>

            <div className="mb-6">
                <div className="flex gap-6 justify-center">
                    <select
                        value={category || ""}
                        onChange={(e) => setCategory(e.target.value)}
                        className="p-2 border rounded"
                    >
                        <option value="">Prekių kategorija</option>
                        <option value="Sports">Sportiniai batai</option>
                        <option value="Tennis">Teniso batai</option>
                        <option value="Running">Bėgimo batai</option>
                        <option value="Pants">Kelnės</option>
                        <option value="Shirts">Marškinėliai</option>
                        <option value="Skirts">Sijonai</option>
                        <option value="Sweaters">Džemperiai</option>
                        <option value="Hats">Kepurės</option>
                        <option value="Gloves">Pirštinės</option>
                        <option value="Jackets">Striukės</option>
                    </select>

                    <select
                        value={gender || ""}
                        onChange={(e) => setGender(e.target.value)}
                        className="p-2 border rounded"
                    >
                        <option value="">Lytis</option>
                        <option value="Wo">Moterims</option>
                        <option value="Men">Vyrams</option>
                        <option value="Unisex">Mot/Vyr</option>
                    </select>

                    <div className="flex gap-2 items-center">
                        <input
                            type="number"
                            value={minPrice || ""}
                            onChange={(e) => setMinPrice(Number(e.target.value))}
                            placeholder="Kaina nuo"
                            className="p-2 border rounded"
                        />
                        <span>-</span>
                        <input
                            type="number"
                            value={maxPrice || ""}
                            onChange={(e) => setMaxPrice(Number(e.target.value))}
                            placeholder="Kaina iki"
                            className="p-2 border rounded"
                        />
                    </div>

                    <button
                        onClick={applyFilters}
                        className="bg-blue-500 text-white p-2 rounded"
                    >
                        Ieškoti
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="relative p-4 border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition duration-300 animate-fadeIn"
                    >
                        <div className="relative">
                            <Link to={`/product/${product.id}`}>
                                <img
                                    src={`/images/${product.image.path}`}
                                    alt={product.image.title}
                                    className="w-full h-56 object-contain rounded-md"
                                />
                            </Link>
                        </div>
                        <h2 className="mt-2 text-lg font-semibold text-gray-900 hover:text-blue-500 transition duration-300">
                            {product.title}
                        </h2>
                        <div className="mt-2 text-gray-600">Kaina: {product.price} €</div>
                        <div className="mt-1 text-gray-500">Įvertinimas: {product.rating}</div>
                    </div>
                ))}
            </div>

            <div className="mt-6 text-center">
                <button
                    onClick={loadMore}
                    disabled={loading || !hasMoreProducts}
                    className={`flex items-center justify-center px-4 py-2 rounded-lg text-white ${hasMoreProducts ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"}`}
                >
                    {loading ? "Loading..." : hasMoreProducts ? "Daugiau prekių" : "Daugiau prekių nėra"}
                </button>
            </div>
        </div>
    );
}