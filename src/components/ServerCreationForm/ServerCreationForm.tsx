import { Formik, Form, Field, ErrorMessage } from 'formik';
import DisabledByDefaultRoundedIcon from '@mui/icons-material/DisabledByDefaultRounded';
import { useDispatch } from 'react-redux';

import { FormValidationService } from '../../utils/formValidationService';
import { ServerService } from '../../services/serverService';

import "./ServerCreationForm.scss";
import { addServer } from '../../redux/serversSlice';

type ServerCreationFormProps = {
    setAddingServer: React.Dispatch<React.SetStateAction<boolean>>
}

const formValidationService = new FormValidationService();
const serverService = new ServerService();

export default function ServerCreationForm(props:ServerCreationFormProps) {
    const avoidServerAdding = () => props.setAddingServer(false);
    const dispatch = useDispatch();

    return (
        <div className="ServerCreationForm">
            <Formik
                initialValues={{
                    name: ''
                }}
                validate={formValidationService.validateServerCreation}
                onSubmit={(values) => {
                    serverService.createServer(values)
                    .then(response => {
                        console.log(response);
                        dispatch(addServer(response.result));
                        avoidServerAdding();
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
                            <button type="submit" >envoi</button>
                        </div>
                    </Form>
                )}

            </Formik>
        </div>
    )
}