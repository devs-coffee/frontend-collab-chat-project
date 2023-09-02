import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch } from 'react-redux';
import { AxiosError } from 'axios';

import { Avatar } from '@mui/material';
import DisabledByDefaultRoundedIcon from '@mui/icons-material/DisabledByDefaultRounded';

import { FormValidationService } from '../../utils/formValidationService';
import { ServerService } from '../../services/serverService';
import { addOrUpdateServer } from '../../redux/serversSlice';
import { AvatarCropper, Search, MessageError } from '../';

import "./ServerCreationForm.scss";

type ServerCreationFormProps = {
    setDashboardContent: React.Dispatch<React.SetStateAction<string>>
}

const formValidationService = new FormValidationService();

export function ServerCreationForm(props: ServerCreationFormProps) {
    const [croppedImage, setCroppedImage] = useState<string>('');
    const [categories, setCategories] = useState<string[]>([]);
    const [serverCreationError, setServerCreationError] = useState<string>('');


    const dispatch = useDispatch();
    const closeServerAdding = () => props.setDashboardContent('');

    const setImage = (image: string) => {
        setCroppedImage(image);
        return image;
    }

    const initialValues = {
        name: '',
        categories: []
    }

    const addCategory = (datas: string[]) => {
        setCategories(datas);
    }

    return (
        <div className="ServerCreationForm">
            <Formik
                initialValues={initialValues}
                validate={formValidationService.validateServerCreation}
                onSubmit={async (values) => {
                    if (croppedImage) {
                        values.picture = croppedImage;
                    }
                    values.categories = categories;
                    setServerCreationError('');
                    try {
                        const response = await new ServerService().createServer(values);
                        dispatch(addOrUpdateServer(response.result));
                        closeServerAdding();
                    } catch (error) {
                        const errorMessage = error as Error;
                        setServerCreationError(errorMessage.message);
                    }
                }}
            >
                {formik => (
                    <Form className="server-creation-form">
                        <h2>Nouveau serveur <DisabledByDefaultRoundedIcon color="warning" onClick={closeServerAdding} /></h2>
                        <div className="field-box">
                            <div className="server-creation-form-name form__fields">
                                <label className="form__labels" htmlFor="newserver-name">Nom :</label>
                                <Field
                                    type="text"
                                    name="name"
                                    id="newserver-name"
                                />
                            </div>
                            <ErrorMessage name="name" />
                        </div>
                        <div className="avatar-managment">
                            <h3>Avatar :</h3>
                            {croppedImage && croppedImage !== ''
                                ?
                                <Avatar alt="server picture" src={croppedImage} />
                                :
                                <AvatarCropper
                                    setImage={(image: string) => setImage(image)}
                                />
                            }
                        </div>
                        <h3>Mots-clés :</h3>
                        <Search onListChange={addCategory} />
                        <button type="submit" >envoi</button>
                    </Form>
                )}
            </Formik>
            <MessageError
                open={serverCreationError !== ''}
                setCallbackClose={() => setServerCreationError('')}
                message={serverCreationError}
            />
        </div>
    )
}