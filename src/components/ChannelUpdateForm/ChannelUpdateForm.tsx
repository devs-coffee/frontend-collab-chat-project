import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch } from 'react-redux';
import { AxiosError } from 'axios';

import DisabledByDefaultRoundedIcon from '@mui/icons-material/DisabledByDefaultRounded';
import { Button } from '@mui/material';

import { FormValidationService } from '../../utils/formValidationService';
import { ChannelService } from '../../services/channelService';
import { ChannelBase } from '../../interfaces/IChannel.base';
import { removeChannel, updateChannel } from '../../redux/serversSlice';
import { MessageError } from '../';

import "./ChannelUpdateForm.scss";

type ChannelUpdateFormProps = {
    channel: ChannelBase,
    closeChannelUpdate: any
}

const formValidationService = new FormValidationService();

export function ChannelUpdateForm(props: ChannelUpdateFormProps) {
    const [errorMessage, setErrorMessage] = useState<string>('');

    const dispatch = useDispatch();

    const initialValues = {
        id: props.channel.id,
        title: props.channel.title
    }

    async function deleteChannel() {
        try {
            await new ChannelService().deleteChannel(props.channel.id);
            dispatch(removeChannel(props.channel));
            props.closeChannelUpdate()
        } catch (error) {
            const errorMessage = error as Error;
            setErrorMessage(errorMessage.message);
        }
    }

    return (
        <div className='ChannelUpdateForm'>
            <Formik
                initialValues={initialValues}
                validate={formValidationService.validateChannelUpdate}
                onSubmit={async (values) => {
                    setErrorMessage('');
                    try {
                        const response = await new ChannelService().updateChannel(values);
                        dispatch(updateChannel(response.result));
                    } catch (error) {
                        const errorMessage = error as Error;
                        setErrorMessage(errorMessage.message);
                    }
                }}
            >
                {formik => (
                    <Form className='channel-update-form'>
                        <h2>Edition du channel <DisabledByDefaultRoundedIcon color="warning" onClick={props.closeChannelUpdate} /></h2>
                        <div className='field-box'>
                            <div className='channel-update-form-title form__fields'>
                                <label className='form__labels' htmlFor='newchannel-title'>Titre :</label>
                                <Field
                                    type='text'
                                    name='title'
                                    id='newchannel-title'
                                />
                            </div>
                            <ErrorMessage name='title' />
                        </div>
                        <Button variant="contained" type="submit">Envoyer</Button><br />
                        <Button variant="contained" onClick={() => deleteChannel()}>Supprimer</Button>
                    </Form>
                )}
            </Formik>

            <MessageError
                open={errorMessage !== ''}
                setCallbackClose={() => setErrorMessage('')}
                message={errorMessage}
            />
        </div>
    )
}