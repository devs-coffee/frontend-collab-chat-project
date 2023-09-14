import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import { Button } from '@mui/material';
import DisabledByDefaultRoundedIcon from '@mui/icons-material/DisabledByDefaultRounded';

import { FormValidationService } from '../../utils/formValidationService';
import { ChannelService } from '../../services/channelService';
import { addChannel } from '../../redux/serversSlice';
import { MessageError } from '../';

import "./ChannelCreationForm.scss";

type ChannelCreationFormProps = {
    closeChannelCreation: any
}

const formValidationService = new FormValidationService();

export function ChannelCreationForm(props: ChannelCreationFormProps) {
    const [channelCreationError, setChannelCreationError] = useState<string>('');

    const urlSearchParams = useParams();
    const dispatch = useDispatch();

    const initialValues = {
        title: '',
        serverId: urlSearchParams.serverId!
    }

    const avoidChannelCreation = () => {
        props.closeChannelCreation();
    }

    return (
        <div className='ChannelCreationForm'>
            <Formik
                initialValues={initialValues}
                validate={formValidationService.validateChannelCreation}
                onSubmit={async (values) => {
                    setChannelCreationError('');
                    try {
                        const response = await new ChannelService().createChannel(values);
                        dispatch(addChannel(response.result));
                        props.closeChannelCreation();
                    } catch (error) {
                        let errorMessage = error as Error;
                        setChannelCreationError(errorMessage.message);
                    }
                }}
            >
                {formik => (
                    <Form className='channel-creation-form'>
                        <h2>Nouveau channel <DisabledByDefaultRoundedIcon color="warning" onClick={avoidChannelCreation} /></h2>
                        <div className='field-box'>
                            <div className='channel-creation-form-title form__fields'>
                                <label className='form__labels' htmlFor='newchannel-title'>Titre :</label>
                                <Field
                                    type='text'
                                    name='title'
                                    id='newchannel-title'
                                />
                            </div>
                            <ErrorMessage name='title' />
                        </div>
                        <Button variant="contained" type='submit'>Envoyer</Button>

                    </Form>
                )}

            </Formik>
            <MessageError
                open={channelCreationError !== ''}
                setCallbackClose={() => setChannelCreationError('')}
                message={channelCreationError}
            />
        </div>
    )
}