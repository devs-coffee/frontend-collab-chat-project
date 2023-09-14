import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useState } from 'react';

import { Avatar, Breadcrumbs, Button } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import HighlightOffTwoToneIcon from '@mui/icons-material/HighlightOffTwoTone';
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';

import { setLogs } from '../../../redux/authSlice';
import { signupForm } from '../../../interfaces/ISignupForm';
import { AuthenticationService } from '../../../services/authenticationService';
import { FormValidationService } from '../../../utils/formValidationService';
import { Modal, AvatarCropper, MessageError } from '../../';

import "./Signup.scss";

const formValidationService = new FormValidationService();

export function Signup() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [signupError, setSignupError] = useState<string>('');
    const [croppedImage, setCroppedImage] = useState<string>('');
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const updateImage = (image: string) => {
        setCroppedImage(image);
        setIsOpen(false);
        return image;
    }

    const handlePassowrdHelp = ((value: string): JSX.Element => {
        type PasswordHelp = Array<{ regExp: RegExp | boolean, text: string }>;
        const passwordHelp: PasswordHelp = [
            { regExp: value.length > 8, text: 'au moins 8 caractères', },
            { regExp: /[0-9]/, text: 'un chiffre', },
            { regExp: /[a-z]/, text: 'une minuscule', },
            { regExp: /[A-Z]/, text: 'une majuscule', },
            { regExp: /[+\-/=!@_&*]/, text: 'un caractère spécial parmi + - * / = ! @ _ &', },
        ]

        return (
            <div className="passwordHelper">
                Votre mot de passe doit contenir :
                {passwordHelp.map((value: any) => (<span style={value.regExp ? { color: 'green' } : { color: 'red' }}>{`- ${value.text}`}</span>))}
            </div>
        );
    })

    return (
        <div className="Signup">
            <Formik
                initialValues={{
                    pseudo: '',
                    email: '',
                    password: '',
                    passwordConfirm: '',
                    picture: ''
                }}
                validate={formValidationService.validateSignup}
                onSubmit={async (values: signupForm) => {
                    values.picture = croppedImage;
                    setSignupError('');
                    try {
                        const response = await new AuthenticationService().signup(values);
                        dispatch(setLogs(response.result));
                        navigate('/');
                    } catch (error) {
                        const errorMessage = error as Error;
                        setSignupError(errorMessage.message);
                    }
                }}
            >
                {formik => (
                    <>
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
                                </div>
                                <ErrorMessage name="pseudo" />
                                <div className='signup-form-email form__fields'>
                                    <label className='signup-form__labels' htmlFor="signup-email">Email :</label>
                                    <Field
                                        type="text"
                                        name="email"
                                        id="signup_email"
                                    />
                                </div>
                                <ErrorMessage name="email" />
                                <div className="signup-form-password form__fields">
                                    <label className="form__labels" htmlFor="signup-password">Mot de passe :</label>
                                    <Field
                                        type="text"
                                        name="password"
                                        id="signup_password"
                                    />
                                </div>
                                <ErrorMessage name="password" />
                                <div className="signup-form-passwordconfirm form__fields">
                                    <label className="form__labels" htmlFor="signup-passwordconfirm">Confirmez :</label>
                                    <Field
                                        type="text"
                                        name="passwordConfirm"
                                        id="signup_passwordconfirm"
                                    />
                                </div>
                                <ErrorMessage name="passwordConfirm" />
                                <div className="avatar-managment">
                                    <h3>Avatar :</h3>
                                    {(croppedImage === '')
                                        ?
                                        <Button variant="contained" startIcon={<AddPhotoAlternateIcon />} onClick={() => setIsOpen(true)}>
                                            Ajouter
                                        </Button>
                                        :
                                        <>
                                            <Avatar alt="avatar serveur demandé" src={croppedImage} />
                                            <Breadcrumbs>
                                                <EditIcon sx={{ color: '#1616c4' }} onClick={() => setIsOpen(true)} />
                                                <HighlightOffTwoToneIcon sx={{ color: '#800101' }} onClick={() => setCroppedImage('')} />
                                            </Breadcrumbs>
                                        </>
                                    }
                                </div>
                                {isOpen && <Modal setIsOpen={setIsOpen} childComponent={<AvatarCropper setImage={updateImage} />} />}
                                <Button variant="contained" type='submit' endIcon={<SendIcon />}>Envoyer</Button>
                                <div className={formik.getFieldMeta('password').error ? "invalidPassword" : "validPassword"}>
                                    {handlePassowrdHelp(formik.getFieldProps('password').value)}
                                </div>
                            </div>
                        </Form>
                    </>
                )}
            </Formik>

            <MessageError
                message={signupError}
                open={signupError !== ''}
                setCallbackClose={() => setSignupError('')}
            />

        </div>
    )
}