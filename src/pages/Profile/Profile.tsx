import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { FormValidationService } from '../../services/formValidationService';
import { UserService } from '../../services/userService';

import './Profile.scss';

const formValidationService = new FormValidationService();
const userService = new UserService();


export default function Profile() {
    const dispatch = useDispatch();
    const authStatus = useSelector((state:any) => state.auth);
    const [base64image, setBase64image] = useState('');
    const [passwordEdit, setPasswordEdit] = useState(false);
    const onFileSelected = ((event:any) => {
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = function () {
            if(reader.result)
            setBase64image(reader.result.toString());
            
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    })
    const togglePasswordEdit = () => {
        setPasswordEdit(!passwordEdit);
    }
    return (
        <div className="Profile">
            <h2>Profile works !</h2>
            <Formik
                initialValues={{
                    pseudo: authStatus.user.pseudo,
                    password: '',
                    passwordConfirm: '',
                    oldPassword: '',
                    picture: ''
                    
                }}
                validate={formValidationService.validateProfileUpdate}
                onSubmit={(values) => {
                    values.picture = base64image;
                    console.log(values);
                    userService.updateProfile(values, authStatus.user.id);
                }}
            >
                {formik => (
                    <Form className='profile-update-form'>
                        <div className='field-box'>
                            <div className='profile-update-form-pseudo profile-update-form__fields'>
                                <label className='profile-update-form__labels' htmlFor='profile-update_pseudo'>Pseudo :</label>
                                <Field
                                    type="text"
                                    name="pseudo"
                                    id="profile-update_pseudo"
                                />
                                <ErrorMessage name="pseudo" />
                            </div>
                        </div>
                        {!passwordEdit && <div onClick={togglePasswordEdit}>Changer de mot de passe</div>}
                        {passwordEdit && 
                            <div className='password-update-box'>
                                <div onClick={togglePasswordEdit}>Annuler</div>
                                <div className='profile-update-form-new-password profile-update-form__fields'>
                                    <label className='profile-update-form__labels' htmlFor="profile-update_new-password">Nouveau mot de passe :</label>
                                    <Field 
                                        type="text"
                                        name="Password"
                                        id="profile-update_new-password"
                                    />
                                    <ErrorMessage name="newPassword" />
                                </div>
                                <div className='profile-update-form-new-password-confirm profile-update-form__fields'>
                                    <label className='profile-update-form__labels' htmlFor="profile-update_new-password-confirm">Confirmez :</label>
                                    <Field 
                                        type="text"
                                        name="PasswordConfirm"
                                        id="profile-update_new-password-confirm"
                                    />
                                    <ErrorMessage name="newPasswordConfirm" />
                                </div>
                                <div className='profile-update-form-old-password profile-update-form__fields'>
                                    <label className='profile-update-form__labels' htmlFor="profile-old-password">Mot de passe actuel:</label>
                                    <Field 
                                        type="text"
                                        name="oldPassword"
                                        id="profile-old-password"
                                    />
                                    <ErrorMessage name="oldPassword" />
                                </div>
                            </div>
                        }
                        <Field type="file" id="image" name="image" onChange={onFileSelected}/>
                        <button type="submit" >envoi</button>
                    </Form>
                )}
            </Formik>
            {base64image && <img src={base64image} />}
        </div>
    )
}