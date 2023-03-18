import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { FormValidationService } from '../../utils/formValidationService';
import { UserService } from '../../services/userService';
import { setUser } from '../../redux/authSlice';
import AvatarCropper from '../../components/avatarCropper/AvatarCropper';
import Modal from '../../components/Modal/modal';

//import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import { Avatar, Breadcrumbs } from '@mui/material';
import HighlightOffTwoToneIcon from '@mui/icons-material/HighlightOffTwoTone';
import EditIcon from '@mui/icons-material/Edit';

import './Profile.scss';

const formValidationService = new FormValidationService();
const userService = new UserService();

export default function Profile() {
    const dispatch = useDispatch();
    const authStatus = useSelector((state:any) => state.auth);
    const [passwordEdit, setPasswordEdit] = useState(false);
    const [ croppedImage, setCroppedImage ] = useState<string>('');
    const [ isOpen, setIsOpen] = useState<boolean>(false);
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

    return (
        <div className="Profile">
            <h2>Profile works !</h2>
            <Formik
                initialValues={{
                    pseudo: authStatus.user.pseudo,
                    password: undefined,
                    passwordConfirm: undefined,
                    oldPassword: undefined,
                    picture: undefined
                }}
                validate={formValidationService.validateProfileUpdate}
                onSubmit={(values) => {
                    /*
                    * //TODO : filtrer les valeurs à envoyer, doivent être différentes du authStatus
                    * // voir avec les touched
                    */
                    if(croppedImage !== '') {
                        values.picture = croppedImage;
                    }
                    
                    userService.updateProfile(values, authStatus.user.id)
                    .then(response => {
                        dispatch(setUser(response.result));
                        setCroppedImage('');
                    })
                    .catch(error => {
                        console.log(error);
                    });
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
                                    <ErrorMessage name="newPassword" />
                                </div>
                                <div className='profile-update-form-new-password-confirm form__fields'>
                                    <label className='form__labels' htmlFor="profile-update_new-password-confirm">Confirmez :</label>
                                    <Field 
                                        type="text"
                                        name="passwordConfirm"
                                        id="profile-update_new-password-confirm"
                                    />
                                    <ErrorMessage name="newPasswordConfirm" />
                                </div>
                                <div className='profile-update-form-old-password form__fields'>
                                    <label className='form__labels' htmlFor="profile-old-password">Mot de passe actuel:</label>
                                    <Field 
                                        type="text"
                                        name="oldPassword"
                                        id="profile-old-password"
                                    />
                                    <ErrorMessage name="oldPassword" />
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
                            {
                            croppedImage && croppedImage !== '' &&
                                <div className="avatar-editor">
                                    <img className="actual-avatar" src={croppedImage} alt="your actual avatar" />
                                    <button onClick={() => setCroppedImage('')}>Cancel</button>
                                </div>
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
        </div>
    )
}