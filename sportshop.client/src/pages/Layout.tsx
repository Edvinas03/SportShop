import { Link, Outlet, useLocation } from "react-router-dom";
import {
    HomeModernIcon,
    ShoppingCartIcon,
    UserIcon,
    ArrowRightStartOnRectangleIcon,
    BoltIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/hooks/useAuth";
import { UserRoles } from "@/data/userRoles";
import { useState, useEffect } from "react";

export function Layout() {
    const location = useLocation();
    const { logoutHandler, auth } = useAuth();
    const [showButton, setShowButton] = useState(false);
    const [pageReady, setPageReady] = useState(false);

    useEffect(() => {
        const handleScroll = () => setShowButton(window.scrollY > 300);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        setPageReady(false);
        const timeout = setTimeout(() => setPageReady(true), 50);
        return () => clearTimeout(timeout);
    }, [location.pathname]);

    return (
        <div className="container mx-auto flex flex-col min-h-screen gap-y-6 font-sans">
            <header className="relative bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white p-6 flex flex-col md:flex-row md:justify-between items-center gap-y-3 shadow-lg overflow-hidden backdrop-blur-sm bg-opacity-80">
                <Link
                    to="/"
                    className="flex items-center gap-2 text-3xl font-extrabold tracking-wide select-none cursor-default z-10 hover:text-yellow-300 transition-shadow duration-300 ease-in-out hover:drop-shadow-[0_0_10px_rgba(252,211,77,0.7)]">
                    <BoltIcon className="h-8 w-8 text-yellow-400 animate-pulse-slow" />
                    Sportukas
                </Link>

                <nav className="z-10">
                    <ul className="flex flex-wrap justify-center md:justify-end gap-6 items-center text-lg font-medium">
                        <li>
                            <Link
                                to="/"
                                className="flex items-center gap-1 text-blue-200 hover:text-white transition-colors duration-300 ease-in-out relative group"
                            >
                                Pagrindinis <HomeModernIcon className="h-6 w-6" />
                                <span className="absolute left-0 -bottom-1 w-0 group-hover:w-full transition-all h-[2px] bg-yellow-400 rounded"></span>
                            </Link>
                        </li>
                        {auth?.isAuthenticated ? (
                            <>
                                {auth?.role === UserRoles.Admin && (
                                    <li>
                                        <Link
                                            to="/admin/dashboard"
                                            className="text-blue-200 hover:text-white transition relative group"
                                        >
                                            Administratoriaus skydelis
                                            <span className="absolute left-0 -bottom-1 w-0 group-hover:w-full transition-all h-[2px] bg-yellow-400 rounded"></span>
                                        </Link>
                                    </li>
                                )}
                                <li>
                                    <button
                                        onClick={logoutHandler}
                                        className="flex items-center gap-1 text-blue-200 hover:text-white transition focus:outline-none relative group"
                                    >
                                        Atsijungti <ArrowRightStartOnRectangleIcon className="h-6 w-6" />
                                        <span className="absolute left-0 -bottom-1 w-0 group-hover:w-full transition-all h-[2px] bg-yellow-400 rounded"></span>
                                    </button>
                                </li>
                            </>
                        ) : (
                            <li>
                                <Link
                                    to="/auth/signin"
                                    className="flex items-center gap-1 text-blue-200 hover:text-white transition relative group"
                                >
                                    Prisijungimas <UserIcon className="h-6 w-6" />
                                    <span className="absolute left-0 -bottom-1 w-0 group-hover:w-full transition-all h-[2px] bg-yellow-400 rounded"></span>
                                </Link>
                            </li>
                        )}
                        <li>
                            <Link
                                to="/cart"
                                className="flex items-center gap-1 text-blue-200 hover:text-white transition relative group"
                            >
                                Pirkinių krepšelis <ShoppingCartIcon className="h-6 w-6" />
                                <span className="absolute left-0 -bottom-1 w-0 group-hover:w-full transition-all h-[2px] bg-yellow-400 rounded"></span>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </header>

            <main className="flex-grow p-6 bg-gradient-to-b from-white to-blue-50 rounded-lg shadow-inner">
                <div
                    className={`transition-all duration-300 ease-in-out ${pageReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                        }`}
                >
                    <Outlet />
                </div>
            </main>

            <footer className="bg-blue-900 text-blue-100 text-center py-4 mt-6 rounded-t-lg shadow-inner select-none">
                <div className="text-sm font-light">© 2025 Sport Shop | All rights reserved</div>
            </footer>

            {showButton && (
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-blue-500/80 transition-transform transform hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-300 animate-pulse"
                    aria-label="Scroll to top"
                >
                    Į pradžią
                </button>
            )}
        </div>
    );
}
