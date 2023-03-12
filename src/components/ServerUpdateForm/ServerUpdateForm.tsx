import React, { useState} from 'react';
import DisabledByDefaultRoundedIcon from '@mui/icons-material/DisabledByDefaultRounded';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useDispatch } from 'react-redux';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import HighlightOffTwoToneIcon from '@mui/icons-material/HighlightOffTwoTone';
import { Breadcrumbs } from '@mui/material';

import { FormValidationService } from '../../utils/formValidationService';
import { ServerService } from '../../services/serverService';
import { removeServer, updateServer } from '../../redux/serversSlice';
import { Server } from '../../interfaces/IServer';

import './ServerUpdateForm.scss';
import AvatarCropper from '../avatarCropper/AvatarCropper';

type ServerUpdatingFormProps = {
    setIsUpdatingServer: React.Dispatch<React.SetStateAction<boolean>>
    server: Server
}

const formValidationService = new FormValidationService();
const serverService = new ServerService();

export default function ServerUpdateForm(props:ServerUpdatingFormProps) {
    const dispatch = useDispatch();
    
    const [ croppedImage, setCroppedImage ] = useState<string>('');
    const [ cropperImage, setCropperImage] = useState<string>('');
    const [ imageSelection, setImageSelection ] = useState<boolean>(false);
    
    const deleteServer = (event:any) => {
        event.preventDefault();
        if(props.server) {
            serverService.deleteServer(props.server.id)
            .then(response => {
                dispatch(removeServer(props.server.id));
                props.setIsUpdatingServer(false);
            })
            .catch(error => {
                console.log(error);
            })
        }
    };
    const askImageSelection = () => {
        const inputEl = document.querySelector('#imageInput') as HTMLInputElement;
        inputEl.click();
    };
    const deleteAvatar = () => {
        serverService.updateServer({picture: null}, props.server.id)
        .then(response => {
            dispatch(updateServer(response.result));
            setCroppedImage('');
            setCropperImage('');
        })
        .catch(error => {
            console.log(error);
        })
    }
    return (
        <div className="ServerUpdateForm">
            <Formik
                initialValues={{
                    name: props.server.name
                }}
                validate={formValidationService.validateServerUpdate}
                onSubmit={(values) => {
                    if(croppedImage !== '') {
                        values.picture = croppedImage;
                    }
                    serverService.updateServer(values, props.server.id)
                    .then(response => {
                        if(response.isSucceed) {
                            dispatch(updateServer(response.result));
                            setCroppedImage('');
                            setCropperImage('');
                            props.setIsUpdatingServer(false);
                        }
                        else {
                            console.log(response.errorMessage);
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    })
                }}
            >
                {formik => (
                    <Form className="server-update-form">
                        <h2>Edition du serveur <DisabledByDefaultRoundedIcon color="warning" onClick={() => props.setIsUpdatingServer(false)}/></h2>
                        <div className="field-box">
                            <div className="server-update-form-name form__fields">
                                <label className="form__labels" htmlFor="updatedserver-name">Nom :</label>
                                <Field
                                    type="text"
                                    name="name"
                                    id="updatedserver-name"
                                />
                                <ErrorMessage name="name" />
                            </div>
                        </div>
                        <div className="formgroup-heading">Avatar :</div>
                        {/* <AvatarCropper
                            setImage={setCroppedImage}
                            cropperImage={cropperImage}
                            setCropperImage={setCropperImage}
                            previousImage={props.server.picture}
                            imageSelection={imageSelection}
                            avoidImageSelection={() => setImageSelection(false)}
                        /> */}
                        {props.server.picture &&
                            <div className="avatar-editor">
                                <img className="actual-avatar" src={props.server.picture} alt="actual server avatar" />
                                <Breadcrumbs>
                                    <ChangeCircleIcon sx={{ color: '#1616c4' }} onClick={askImageSelection} />
                                    <HighlightOffTwoToneIcon sx={{ color: '#800101' }} onClick={deleteAvatar}/>
                                </Breadcrumbs>
                            </div>
                        }
                        <br/><br/>
                        <button type="submit" >envoi</button>
                    </Form>
                )}
            </Formik>
            <button onClick={deleteServer} >Supprimer serveur</button>
        </div>
    )
}