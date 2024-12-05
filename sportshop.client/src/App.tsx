import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes';
import { useStore, useShallow } from '@/store';
import { getApi } from '@/api';
import { IAuth } from '@/interfaces/IAuth';

export default function App() {
    const { auth, setAuth } = useStore(useShallow((state) => ({ auth: state.auth, setAuth: state.setAuth })));

    useEffect(() => {
        if (auth === undefined) {
            getApi<IAuth>('authentication/check-session').then(res => {
                setAuth(res);
            });
        }
    }, [auth]);

    return (
            <RouterProvider router={router()} />
    );
}