import React from 'react';
import DisabledByDefaultRoundedIcon from '@mui/icons-material/DisabledByDefaultRounded';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useDispatch } from 'react-redux';

import { FormValidationService } from '../../utils/formValidationService';
import { ServerService } from '../../services/serverService';
import { removeServer, updateServer } from '../../redux/serversSlice';

import './ServerUpdateForm.scss';

type ServerUpdatingFormProps = {
    setIsUpdatingServer: React.Dispatch<React.SetStateAction<boolean>>
    serverId: string | undefined
}

const formValidationService = new FormValidationService();
const serverService = new ServerService();

export default function ServerUpdateForm(props:ServerUpdatingFormProps) {
    const dispatch = useDispatch();
    const removeThisServer = (event:any) => {
        event.preventDefault();
        if(props.serverId) {
            serverService.deleteServer(props.serverId)
            .then(response => {
                console.log(response);
                dispatch(removeServer(props.serverId));
                props.setIsUpdatingServer(false);
            })
        }
        
    }
    return (
        <div className="ServerUpdateForm">
            <Formik
                initialValues={{
                    name: ''
                }}
                validate={formValidationService.validateServerUpdate}
                onSubmit={(values) => {
                    console.log(`id: ${props.serverId}`);
                    console.log(values);
                    serverService.updateServer(values, props.serverId)
                    .then(response => {
                        console.log(response.result);
                        dispatch(updateServer(response.result));
                        props.setIsUpdatingServer(false);
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
                            <button type="submit" >envoi</button>
                        </div>
                        <button onClick={removeThisServer} >Supprimer serveur</button>
                    </Form>
                )}
            </Formik>
        </div>
    )
}