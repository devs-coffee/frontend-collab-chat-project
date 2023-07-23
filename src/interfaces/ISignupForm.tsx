import { loginForm, loginFormErrors } from "./ILoginForm";

export interface signupForm extends loginForm {
    pseudo: string,
    passwordConfirm: string,
    picture: string
}

export interface signupFormErrors extends loginFormErrors {
    pseudo?: string,
    passwordConfirm?: string,
    picture?: string
}