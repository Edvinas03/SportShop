import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { IProduct } from "@/interfaces/IProduct";
import { getApi } from "@/api";

export default function Home() {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [hasMoreProducts, setHasMoreProducts] = useState(true);
    const pageSize = 10;

    const [searchParams, setSearchParams] = useSearchParams();

    const category = searchParams.get("category");
    const gender = searchParams.get("gender");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    const [localCategory, setLocalCategory] = useState(category || "");
    const [localGender, setLocalGender] = useState(gender || "");
    const [localMinPrice, setLocalMinPrice] = useState(minPrice || "");
    const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice || "");

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const fetchProducts = async (currentPage: number) => {
        try {
            let query = `products?page=${currentPage}&pageSize=${pageSize}`;
            if (category) query += `&category=${category}`;
            if (gender) query += `&gender=${gender}`;
            if (minPrice) query += `&minPrice=${minPrice}`;
            if (maxPrice) query += `&maxPrice=${maxPrice}`;

            const response = await getApi<IProduct[]>(query);

            if (response?.error) {
                console.error("API Error:", response.error);
                return;
            }

            if (Array.isArray(response)) {
                if (response.length < pageSize) {
                    setHasMoreProducts(false);
                }

                setProducts((prev) => {
                    const newItems = response.filter((item) =>
                        !prev.some((p) => p.id === item.id)
                    );
                    return [...prev, ...newItems];
                });
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setProducts([]);
        setPage(1);
        setHasMoreProducts(true);
        fetchProducts(1);
    }, [searchParams]);

    useEffect(() => {
        if (page > 1) {
            fetchProducts(page);
        }
    }, [page]);

    const applyFilters = () => {
        const params: any = {};
        if (localCategory) params.category = localCategory;
        if (localGender) params.gender = localGender;
        if (localMinPrice) params.minPrice = localMinPrice;
        if (localMaxPrice) params.maxPrice = localMaxPrice;
        setSearchParams(params);
    };

    const clearFilters = () => {
        setLocalCategory("");
        setLocalGender("");
        setLocalMinPrice("");
        setLocalMaxPrice("");
        setSearchParams({});
    };

    const loadMore = () => {
        if (hasMoreProducts && !loading) {
            setPage((prev) => prev + 1);
        }
    };

    if (loading && page === 1) return <div className="text-center py-8">Įkeliama...</div>;

    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-900 tracking-tight">
                Prekių sąrašas
            </h1>

            <div className="mb-8">
                <div className="flex flex-wrap gap-4 justify-center">
                    <select
                        value={localCategory}
                        onChange={(e) => setLocalCategory(e.target.value)}
                        className="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                        value={localGender}
                        onChange={(e) => setLocalGender(e.target.value)}
                        className="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        <option value="">Lytis</option>
                        <option value="Wo">Moterims</option>
                        <option value="Men">Vyrams</option>
                        <option value="Unisex">Visiems</option>
                    </select>

                    <div className="flex gap-2 items-center">
                        <input
                            type="number"
                            value={localMinPrice}
                            onChange={(e) => setLocalMinPrice(e.target.value)}
                            placeholder="Kaina nuo"
                            className="w-24 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <span className="text-gray-500">-</span>
                        <input
                            type="number"
                            value={localMaxPrice}
                            onChange={(e) => setLocalMaxPrice(e.target.value)}
                            placeholder="Kaina iki"
                            className="w-24 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <button
                        onClick={applyFilters}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition"
                    >
                        Ieškoti
                    </button>

                    <button
                        onClick={clearFilters}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded-lg transition"
                    >
                        Šalinti filtrus
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="bg-white p-4 rounded-xl border border-gray-200 shadow hover:shadow-lg transition duration-300 animate-fadeIn"
                    >
                        <Link to={{ pathname: `/product/${product.id}`, search: searchParams.toString() }}>
                            <img
                                src={
                                    product.images?.[0]?.path
                                        ? `${backendUrl}/images/${product.images[0].path}`
                                        : `${backendUrl}/images/default.jpg`
                                }
                                alt={product.title}
                                className="w-full h-56 object-contain rounded-lg mb-2"
                            />
                            <h2 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition">
                                {product.title}
                            </h2>
                        </Link>
                        <p className="mt-1 text-lg font-semibold text-green-600">Kaina: {product.price} €</p>
                    </div>
                ))}
            </div>

            <div className="mt-10 text-center">
                <button
                    onClick={loadMore}
                    disabled={loading || !hasMoreProducts}
                    className={`px-6 py-3 text-white text-lg rounded-lg font-semibold transition-colors duration-300 ${hasMoreProducts
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "bg-gray-400 cursor-not-allowed"
                        } flex items-center justify-center gap-2`}
                >
                    {loading && (
                        <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    )}
                    {loading ? "Įkeliama..." : hasMoreProducts ? "Daugiau prekių" : "Daugiau prekių nėra"}
                </button>
            </div>
        </div>
    );
}
