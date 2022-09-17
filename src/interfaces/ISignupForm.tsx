import { loginForm } from "./ILoginForm";

export interface signupForm extends loginForm {
    pseudo: string,
    passwordconfirm: string,
    image: string
}