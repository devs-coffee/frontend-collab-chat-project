import { loginForm, loginFormErrors } from "../interfaces/ILoginForm";
import { signupForm, signupFormErrors } from "../interfaces/ISignupForm";
import validationRegexps from "../datas/validationsRegexps";
import { profileUpdateForm, profileUpdateFormErrors } from "../interfaces/IProfileUpdateForm";
import { serverCreationForm, serverCreationFormErrors } from "../interfaces/IServerCreationForm";
import { serverUpdateForm, serverUpdateFormErrors } from "../interfaces/IServerUpdateForm";

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
        if(values.password && !validationRegexps.password.test(values.password)) {
            errors.password = 'Mot de passe invalide!';
        }
        if(values.password && values.oldPassword && values.password === values.oldPassword) {
            errors.password = 'Doit être différent du mot de passe actuel!';
        }
        //passwordConfirm
        if(values.password !== '' && (values.passwordConfirm === '' || values.passwordConfirm !== values.password)) {
            errors.passwordConfirm = 'Doit correspondre au mot de passe'
        }
        if((values.password !== '' || values.passwordConfirm !== '') && values.oldPassword === '') {
            errors.oldPassword = 'Doit être renseigné'
        }
        
        return errors
    }
    validateServerCreation(values: serverCreationForm):serverCreationFormErrors {
        const errors:serverCreationFormErrors = {};
        //name
        if(values.name && values.name.length < 4) {
            errors.name = 'trop court ! ( 4 caractères minimum )';
        }
        return errors;
    }
    validateServerUpdate(values: serverUpdateForm):serverUpdateFormErrors {
        const errors:serverUpdateFormErrors = {};
        //name
        if(values.name && values.name.length < 4) {
            errors.name = 'trop court ! ( 4 caractères minimum )';
        }
        return errors;
    }

    getModifiedValues (values: any, initialValues: any) : Record<string, any> {
        let modifiedValues: Record<string, any> = {};
        if (values) {
          Object.entries(values).forEach((entry) => {
            let key = entry[0];
            let value = entry[1];
      
            if (value !== initialValues[key]) {
              modifiedValues[key] = value;
            }
          });
        }
      
        return modifiedValues;
    };
}