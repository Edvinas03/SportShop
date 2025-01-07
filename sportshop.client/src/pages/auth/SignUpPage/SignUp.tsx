import { useForm } from "react-hook-form"
import { IUser } from "@/interfaces/IUser";
import { postApi } from "@/api";
import { formStyle } from "@/styles/formStyle";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ErrorBlock } from "@/pages/components/ErrorBlock";

export default function SignUp() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm<IUser & { confirm_password: string }>()
    const navigate = useNavigate();
    const [error, setError] = useState<string | undefined>()

    const storeUser = (data: IUser) => {
        if (error) setError(undefined)
        postApi('authentication/signup', data).then(i => {
            if (i?.error) {
                setError(i.error)
                return
            }
            navigate('/')
        })
    }

    return (
        <form onSubmit={handleSubmit(storeUser)} className='flex flex-col gap-3 max-w-xs'>
            {error ? <div className="text-red-800">{error}</div> : null}
            <div>
                <label htmlFor="userName" className={formStyle.label}>Vartotojo vardas</label>
                <input id="userName" className={formStyle.input} {...register("userName", {
                    required: 'Neįvestas vartotojo vardas',
                    maxLength: {
                        value: 20, message: 'UserName cannot exceed 20 characters'
                    }
                })} />
                <ErrorBlock errors={errors} name="userName" />
            </div>
            <div>
                <label htmlFor="email" className={formStyle.label}>El. paštas</label>
                <input id="email" className={formStyle.input} type="email" {...register("email", { required: 'Neįvestas El. paštas' })} />
                <ErrorBlock errors={errors} name="email" />
            </div>
            <div>
                <label htmlFor="password" className={formStyle.label}>Slaptažodis</label>
                <input type="password" id="password" className={formStyle.input} {...register("password", {
                    required: 'Neįvestas slaptažodis',
                    minLength: { value: 5, message: 'Slaptažodis turi būti bent 5 simbolių ilgio.' },
                    maxLength: { value: 9, message: 'Slaptažodis negali viršyti 9 simbolių' }
                })} />
                <ErrorBlock errors={errors} name="password" />
            </div>
            <div>
                <label htmlFor="confirm_password" className={formStyle.label}>Patvirtinkite slaptažodį</label>
                <input type="password" id="confirm_password" className={formStyle.input} {...register("confirm_password", {
                    required: 'Neįvestas patvirtinimo slaptažodis',
                    validate: (val: string) => {
                        if (watch('password') != val) {
                            return "Jūsų slaptažodžiai nesutampa"
                        }
                    },
                })} />
                <ErrorBlock errors={errors} name="confirm_password" />
            </div>
            <button className={formStyle.button} type="submit">Sukurti</button>
        </form>
    )

}