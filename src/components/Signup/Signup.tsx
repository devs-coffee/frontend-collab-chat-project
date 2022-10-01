import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useState } from 'react';

import { setLogs } from '../../redux/authSlice';
import { AuthenticationService } from '../../services/authenticationService';
import { signupForm, signupFormErrors } from '../../interfaces/ISignupForm';

import "./Signup.scss";



const authenticationService = new AuthenticationService();

const validate = (values:signupForm) => {
    const errors:signupFormErrors = {};
    const emailRegexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const passwordRegexp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[+\-/=!@_&*])[0-9a-zA-Z+\-/=!@_&*]{8,}$/;
    //pseudo
    
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
    if(values.email && !emailRegexp.test(values.email)) {
        errors.email = 'Adresse mail non valide !';
    }
    //password
    if(!values.password || values.password === '') {
        errors.password = 'Obligatoire !';
    }
    if(values.password && !passwordRegexp.test(values.password)) {
        errors.password = 'Mot de passe invalide!';
    }
    //passwordConfirm
    if(!values.passwordConfirm || values.passwordConfirm === '') {
        errors.passwordConfirm = 'Obligatoire !'
    }
    if(values.passwordConfirm && values.passwordConfirm !== values.password) {
        errors.passwordConfirm = 'Doit correspondre au mot de passe'
    }
    return errors;
}

export default function Signup() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loginError, setLoginError] = useState(false);
    return (
        <div className="Signup">
            <Formik
                initialValues={{
                    pseudo: '',
                    email: '',
                    password: '',
                    passwordConfirm: '',
                    image: ''
                }}
                validate={validate}
                onSubmit={(values) => {
                    setLoginError(false);
                    authenticationService.signup(values)
                    .then(response => {
                        dispatch(setLogs(response.result));
                        navigate('/');
                    })
                    .catch(error => {
                        setLoginError(true);
                    })
                }}
            >
                {formik => (
                    <Form className="signup-form" >
                        <h2>inscription</h2>
                        <div className="field-box">
                            <div className="signup-form-pseudo signup-form__fields">
                                <label className='signup-form__labels' htmlFor="signup_pseudo">Pseudo :</label>
                                <Field 
                                    type="text"
                                    name="pseudo"
                                    id="signup_pseudo"
                                />
                                <ErrorMessage name="pseudo" />
                            </div>
                            <div className='signup-form-email signup-form__fields'>
                                <label className='signup-form__labels' htmlFor="signup-email">Email :</label>
                                <Field
                                    type="text"
                                    name="email"
                                    id="signup_email"
                                />
                                <ErrorMessage name="email" />
                            </div>
                            <div className="signup-form-password signup-form__fields">
                                <label className="signup-form__labels" htmlFor="signup-password">Mot de passe :</label>
                                <Field
                                    type="text"
                                    name="password"
                                    id="signup_password"
                                />
                                <ErrorMessage name="password" />
                            </div>
                            <div className="signup-form-passwordconfirm signup-form__fields">
                                <label className="signup-form__labels" htmlFor="signup-passwordconfirm">Confirmez :</label>
                                <Field
                                    type="text"
                                    name="passwordConfirm"
                                    id="signup_passwordconfirm"
                                />
                                <ErrorMessage name="passwordConfirm" />
                            </div>
                            <button type="submit" >envoi</button>
                        </div>
                    </Form>
                )}
            </Formik>
            {loginError && <span className='login-error'>Email et / ou mot de passe invalide !</span>}
        </div>
    )
}