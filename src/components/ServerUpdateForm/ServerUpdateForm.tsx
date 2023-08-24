import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';

import DisabledByDefaultRoundedIcon from '@mui/icons-material/DisabledByDefaultRounded';
import EditIcon from '@mui/icons-material/Edit';
import HighlightOffTwoToneIcon from '@mui/icons-material/HighlightOffTwoTone';
import { Avatar, Breadcrumbs } from '@mui/material';

import { Modal, AvatarCropper, Search, MessageError } from '../../components';
import { Server } from '../../interfaces/IServer';
import { removeServer, addOrUpdateServer } from '../../redux/serversSlice';
import { ServerService } from '../../services/serverService';
import { FormValidationService } from '../../utils/formValidationService';
import { ServerUpdateValues } from '../../interfaces/IServerUpdateValues';

import './ServerUpdateForm.scss';

type ServerUpdatingFormProps = {
    setIsUpdatingServer: React.Dispatch<React.SetStateAction<boolean>>
    server: Server
}

const formValidationService = new FormValidationService();

export function ServerUpdateForm(props: ServerUpdatingFormProps) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [croppedImage, setCroppedImage] = useState<string>('');
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [categories, setCategories] = useState<string[]>(props.server?.categories);
    const [serverUpdateError, setServerUpdateError] = useState<{ isError: boolean, errorMessage: string }>({ isError: false, errorMessage: '' });

    const initialValues: ServerUpdateValues = {
        name: props.server?.name,
        picture: '',
        categories: categories,
    }

    const addCategory = (values: string[]) => {
        setCategories(values);
    }

    const deleteServer = (event: any) => {
        event.preventDefault();
        if (props.server) {
            new ServerService().deleteServer(props.server.id)
                .then(() => {
                    dispatch(removeServer(props.server.id));
                    props.setIsUpdatingServer(false);
                    navigate('/');
                })
                .catch(error => {
                    console.log(error);
                })
        }
    };

    const deleteAvatar = () => {
        new ServerService().updateServer({ picture: null }, props.server.id)
            .then(response => {
                dispatch(addOrUpdateServer(response.result));
                setCroppedImage('');
            })
            .catch(error => {
                console.log(error);
            })
    }

    const updateImage = (image: string) => {
        setCroppedImage(image);
        setIsOpen(false);
        return image;
    }

    return (
        <div className="ServerUpdateForm">
            <Formik
                initialValues={initialValues}
                validate={formValidationService.validateServerUpdate}
                onSubmit={async (values) => {
                    const modifiedValues = formValidationService.getModifiedValues(values, initialValues);
                    if (croppedImage !== '') {
                        modifiedValues.picture = croppedImage;
                    }
                    modifiedValues.categories = categories.map(c => c.toLowerCase());
                    if (Object.keys(modifiedValues).length) {
                        setServerUpdateError({ isError: false, errorMessage: '' });
                        try {
                            const response = await new ServerService().updateServer(modifiedValues, props.server.id);
                            dispatch(addOrUpdateServer(response.result));
                            setCroppedImage('');
                            props.setIsUpdatingServer(false);
                        } catch (error) {
                            let errorMessage: string = 'Une erreur est survenue, veuillez réessayer';
                            if (error instanceof AxiosError) {
                                errorMessage = error.response?.data.message;
                            }
                            setServerUpdateError({ isError: true, errorMessage });
                        }
                    }
                }}
            >
                {formik => (
                    <Form className="server-update-form">
                        <h2>Edition du serveur <DisabledByDefaultRoundedIcon color="warning" onClick={() => props.setIsUpdatingServer(false)} /></h2>
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
                        <h3 className="formgroup-heading">Avatar :</h3>
                        <div className='avatar-action'>
                            {(props.server.picture && props.server.picture !== '')
                                ?
                                <div className='avatar-editor'>
                                    <img className="actual-avatar" src={props.server.picture} alt="server's actual avatar" />
                                    <Breadcrumbs>
                                        <EditIcon sx={{ color: '#1616c4' }} onClick={() => setIsOpen(true)} />
                                        <HighlightOffTwoToneIcon sx={{ color: '#800101' }} onClick={deleteAvatar} />
                                    </Breadcrumbs>
                                </div>
                                :
                                <div className='picture'>
                                    <Avatar>{props.server.name.substring(0, 1).toUpperCase()}</Avatar>
                                    <EditIcon className='edit' sx={{ color: '#1616c4' }} onClick={() => setIsOpen(true)} />
                                </div>
                            }
                            {croppedImage && croppedImage !== '' &&
                                <>
                                    <div><span>=&gt;</span></div>
                                    <div className="avatar-editor">
                                        <img className="wanted-avatar" src={croppedImage} alt="new avatar" />
                                        <button onClick={() => setCroppedImage('')}>Cancel</button>
                                    </div>
                                </>
                            }
                        </div>
                        {isOpen && <Modal setIsOpen={setIsOpen} childComponent={<AvatarCropper setImage={updateImage} />} />}
                        <h3>Mots-clés :</h3>
                        <Search onListChange={addCategory} initialList={categories} />
                        <br /><br />
                        <button type="submit" >envoi</button>
                        <button onClick={deleteServer} >Supprimer serveur</button>
                    </Form>
                )}
            </Formik>
            <MessageError
                open={serverUpdateError.isError}
                setCallbackClose={() => setServerUpdateError({ isError: false, errorMessage: '' })}
                message={serverUpdateError.errorMessage}
            />

        </div>
    )
}