import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch } from 'react-redux';
import { useState } from 'react';

import { setLogs } from '../../redux/authSlice';
import { AuthenticationService } from '../../services/authenticationService';
import { loginForm, loginFormErrors } from '../../interfaces/ILoginForm';

import "./Login.scss";



const authenticationService = new AuthenticationService();

const validate = (values:loginForm) => {
    const errors:loginFormErrors = {};
    if(!values.email || values.email === '') {
        errors.email = 'Obligatoire !';
    }
    if(!values.password || values.password === '') {
        errors.password = 'Obligatoire !';
    }
    return errors;
}

export default function Login(props:any) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loginError, setLoginError] = useState(false);
    
    return (
        <div className="Login">
            <Formik
                initialValues={{
                    email: '',
                    password: ''
                }}
                validate={validate}
                onSubmit={(values) => {
                    setLoginError(false);
                    authenticationService.login(values)
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
                    <Form className="login-form">
                        <h2>Connexion</h2>
                        <div className="field-box">
                            <div className='login-form-email login-form__fields'>
                                <label className="login-form__labels" htmlFor="login-email">E-mail :</label>
                                <Field
                                    type="text"
                                    name="email"
                                    id="login-email"
                                />
                                <ErrorMessage name="email" />
                            </div>
                            <div className='login-form-password login-form__fields'>
                                <label className="login-form__labels" htmlFor="login-password">Mot de passe</label>
                                <Field
                                    type="text"
                                    name="password"
                                    id="login-password"
                                />
                                <ErrorMessage name="password" />
                            </div>
                        </div>
                        <button type="submit" >envoi</button>
                    </Form>
                )}
            </Formik>
            {loginError && <span className='login-error'>Email et / ou mot de passe invalide !</span>}
        </div>
    )
}