import { useStore, useShallow } from "@/store";
import { postApi } from "@/api";
import { useNavigate } from "react-router";

export function useAuth() {
    const navigate = useNavigate();
    const { setAuth, auth } = useStore(useShallow((state) => ({ setAuth: state.setAuth, auth: state.auth })));

    const logoutHandler = async () => {
        await postApi('authentication/logout', {});
        setAuth(undefined);
        navigate('auth/signin');
    };

    return { logoutHandler, auth, userId: auth?.userId }
}