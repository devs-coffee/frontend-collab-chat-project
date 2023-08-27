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
    const [channelUpdateError, setChannelUpdateError] = useState<{ isError: boolean, errorMessage: string }>({ isError: false, errorMessage: '' });
    const [deleteChannelError, setDeleteChannelError] = useState<{ isError: boolean, errorMessage: string }>({ isError: false, errorMessage: '' });

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
            let errorMessage = 'Channel non supprimé, veuillez réessayer';
            if (error instanceof AxiosError) {
                errorMessage = error.response?.data.message;
            }
            setDeleteChannelError({ isError: true, errorMessage });
        }
    }

    return (
        <div className='ChannelUpdateForm'>
            <Formik
                initialValues={initialValues}
                validate={formValidationService.validateChannelUpdate}
                onSubmit={async (values) => {
                    setChannelUpdateError({ isError: false, errorMessage: '' });
                    try {
                        const response = await new ChannelService().updateChannel(values);
                        dispatch(updateChannel(response.result));
                    } catch (error) {
                        let errorMessage: string = "Une erreur est survenue, veuillez réessayer";
                        if (error instanceof AxiosError) {
                            errorMessage = error.response?.data.message;
                        }
                        setChannelUpdateError({ isError: true, errorMessage });
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
                open={channelUpdateError.isError}
                setCallbackClose={() => setChannelUpdateError({ isError: false, errorMessage: '' })}
                message={channelUpdateError.errorMessage}
            />

            <MessageError
                open={deleteChannelError.isError}
                setCallbackClose={() => setChannelUpdateError({ isError: false, errorMessage: '' })}
                message={deleteChannelError.errorMessage}
            />
        </div>
    )
}