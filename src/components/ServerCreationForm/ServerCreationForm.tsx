import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import DisabledByDefaultRoundedIcon from '@mui/icons-material/DisabledByDefaultRounded';
import { useDispatch } from 'react-redux';

import { FormValidationService } from '../../utils/formValidationService';
import { ServerService } from '../../services/serverService';
import { addServer } from '../../redux/serversSlice';
import AvatarCropper from '../avatarCropper/AvatarCropper';

import "./ServerCreationForm.scss";
import { Avatar } from '@mui/material';
import Search from '../commons/Search';

type ServerCreationFormProps = {
    setAddingServer: React.Dispatch<React.SetStateAction<boolean>>
}

const formValidationService = new FormValidationService();
const serverService = new ServerService();

export default function ServerCreationForm(props:ServerCreationFormProps) {
    const [ croppedImage, setCroppedImage ] = useState<string>('');
    const [ categories, setCategories ] = useState<string[]>([]);

    const dispatch = useDispatch();
    const avoidServerAdding = () => props.setAddingServer(false);
    
    const setImage = (image: string) => {
        setCroppedImage(image);
        return image;
    }
    
    const initialValues = {
        name: '',
        categories: []
    }

    const remove = (value: string) => {
        setCategories(categories.filter(t => t !== value));
    }

    const getDatas = (data: string) => {
        setCategories([...categories, data]);
    }

    return (
        <div className="ServerCreationForm">
            <Formik
                initialValues={initialValues}
                validate={formValidationService.validateServerCreation}
                onSubmit={(values) => {
                    if(croppedImage) {
                        values.picture = croppedImage;
                    }
                    values.categories = categories;
                    serverService.createServer(values)
                    .then(response => {
                        if(response.isSucceed) {
                            console.log(response.result);
                            dispatch(addServer(response.result));
                            avoidServerAdding();
                        }
                        else {
                            console.log(response.errorMessage)
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    })
                }}
            >
                {formik => (
                    <Form className="server-creation-form">
                        <h2>Nouveau serveur <DisabledByDefaultRoundedIcon color="warning" onClick={avoidServerAdding}/></h2>
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
                        <span>Avatar :</span><br/>
                        {croppedImage && croppedImage !== '' 
                            ? 
                            <Avatar alt="server picture" src={croppedImage}/>
                            : 
                            <AvatarCropper
                                setImage={(image: string) => setImage(image)}
                            />
                        }

                        </div>
                        <Search searchElements={categories} title={"Catégories de serveur"} sendData={getDatas} remove={remove}/>
                        <button type="submit" >envoi</button>
                    </Form>
                )}
            </Formik>
        </div>
    )
}