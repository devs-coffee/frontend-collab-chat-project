import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import DisabledByDefaultRoundedIcon from '@mui/icons-material/DisabledByDefaultRounded';
import { useDispatch } from 'react-redux';

import { FormValidationService } from '../../utils/formValidationService';
import { ServerService } from '../../services/serverService';
import { addServer } from '../../redux/serversSlice';
import AvatarCropper from '../avatarCropper/AvatarCropper';

import "./ServerCreationForm.scss";

type ServerCreationFormProps = {
    setAddingServer: React.Dispatch<React.SetStateAction<boolean>>
}

const formValidationService = new FormValidationService();
const serverService = new ServerService();

export default function ServerCreationForm(props:ServerCreationFormProps) {
    const [ cropperImage, setCropperImage ] = useState<string>('');
    const [ croppedImage, setCroppedImage ] = useState<string>('');
    const [ imageSelection, setImageSelection ] = useState<boolean>(false);
    
    const dispatch = useDispatch();
    const avoidServerAdding = () => props.setAddingServer(false);

    return (
        <div className="ServerCreationForm">
            <Formik
                initialValues={{
                    name: ''
                }}
                validate={formValidationService.validateServerCreation}
                onSubmit={(values) => {
                    if(croppedImage) {
                        values.picture = croppedImage;
                    }
                    serverService.createServer(values)
                    .then(response => {
                        if(response.isSucceed) {
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
                            <AvatarCropper
                                setImage={setCroppedImage}
                                cropperImage={cropperImage}
                                setCropperImage={setCropperImage}
                                previousImage={''}
                                imageSelection={imageSelection}
                                avoidImageSelection={() => setImageSelection(false)}
                            />
                        </div>
                        <button type="submit" >envoi</button>
                    </Form>
                )}
            </Formik>
        </div>
    )
}