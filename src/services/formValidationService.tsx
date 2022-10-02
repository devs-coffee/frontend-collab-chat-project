import { loginForm, loginFormErrors } from "../interfaces/ILoginForm";
import { signupForm, signupFormErrors } from "../interfaces/ISignupForm";
import validationRegexps from "../datas/validationsRegexps";
import { profileUpdateForm, profileUpdateFormErrors } from "../interfaces/IProfileUpdateForm";

export class FormValidationService {
    validateLogin(values:loginForm):loginFormErrors {
        const errors:loginFormErrors = {};
    if(!values.email || values.email === '') {
        errors.email = 'Obligatoire !';
    }
    if(!values.password || values.password === '') {
        errors.password = 'Obligatoire !';
    }
    return errors;
    }
    validateSignup(values:signupForm):signupFormErrors {
        const errors:signupFormErrors = {};
        if(!values.pseudo || values.pseudo === '') {
            errors.pseudo = 'Obligatoire !';
        }
        if (values.pseudo.length < 4 && values.pseudo !== '') {
            errors.pseudo = 'Trop court ! ( 4 caractères minimum )';
        }
        if(values.pseudo.length > 20) {
            errors.pseudo = 'Trop long ! ( 20 caractères max )';
        }
        //email
        if(!values.email || values.email === '') {
            errors.email = 'Obligatoire !';
        }
        if(values.email && !validationRegexps.email.test(values.email)) {
            errors.email = 'Adresse mail non valide !';
        }
        //password
        if(!values.password || values.password === '') {
            errors.password = 'Obligatoire !';
        }
        if(values.password && !validationRegexps.password.test(values.password)) {
            errors.password = 'Mot de passe invalide!';
        }
        //passwordConfirm
        if(!values.passwordConfirm || values.passwordConfirm === '') {
            errors.passwordConfirm = 'Obligatoire !'
        }
        if(values.passwordConfirm && values.passwordConfirm !== values.password) {
            errors.passwordConfirm = 'Doit correspondre au mot de passe'
        }
        //image
        return errors;
    }
    validateProfileUpdate(values:profileUpdateForm):profileUpdateFormErrors {
        const errors:profileUpdateFormErrors = {};
        //pseudo
        if (values.pseudo && values.pseudo.length < 4 && values.pseudo !== '') {
            errors.pseudo = 'Trop court ! ( 4 caractères minimum )';
        }
        if(values.pseudo && values.pseudo.length > 20) {
            errors.pseudo = 'Trop long ! ( 20 caractères max )';
        }
        //password
        if(values.newPassword && !validationRegexps.password.test(values.newPassword)) {
            errors.newPassword = 'Mot de passe invalide!';
        }
        if(values.newPassword && values.oldPassword && values.newPassword === values.oldPassword) {
            errors.newPassword = 'Doit être différent du mot de passe actuel!';
        }
        //passwordConfirm
        if(values.newPassword && values.newPasswordConfirm && values.newPasswordConfirm !== values.newPassword) {
            errors.newPasswordConfirm = 'Doit correspondre au mot de passe'
        }
        //image
        if(values.image) {
            console.log(values.image);
        }
        return errors
    }
}