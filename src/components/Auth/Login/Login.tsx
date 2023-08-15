import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch } from 'react-redux';
import { useState } from 'react';

import { Button, Snackbar } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

import { setLogs } from '../../../redux/authSlice';
import { AuthenticationService } from '../../../services/authenticationService';
import { FormValidationService } from '../../../utils/formValidationService';

import "./Login.scss";

const formValidationService = new FormValidationService();

export function Login(props: any) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loginError, setLoginError] = useState(false);

    const handleToastClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setLoginError(false);
    }

    return (
        <div className="Login">
            <Formik
                initialValues={{
                    email: '',
                    password: ''
                }}
                validate={formValidationService.validateLogin}
                onSubmit={async (values) => {
                    setLoginError(false);
                    try {
                        const response = await new AuthenticationService().login(values);
                        dispatch(setLogs(response.result));
                        navigate('/');
                    } catch (error) {
                        setLoginError(true);
                    }
                }}
            >
                {formik => (
                    <Form className="login-form">
                        <h2>Connexion</h2>
                        <div className="field-box">
                            <div className='login-form-email form__fields'>
                                <label className="form__labels" htmlFor="login-email">E-mail :</label>
                                <Field
                                    type="text"
                                    name="email"
                                    id="login-email"
                                />
                            </div>
                            <ErrorMessage name="email" />
                            <div className='login-form-password form__fields'>
                                <label className="form__labels" htmlFor="login-password">Mot de passe :</label>
                                <Field
                                    type="text"
                                    name="password"
                                    id="login-password"
                                />
                            </div>
                            <ErrorMessage name="password" />
                            <div>
                                <Button variant="contained" type='submit' endIcon={<SendIcon />}>Envoyer</Button>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
            {loginError && <Snackbar
                open={loginError}
                autoHideDuration={4000}
                onClose={handleToastClose}
                message="Email et / ou mot de passe invalide !"
            />}
        </div>
    )
}