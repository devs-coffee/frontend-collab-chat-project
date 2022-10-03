import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Cropper from 'react-easy-crop';
import { Point, Area } from 'react-easy-crop/types';
import getCroppedImg from '../../services/canvasUtils';
import Slider from '@mui/material/Slider';

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
    const [crop, setCrop] = useState<Point>({ x:0, y: 0 });
    const [ zoom, setZoom ] = useState<number>(1);
    const [ cropperImage, setCropperImage] = useState<string>('');


    const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
        getCroppedImg(cropperImage, croppedArea)
        .then(crop => {
            if(crop) {
                setBase64image(crop);
            }
        })
        .catch(error => {
            console.log(error);
        });
    }, []);
    
    const onFileSelected = ((event:any) => {
        const reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        
        reader.onload = function () {
            if(reader.result) {
                console.log(reader.result.toString());
                setCropperImage(reader.result.toString());
                console.log(cropperImage);
                setBase64image(reader.result.toString());
            }
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
                    password: undefined,
                    passwordConfirm: undefined,
                    oldPassword: undefined,
                    picture: authStatus.user.picture
                    
                }}
                validate={formValidationService.validateProfileUpdate}
                onSubmit={(values) => {
                    ////
                    // TODO : filtrer les valeurs à envoyer, doivent être différentes du authStatus
                    // voir avec les touched
                    ////
                    
                    values.picture = base64image;
                    
                    console.log(values);
                    userService.updateProfile(values, authStatus.user.id)
                    .then(response => {
                        console.log(response);
                        //dispatch
                        // réinitialiser formulaire
                    })
                    .catch(error => {
                        console.log(error);
                    });

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
                                        name="password"
                                        id="profile-update_new-password"
                                    />
                                    <ErrorMessage name="newPassword" />
                                </div>
                                <div className='profile-update-form-new-password-confirm profile-update-form__fields'>
                                    <label className='profile-update-form__labels' htmlFor="profile-update_new-password-confirm">Confirmez :</label>
                                    <Field 
                                        type="text"
                                        name="passwordConfirm"
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
                        <div className="crop-container">
                            <Cropper
                                image={cropperImage}
                                crop={crop}
                                zoom={zoom}
                                aspect={4/3}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                            />
                        </div>
                            
                        <Field type="file" id="image" name="image" onChange={onFileSelected}/>
                        <br />
                        <Slider
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            aria-labelledby="zoom"
                            onChange={(e, zoom) => setZoom(Number(zoom))}
                        />
                        <br />
                        
                        <button type="submit" >envoi</button>
                    </Form>
                )}
            </Formik>
            
            {/* {base64image && <img src={base64image} />} */}
            {authStatus.user.picture && <img src={authStatus.user.picture} />}
        </div>
    )
}