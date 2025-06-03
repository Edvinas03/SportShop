import { Layout } from "@/pages/Layout";
import Home from "@/pages/HomePage/Home";
import Products from "@/pages/ProductsPage/Products";
import SignUp from "@/pages/auth/SignUpPage/SignUp";
import SignIn from "@/pages/auth/SignInPage/SignIn";
import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "@/ProtectedRoute";
import Dashboard from "@/pages/admin/DashboardPage/Dashboard";
import Cart from "@/pages/ShoppingCartPage/Cart";
import Checkout from "@/pages/CheckoutPage/Checkout";

export function router() {
    return createBrowserRouter([
        {
            path: "/",
            element: <Layout />,
            children: [
                {
                    index: true,
                    Component: Home
                },
                {
                    path: 'auth/signup',
                    Component: SignUp
                },
                {
                    path: 'auth/signin',
                    Component: SignIn
                },
                {
                    path: 'admin/dashboard',
                    element: <ProtectedRoute><Dashboard /></ProtectedRoute>
                },
                {
                    path: 'product/:id',
                    Component: Products
                },
                {
                    path: 'cart',
                    Component: Cart
                },
                {
                    path: 'checkout',
                    Component: Checkout
                }
            ]
        },
    ]);
}
