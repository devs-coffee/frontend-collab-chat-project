import { loginForm, loginFormErrors } from "../interfaces/ILoginForm";
import { signupForm, signupFormErrors } from "../interfaces/ISignupForm";
import validationRegexps from "../datas/validationsRegexps";
import { profileUpdateForm, profileUpdateFormErrors } from "../interfaces/IProfileUpdateForm";
import { serverCreationForm, serverCreationFormErrors } from "../interfaces/IServerCreationForm";
import { ServerUpdateValues, ServerUpdateFormErrors } from "../interfaces/IServerUpdateValues";
import { ChannelCreationValues, ChannelCreationErrors } from "../interfaces/IChannel.base";
import { ChannelUpdateErrors, ChannelUpdateValues } from "../interfaces/IChannelUpdateValues";


export type ValidationRules = Array<{ field: string, notValidate: boolean, errors: string }>

const commonEmailValidation = (values: any) =>
([
    { field: 'email', notValidate: !values.email, errors: 'Obligatoire' },
    { field: 'email', notValidate: !validationRegexps.email.test(values.email), errors: 'Adresse mail non valide !' },
])
const commonPseudoValidation = (values: any) =>
([
    { field: 'pseudo', notValidate: !values.pseudo, errors: 'Obligatoire' },
    { field: 'pseudo', notValidate: values.pseudo.length < 4, errors: 'Trop court ! ( 4 caractères minimum )' },
    { field: 'pseudo', notValidate: values.pseudo.length > 20, errors: 'Trop long ! ( 20 caractères max )' },
])
const commonPasswordValidation = (values: any) =>
([
    { field: 'password', notValidate: !values.password, errors: 'Obligatoire' },
    { field: 'password', notValidate: !validationRegexps.password.test(values.password), errors: 'Mot de passe invalide!' },
])

function formatError(validationRules: ValidationRules) {
    const errors: any = {};
    const filterRulesErrors = validationRules.filter(rule => rule.notValidate);

    filterRulesErrors.forEach(rule => {
        if (!errors.hasOwnProperty(rule.field)) {
            errors[rule.field] = rule.errors;
        }
    });

    return errors;
}

export class FormValidationService {

    validateLogin(values: loginForm): loginFormErrors {
        const validationRules: ValidationRules =
            [
                ...commonEmailValidation(values),
                ...commonPasswordValidation(values)
            ];

        return formatError(validationRules);
    }

    validateSignup(values: signupForm): signupFormErrors {
        const validationRules: ValidationRules = [
            ...commonEmailValidation(values),
            ...commonPasswordValidation(values),
            ...commonPseudoValidation(values),
            { field: 'passwordConfirm', notValidate: !values.passwordConfirm, errors: 'Obligatoire' },
            { field: 'passwordConfirm', notValidate: values.passwordConfirm !== values.password, errors: 'Doit correspondre au mot de passe' },
        ]

        return formatError(validationRules);
    }

    validateProfileUpdate(values: profileUpdateForm): profileUpdateFormErrors {
        const validationRules: ValidationRules = [
            { field: 'pseudo', notValidate: values.pseudo !== '' && values.pseudo!.length < 4 && values.pseudo !== '', errors: 'Trop court ! ( 4 caractères minimum )' },
            { field: 'pseudo', notValidate: values.pseudo !== '' && values.pseudo!.length > 20, errors: 'Trop long ! ( 20 caractères max )' },
            { field: 'password', notValidate: values.password !== '' && !validationRegexps.password.test(values.password!), errors: 'Mot de passe invalide!' },
            { field: 'password', notValidate: values.password !== '' && values.oldPassword !== '' && values.password === values.oldPassword, errors: 'Doit être différent du mot de passe actuel!' },
            { field: 'passwordConfirm', notValidate: values.password !== '' && (values.passwordConfirm === '' || values.passwordConfirm !== values.password), errors: 'Doit être différent du mot de passe actuel!' },
            { field: 'passwordConfirm', notValidate: (values.password !== '' || values.passwordConfirm !== '') && values.oldPassword === '', errors: 'Doit être renseigné' },
        ]

        return formatError(validationRules);
    }

    validateServerCreation(values: serverCreationForm): serverCreationFormErrors {
        const validationRules: ValidationRules = [
            { field: 'name', notValidate: values.name !== '' && values.name.length < 4, errors: 'Trop court ! ( 4 caractères minimum )' }
        ]
        return formatError(validationRules);
    }

    validateServerUpdate(values: ServerUpdateValues): ServerUpdateFormErrors {
        const validationRules: ValidationRules = [
            { field: 'name', notValidate: values.name !== '' && values.name!.length < 4, errors: 'Trop court ! ( 4 caractères minimum )' }
        ]
        return formatError(validationRules);
    }

    validateChannelCreation(values: ChannelCreationValues): ChannelCreationErrors {
        const validationRules: ValidationRules = [
            { field: 'title', notValidate: values.title !== '' && values.title!.length < 4, errors: 'Trop court ! ( 4 caractères minimum )' }
        ]
        return formatError(validationRules);
    }

    validateChannelUpdate(values: ChannelUpdateValues) {
        const validationRules: ValidationRules = [
            { field: 'title', notValidate: values.title !== '' && values.title!.length < 4, errors: 'Trop court ! ( 4 caractères minimum )' }
        ]
        return formatError(validationRules);
    }

    getModifiedValues(values: any, initialValues: any): Record<string, any> {
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