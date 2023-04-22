import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Avatar, Breadcrumbs, Snackbar } from '@mui/material';
import HighlightOffTwoToneIcon from '@mui/icons-material/HighlightOffTwoTone';
import EditIcon from '@mui/icons-material/Edit';

import { FormValidationService } from '../../utils/formValidationService';
import { UserService } from '../../services/userService';
import { setUser } from '../../redux/authSlice';
import AvatarCropper from '../../components/avatarCropper/AvatarCropper';
import Modal from '../../components/Modal/modal';

import './Profile.scss';
import { AxiosError } from 'axios';

const formValidationService = new FormValidationService();
const userService = new UserService();

export default function Profile() {
    const dispatch = useDispatch();
    const authStatus = useSelector((state:any) => state.auth);
    const [passwordEdit, setPasswordEdit] = useState(false);
    const [ croppedImage, setCroppedImage ] = useState<string>('');
    const [ isOpen, setIsOpen] = useState<boolean>(false);
    const [ profileUpdateError, setProfileUpdateError ] = useState<boolean>(false);
    const [ axiosErrorMessage, setAxiosErrorMessage ] = useState<string>('');


    const togglePasswordEdit = () => {
        setPasswordEdit(!passwordEdit);
    };

    const deleteAvatar = () => {
        userService.updateProfile({picture: null}, authStatus.user.id)
        .then(response => {
            dispatch(setUser(response.result));
            setCroppedImage('');
        })
    }

    const updateImage = (image: string) => {
        setCroppedImage(image);
        setIsOpen(false);
        return image;
    }

    const handleToastClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if(reason === 'clickaway') {
            return;
        }
        setProfileUpdateError(false);
        setAxiosErrorMessage('');
    }

    const initialValues = {
        pseudo: authStatus.user.pseudo,
        password: '',
        passwordConfirm: '',
        oldPassword: '',
        picture: ''
    }

    return (
        <div className="Profile">
            <h2>Profile works !</h2>
            <Formik
                initialValues={initialValues}
                validate={formValidationService.validateProfileUpdate}
                onSubmit={async (values, helper) => {
                    setProfileUpdateError(false);
                    setAxiosErrorMessage('');
                    const modifiedValues = formValidationService.getModifiedValues(values, initialValues);
                    if (croppedImage !== '') {
                        modifiedValues.picture = croppedImage;
                    }
                    if (Object.keys(modifiedValues).length) {
                        try {
                            const response = await userService.updateProfile(modifiedValues, authStatus.user.id);
                            if(response.isSucceed) {
                                dispatch(setUser(response.result));
                                setCroppedImage('');
                                setPasswordEdit(false);
                                helper.resetForm();
                            } else {
                                console.log(response.errorMessage);
                                setAxiosErrorMessage(response.errorMessage!);
                                setProfileUpdateError(false);
                            }
                        } catch(error) {
                            console.log(error);
                            if(error instanceof AxiosError) {
                                setAxiosErrorMessage(error.response?.data.message);
                            } else {
                                setAxiosErrorMessage('Une erreur est survenue, veuillez réessayer');
                            }
                            setProfileUpdateError(true);
                        }
                        
                        
                        
                    }

                }}
            >
                {formik => (
                    <Form className='profile-update-form'>
                        <div className='field-box'>
                            <div className='profile-update-form-pseudo form__fields'>
                                <label className='form__labels' htmlFor='profile-update_pseudo'>Pseudo :</label>
                                <Field
                                    type="text"
                                    name="pseudo"
                                    id="profile-update_pseudo"
                                />
                                <ErrorMessage name="pseudo" />
                            </div>
                        </div>
                        {!passwordEdit && <div className="password-request-button" onClick={togglePasswordEdit}>Changer de mot de passe</div>}
                        {passwordEdit && 
                            <div className='password-update-box field-box'>
                                <div onClick={togglePasswordEdit}>Annuler</div>
                                <div className='profile-update-form-new-password form__fields'>
                                    <label className='form__labels' htmlFor="profile-update_new-password">Nouveau mot de passe :</label>
                                    <Field 
                                        type="text"
                                        name="password"
                                        id="profile-update_new-password"
                                    />
                                    <ErrorMessage name="password" />
                                </div>
                                <div className='profile-update-form-new-password-confirm form__fields'>
                                    <label className='form__labels' htmlFor="profile-update_new-password-confirm">Confirmez :</label>
                                    <Field 
                                        type="text"
                                        name="passwordConfirm"
                                        id="profile-update_new-password-confirm"
                                    />
                                    <ErrorMessage name="passwordConfirm" />
                                </div>
                                <div className='profile-update-form-old-password form__fields'>
                                    <label className='form__labels' htmlFor="profile-old-password">Mot de passe actuel:</label>
                                    <Field 
                                        type="text"
                                        name="oldPassword"
                                        id="profile-old-password"
                                    />
                                </div>
                            </div>
                        }
                        <div className="formgroup-heading">Avatar :</div>
                        <div className='avatar-action'>
                            {(authStatus.user.picture && authStatus.user.picture !== '')
                                ? 
                                    <div className="avatar-editor">
                                        <img className="actual-avatar" src={authStatus.user.picture} alt="your actual avatar" />
                                        <Breadcrumbs>
                                            <EditIcon sx={{ color: '#1616c4' }} onClick={() => setIsOpen(true)} />
                                            <HighlightOffTwoToneIcon sx={{ color: '#800101' }} onClick={deleteAvatar}/>
                                        </Breadcrumbs>
                                    </div>
                                :
                                    <div className='picture'>
                                        <Avatar>{authStatus.user.pseudo.substring(0, 1).toUpperCase()}</Avatar>
                                        <EditIcon className='edit' sx={{ color: '#1616c4' }} onClick={() => setIsOpen(true)} />
                                    </div>
                            } 
                            {croppedImage && croppedImage !== '' &&
                                <>
                                <div>=&gt;</div>
                                <div className="avatar-editor">
                                    <img className="wanted-avatar" src={croppedImage} alt="new avatar" />
                                    <button onClick={() => setCroppedImage('')}>Cancel</button>
                                </div>
                                </>
                            }
                        </div>
                        {isOpen && <Modal setIsOpen={setIsOpen} childComponent={<AvatarCropper setImage={updateImage}/>} />}
                        <br />
                        <br />
                        <br />
                        <button type="submit" >envoi</button>
                    </Form>
                )}
            </Formik>
            <Snackbar 
                open={profileUpdateError}
                autoHideDuration={4000}
                onClose={handleToastClose}
                message={axiosErrorMessage}
            />
        </div>
    )
}