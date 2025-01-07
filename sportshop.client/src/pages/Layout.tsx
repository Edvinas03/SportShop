import { Link, Outlet } from "react-router-dom";
import { HomeModernIcon, ShoppingCartIcon, UserIcon, ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/outline';
import { useAuth } from "@/hooks/useAuth";
import { UserRoles } from "@/data/userRoles";
import { useState, useEffect } from "react";

export function Layout() {
    const { logoutHandler, auth } = useAuth();
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const handleScroll = () => setShowButton(window.scrollY > 300);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className='container mx-auto flex flex-col gap-y-4'>
            <header className='bg-amber-700 text-white p-4 flex justify-between items-center'>
                <div className='text-3xl font-bold'>Sport Shop</div>
                <nav>
                    <ul className='flex gap-x-6 items-center'>
                        <li>
                            <Link to="/" className="flex items-center text-lg hover:text-yellow-400">
                                Pagrindinis <HomeModernIcon className="h-6 w-6 ml-2" />
                            </Link>
                        </li>
                        {auth?.isAuthenticated ? (
                            <>
                                {auth?.role === UserRoles.Admin && (
                                    <li>
                                        <Link to="/admin/dashboard" className="flex items-center text-lg hover:text-yellow-400">Administratoriaus skydelis</Link>
                                    </li>
                                )}
                                <li>
                                    <button onClick={logoutHandler} className="flex items-center text-lg hover:text-yellow-400">
                                        Atsijungti <ArrowRightStartOnRectangleIcon className="h-6 w-6 ml-2" />
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                        <Link to="/auth/signin" className="flex items-center text-lg hover:text-yellow-400">
                                            Prisijungimas <UserIcon className="h-6 w-6 ml-2" />
                                        </Link>
                                </li>
                            </>
                        )}
                        <li>
                            <Link to="/cart" className="flex items-center text-lg hover:text-yellow-400">
                                Pirkinių krepšelis <ShoppingCartIcon className="h-6 w-6 ml-2" />
                            </Link>
                        </li>
                    </ul>
                </nav>
            </header>
            <main className="flex-grow">
                <Outlet />
            </main>
            <footer className='bg-gray-700 text-white text-center p-4'>
                <div className="text-sm">© 2024 Sport Shop | All rights reserved</div>
            </footer>
            {showButton && (
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition"
                >
                    Į pradžią
                </button>
            )}
        </div>
    );
}