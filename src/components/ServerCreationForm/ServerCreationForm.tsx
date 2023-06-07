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

export default function ServerCreationForm(props:ServerCreationFormProps) {
    const [ croppedImage, setCroppedImage ] = useState<string>('');
    const [ categories, setCategories ] = useState<string[]>([]);
    const [serverCreationError, setServerCreationError] = useState<{isError:boolean, errorMessage:string}>({isError:false, errorMessage:''});
    

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
        setServerCreationError({isError:false, errorMessage:''});
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
                    setServerCreationError({isError:false, errorMessage:''});
                    try {
                        const response = await new ServerService().createServer(values);
                        dispatch(addServer(response.result));
                        closeServerAdding();
                    } catch(error) {
                        let errorMessage:string = 'Une erreur est survenue, veuillez réessayer';
                        if(error instanceof AxiosError) {
                            errorMessage = error.response?.data.message;
                        }
                        setServerCreationError({isError:true, errorMessage});
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
                            </div>
                            <ErrorMessage name="name" />
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
                open={serverCreationError.isError}
                autoHideDuration={4000}
                onClose={handleToastClose}
                message={serverCreationError.errorMessage}
            />
        </div>
    )
}