import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Cropper from 'react-easy-crop';
import { Point, Area } from 'react-easy-crop/types';
import getCroppedImg from '../../utils/canvasUtils';
import { Slider, Badge, Button, Breadcrumbs } from '@mui/material';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import HighlightOffTwoToneIcon from '@mui/icons-material/HighlightOffTwoTone';
import AddAPhotoTwoToneIcon from '@mui/icons-material/AddAPhotoTwoTone';
import { FormValidationService } from '../../utils/formValidationService';
import { UserService } from '../../services/userService';
import { setUser } from '../../redux/authSlice';

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

    const onCropComplete = async (croppedArea: Area, croppedAreaPixels: Area) => {
        const crop = await getCroppedImg(cropperImage, croppedAreaPixels)
        if(crop) {
            setBase64image(crop);
        }
    };

    const askImageSelection = () => {
        const inputEl = document.querySelector('#image') as HTMLInputElement;
        inputEl.click();
    }
    
    const onFileSelected = ((event:any) => {
        const reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = function () {
            if(reader.result) {
                setCropperImage(reader.result.toString());
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

    const avoidImageEdition = () => {
        if(document.getElementById('image')){
            const elt = document.getElementById('image') as HTMLInputElement;
            elt.value="";
        }
        setCropperImage('');
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
                    picture: ""
                }}
                validate={formValidationService.validateProfileUpdate}
                onSubmit={(values) => {
                    ////
                    // TODO : filtrer les valeurs à envoyer, doivent être différentes du authStatus
                    // voir avec les touched
                    ////
                    values.picture = base64image;
                    userService.updateProfile(values, authStatus.user.id)
                    .then(response => {
                        dispatch(setUser(response.result));
                        avoidImageEdition();
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
                        {cropperImage && 
                            <Badge badgeContent={<HighlightOffTwoToneIcon />} color="warning" onClick={avoidImageEdition}>
                                <div className="crop-container">
                                <Cropper
                                    image={cropperImage}
                                    crop={crop}
                                    cropShape="round"
                                    showGrid={false}
                                    zoom={zoom}
                                    aspect={1}
                                    onCropChange={setCrop}
                                    onCropComplete={onCropComplete}
                                    onZoomChange={setZoom}
                                />
                                </div>
                            </Badge>
                            
                        }
                        {cropperImage && <div className="slider-box"><Slider
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            aria-labelledby="zoom"
                            onChange={(e, zoom) => setZoom(Number(zoom))}
                        /></div>}   
                        <Field type="file" id="image" name="image" onChange={onFileSelected} />
                        {authStatus.user.picture && 
                            <div className="avatar-editor">
                                <img className="actual-avatar" src={authStatus.user.picture} alt="your actual avatar" />
                            <Breadcrumbs>
                                <ChangeCircleIcon sx={{ color: '#1616c4' }} onClick={askImageSelection} />
                                <HighlightOffTwoToneIcon sx={{ color: '#800101' }}/>
                            </Breadcrumbs>
                            </div>
                            
                        
                        }
                        {!authStatus.user.picture && <div>
                                <span>aucun</span><br/>
                                <Button variant="contained" startIcon={<AddAPhotoTwoToneIcon />}>
                                    Send
                                </Button>
                            </div>
                        }
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