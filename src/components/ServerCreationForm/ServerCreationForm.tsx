import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch } from 'react-redux';
import { AxiosError } from 'axios';

import { Avatar, Snackbar } from '@mui/material';
import DisabledByDefaultRoundedIcon from '@mui/icons-material/DisabledByDefaultRounded';

import { FormValidationService } from '../../utils/formValidationService';
import { ServerService } from '../../services/serverService';
import { addServer } from '../../redux/serversSlice';
import AvatarCropper from '../avatarCropper/AvatarCropper';
import Search from '../commons/Search';

import "./ServerCreationForm.scss";

type ServerCreationFormProps = {
    setDashboardContent: React.Dispatch<React.SetStateAction<string>>
}

const formValidationService = new FormValidationService();
const serverService = new ServerService();

export default function ServerCreationForm(props:ServerCreationFormProps) {
    const [ croppedImage, setCroppedImage ] = useState<string>('');
    const [ categories, setCategories ] = useState<string[]>([]);
    const [serverCreationError, setServerCreationError] = useState<boolean>(false);
    const [ axiosErrorMessage, setAxiosErrorMessage ] = useState<string>('');

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

    const handleToastClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if(reason === 'clickaway') {
            return;
        }
        setServerCreationError(false);
        setAxiosErrorMessage('');
    }

    return (
        <div className="ServerCreationForm">
            <Formik
                initialValues={initialValues}
                validate={formValidationService.validateServerCreation}
                onSubmit={async (values) => {
                    if(croppedImage) {
                        values.picture = croppedImage;
                    }
                    values.categories = categories;
                    setAxiosErrorMessage('');
                    setServerCreationError(false);
                    try {
                        const response = await serverService.createServer(values);
                        if(response.isSucceed) {
                            dispatch(addServer(response.result));
                            closeServerAdding();
                        } else {
                            console.log(response.errorMessage);
                            setAxiosErrorMessage(response.errorMessage!);
                            setServerCreationError(true);
                        }
                    } catch(error) {
                        console.log(error);
                        if(error instanceof AxiosError) {
                            setAxiosErrorMessage(error.response?.data.message);
                        } else {
                            setAxiosErrorMessage('Une erreur est survenue, veuillez réessayer');
                        }
                        setServerCreationError(true);
                    }
                }}
            >
                {formik => (
                    <Form className="server-creation-form">
                        <h2>Nouveau serveur <DisabledByDefaultRoundedIcon color="warning" onClick={closeServerAdding}/></h2>
                        <div className="field-box">
                            <div className="server-creation-form-name form__fields">
                                <label className="form__labels" htmlFor="newserver-name">Nom :</label>
                                <Field
                                    type="text"
                                    name="name"
                                    id="newserver-name"
                                />
                                <ErrorMessage name="name" />
                            </div>
                        </div>
                        <div className="avatar-managment">
                            <h3>Avatar :</h3>
                            {croppedImage && croppedImage !== '' 
                                ? 
                                <Avatar alt="server picture" src={croppedImage}/>
                                : 
                                <AvatarCropper
                                    setImage={(image: string) => setImage(image)}
                                />
                            }
                        </div>
                        <h3>Mots-clés :</h3>
                        <Search onListChange={addCategory}/>
                        <button type="submit" >envoi</button>
                    </Form>
                )}
            </Formik>
            <Snackbar 
                open={serverCreationError}
                autoHideDuration={4000}
                onClose={handleToastClose}
                message={axiosErrorMessage}
            />
        </div>
    )
}