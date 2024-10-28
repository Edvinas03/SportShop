import { ErrorMessage } from "@hookform/error-message"
import { formStyle } from "@/styles/formStyle";

type IProps = { errors: any; name: string }

export function ErrorBlock(props: IProps) {
    const { errors, name } = props
    return <ErrorMessage render={({ message }) =>
        <div className={formStyle.errorMessage}>{message}</div>} errors={errors} name={name} />
}