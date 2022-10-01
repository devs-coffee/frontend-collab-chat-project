import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useSelector, useDispatch } from 'react-redux';

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

export default function Login() {
    const authStatus = useSelector((state:any) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    return (
        <div className="Login">
            <Formik
                initialValues={{
                    email: '',
                    password: ''
                }}
                validate={validate}
                onSubmit={(values) => {
                    authenticationService.login(values)
                    .then(response => {
                        console.log(response);
                        dispatch(setLogs(response.result));
                        navigate('/');
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
        </div>
    )
}