import { Formik, Form, Field, ErrorMessage, useField } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { AxiosError } from 'axios';

import { Avatar, Breadcrumbs, Button } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import HighlightOffTwoToneIcon from '@mui/icons-material/HighlightOffTwoTone';
import EditIcon from '@mui/icons-material/Edit';
import { Snackbar } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

import { setLogs } from '../../../redux/authSlice';
import { signupForm } from '../../../interfaces/ISignupForm';
import { AuthenticationService } from '../../../services/authenticationService';
import { FormValidationService } from '../../../utils/formValidationService';
import { Modal, AvatarCropper } from '../../index';

import "./Signup.scss";

const formValidationService = new FormValidationService();

export function Signup() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [signupError, setSignupError] = useState<{ isError: boolean, errorMessage: string }>({ isError: false, errorMessage: '' });
    const [croppedImage, setCroppedImage] = useState<string>('');
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const updateImage = (image: string) => {
        setCroppedImage(image);
        setIsOpen(false);
        return image;
    }

    const handleToastClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSignupError({ isError: false, errorMessage: '' });
    }

    const handlePassowrdHelp = ((value:string) => {
        let number = value.match(/[0-9]/);
        let lower = value.match(/[a-z]/);
        let upper = value.match(/[A-Z]/);
        let special = value.match(/[+\-/=!@_&*]/);
        let size = value.length >= 8;
        if(number && lower && upper && special && size) {
            return ;
        }
        return (
        <div className="passwordHelper" style={{whiteSpace: 'pre'}}>
            <p>
                Votre mot de passe doit contenir :<br/>
                <span style={size ?{color : 'green'} : { color: 'red'}}>- au moins 8 caractères</span><br/>
                <span style={number ?{color : 'green'} : { color: 'red'}}>- un chiffre</span><br/>
                <span style={lower ?{color : 'green'} : { color: 'red'}}>- une minuscule</span><br/>
                <span style={upper ?{color : 'green'} : { color: 'red'}}>- une majuscule</span><br/>
                <span style={special ?{color : 'green'} : { color: 'red'}}>- un caractère spécial parmi + - * / = ! @ _ &</span>
            </p>
            
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
                    setSignupError({ isError: false, errorMessage: '' });
                    try {
                        const response = await new AuthenticationService().signup(values);
                        dispatch(setLogs(response.result));
                        navigate('/');
                    } catch (error) {
                        let errorMessage: string = 'Une erreur est survenue, c\'est ballot.';
                        if (error instanceof AxiosError) {
                            errorMessage = error.response?.data.message;
                        }
                        setSignupError({ isError: true, errorMessage });
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
                                    //onChange={() => handlePassowrdHelp(formik.getFieldProps('password').value)}
                                />
                            </div>
                            <ErrorMessage name="password" />
                            <div className="signup-form-passwordconfirm form__fields">
                                <label className="form__labels" htmlFor="signup-passwordconfirm">Confirmez :</label>
                                <Field
                                    type="text"
                                    name="passwordConfirm"
                                    id="signup_passwordconfirm"
                                    //onFocus={setIsPasswordTouched(true)}
                                    
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
                        </div>
                    </Form>
                    {formik.getFieldMeta('password').value && 
                        handlePassowrdHelp(formik.getFieldProps('password').value)
                    }
                    </>
                )}
            </Formik>
            
            <Snackbar
                open={signupError.isError}
                autoHideDuration={4000}
                onClose={handleToastClose}
                message={signupError.errorMessage}
            />
        </div>
    )
}