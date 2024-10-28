import { formStyle } from "@/styles/formStyle";
import { ErrorBlock } from "@/pages/components/ErrorBlock";
import { IUser } from "@/interfaces/IUser";
import { useForm } from "react-hook-form"
import { useState } from "react";
import { postApi } from "@/api";
import { useNavigate } from "react-router-dom";
import { useStore, useShallow } from "@/store";
import { IAuth } from "@/interfaces/IAuth";

export default function SignIn() {
    const [error, setError] = useState<string | undefined>();
    const { setAuth } = useStore(useShallow((state) => ({ setAuth: state.setAuth })));
    const { register, handleSubmit, formState: { errors } } = useForm<IUser>();
    const navigate = useNavigate();


    const loginHandler = (data: IUser) => {
        if (error) setError(undefined)
        postApi<IAuth>('authentication/signin', data).then(response => {
            if (response?.error) {
                setError(response.error)
                return
            }
            setAuth(response)
            navigate('/')
        })
    }

    return (
        <form onSubmit={handleSubmit(loginHandler)} className='flex flex-col gap-3 max-w-xs'>
            {error ? <div className="text-red-800">{error}</div> : null}
            <div>
                <label htmlFor="email" className={formStyle.label}>Email</label>
                <input id="email" className={formStyle.input} type="email" {...register("email", {
                    required: 'Email is required'
                })} />
                <ErrorBlock errors={errors} name="email" />
            </div>
            <div>
                <label htmlFor="password" className={formStyle.label}>Password</label>
                <input type="password" id="password" className={formStyle.input} {...register("password", {
                    required: 'Password is required'
                })} />
                <ErrorBlock errors={errors} name="password" />
            </div>
            <button className={formStyle.button} type="submit">Login</button>
        </form>
    )

}