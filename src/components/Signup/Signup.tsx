import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useState } from 'react';

import { setLogs } from '../../redux/authSlice';
import { AuthenticationService } from '../../services/authenticationService';
import { FormValidationService } from '../../utils/formValidationService';

import "./Signup.scss";

const authenticationService = new AuthenticationService();
const formValidationService = new FormValidationService();

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
                validate={formValidationService.validateSignup}
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
                            <div className="signup-form-pseudo form__fields">
                                <label className='form__labels' htmlFor="signup_pseudo">Pseudo :</label>
                                <Field 
                                    type="text"
                                    name="pseudo"
                                    id="signup_pseudo"
                                />
                                <ErrorMessage name="pseudo" />
                            </div>
                            <div className='signup-form-email form__fields'>
                                <label className='signup-form__labels' htmlFor="signup-email">Email :</label>
                                <Field
                                    type="text"
                                    name="email"
                                    id="signup_email"
                                />
                                <ErrorMessage name="email" />
                            </div>
                            <div className="signup-form-password form__fields">
                                <label className="form__labels" htmlFor="signup-password">Mot de passe :</label>
                                <Field
                                    type="text"
                                    name="password"
                                    id="signup_password"
                                />
                                <ErrorMessage name="password" />
                            </div>
                            <div className="signup-form-passwordconfirm form__fields">
                                <label className="form__labels" htmlFor="signup-passwordconfirm">Confirmez :</label>
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