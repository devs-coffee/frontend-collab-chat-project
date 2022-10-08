import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { Button, Slider, Badge } from '@mui/material';
import AddAPhotoTwoToneIcon from '@mui/icons-material/AddAPhotoTwoTone';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import HighlightOffTwoToneIcon from '@mui/icons-material/HighlightOffTwoTone';
import Cropper from 'react-easy-crop';
import { Point, Area } from 'react-easy-crop/types';

import { setLogs } from '../../../redux/authSlice';
import { AuthenticationService } from '../../../services/authenticationService';
import { FormValidationService } from '../../../utils/formValidationService';
import getCroppedImg from '../../../utils/canvasUtils';

import "./Signup.scss";

const authenticationService = new AuthenticationService();
const formValidationService = new FormValidationService();

export default function Signup() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loginError, setLoginError] = useState<boolean>(false);

    const [base64image, setBase64image] = useState<string>('');
    const [ crop, setCrop ] = useState<Point>({ x:0, y: 0 });
    const [ zoom, setZoom ] = useState<number>(1);
    const [ cropperImage, setCropperImage ] = useState<string>('');

    const onCropComplete = async (croppedArea: Area, croppedAreaPixels: Area) => {
        const crop = await getCroppedImg(cropperImage, croppedAreaPixels)
        if(crop) {
            setBase64image(crop);
        }
    };

    const askImageSelection = () => {
        const inputEl = document.querySelector('#image') as HTMLInputElement;
        inputEl.click();
    };

    const onFileSelected = (event:any) => {
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
    };

    const avoidImageEdition = () => {
        if(document.getElementById('image')){
            const elt = document.getElementById('image') as HTMLInputElement;
            elt.value="";
        }
        setCropperImage('');
    };

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
                onSubmit={(values) => {
                    values.picture = base64image;
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
                            <div className="avatar-managment">
                                {cropperImage && 
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
                                        <div className="avoid-badge" title="annuler" onClick={avoidImageEdition} >
                                            <HighlightOffTwoToneIcon sx={{ color: '#800101' }} />
                                        </div>
                                    </div>
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
                                {!cropperImage &&
                                    <Button variant="contained" startIcon={<AddAPhotoTwoToneIcon />} onClick={askImageSelection}>
                                        Ajouter
                                    </Button>
                                }

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