import { Navigate } from "react-router-dom";
import { useStore } from "./store";

export function ProtectedRoute({ children }: { children: JSX.Element }) {
    const auth = useStore((state) => state.auth)
    if (!auth) return null
    if (!auth?.isAuthenticated) {
        return <Navigate to="/auth/signin" />;
    }
    return children;
}