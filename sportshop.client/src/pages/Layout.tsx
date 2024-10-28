import { Link, Outlet, useFetchers, useNavigation } from "react-router-dom";
import { HomeModernIcon, AcademicCapIcon, BookOpenIcon, ShareIcon, ServerStackIcon, PresentationChartBarIcon } from '@heroicons/react/24/outline';
import { useAuth } from "@/hooks/useAuth";
import { UserRoles } from "@/data/userRoles";

export function Layout() {
    const navigation = useNavigation();
    const fetchers = useFetchers();
    const { logoutHandler, auth } = useAuth()
    const fetcherInProgress = fetchers.some((f) =>
        ["loading", "submitting"].includes(f.state)
    );

    return <div className='container mx-auto flex flex-col gap-y-2'>
        <header className='bg-amber-700 text-white p-1'>
            <div className='text-3xl'>GRADEBOOK</div>
            <nav>
                <ul className='flex gap-x-2'>
                    <li>
                        <Link to="/">HOME.<HomeModernIcon className="h-6 w-6 text-white-500" /></Link>
                    </li>
                    {
                        auth?.isAuthenticated ? <>
                            <li>
                                <Link to="/students">Students.<AcademicCapIcon className="h-6 w-6 text-white-500" /></Link>
                            </li>
                            {
                                auth?.role === UserRoles.Admin ?
                                    <li>
                                        <Link to="/admin/dashboard">Admin Panel</Link>
                                    </li> : null
                            }
                            <li>
                                <button onClick={logoutHandler}>Logout</button>
                            </li>
                        </> : <>
                            <li>
                                <Link to="/auth/signup">Registration</Link>
                            </li>
                            <li>
                                <Link to="/auth/signin">Login</Link>
                            </li>
                        </>
                    }
                </ul>
            </nav>
        </header>
        <div>
            {navigation.state !== "idle" && <div className="m-1">Navigation in progress...</div>}
            {fetcherInProgress && <div className="m-1">Fetcher in progress...</div>}
        </div>
        <Outlet />
        <footer className='bg-gray-500 text-white text-sm flex content-center justify-center items-center h-10'>
            <div>Panevėžio kolegija</div>
        </footer>
    </div>
}