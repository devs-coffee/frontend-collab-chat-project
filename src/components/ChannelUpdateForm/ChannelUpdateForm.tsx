import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch } from 'react-redux';
import { AxiosError } from 'axios';

import DisabledByDefaultRoundedIcon from '@mui/icons-material/DisabledByDefaultRounded';
import { Button, Snackbar } from '@mui/material';

import { FormValidationService } from '../../utils/formValidationService';
import { ChannelService } from '../../services/channelService';
import { ChannelBase } from '../../interfaces/IChannel.base';

import "./ChannelUpdateForm.scss";
import { updateChannel } from '../../redux/serversSlice';

type ChannelUpdateFormProps = {
    channel: ChannelBase,
    closeChannelUpdate: any
}

const formValidationService = new FormValidationService();
const channelService = new ChannelService();

export default function ChannelUpdateForm(props: ChannelUpdateFormProps) {
    const [ channelUpdateError, setChannelUpdateError ] = useState<{isError:boolean, errorMessage:string}>({isError: false, errorMessage: ''});

    const dispatch = useDispatch();

    const initialValues = {
        id: props.channel.id,
        title: props.channel.title
    }

    const handleToastClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if(reason === 'clickaway') {
            return;
        }
        setChannelUpdateError({isError:false, errorMessage:''});
    }

    return(
        <div className='ChannelUpdateForm'>
            <Formik
                initialValues={initialValues}
                validate={formValidationService.validateChannelUpdate}
                onSubmit={async (values) => {
                    setChannelUpdateError({isError:false, errorMessage:''});
                    try {
                        const response = await channelService.updateChannel(values);
                        dispatch(updateChannel(response.result));
                    } catch(error) {
                        let errorMessage:string = "Une erreur est survenue, veuillez réessayer";
                        if(error instanceof AxiosError) {
                            errorMessage = error.response?.data.message;
                        }
                        setChannelUpdateError({isError:true, errorMessage});
                        console.log('error :', errorMessage);
                    }
                }}
            >
                {formik => (
                    <Form className='channel-update-form'>
                        <h2>Edition du channel <DisabledByDefaultRoundedIcon color="warning" onClick={props.closeChannelUpdate}/></h2>
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
                        <Button variant="contained" type="submit">Envoyer</Button>
                    </Form>
                )}
            </Formik>
            <Snackbar
                open={channelUpdateError.isError}
                autoHideDuration={4000}
                onClose={handleToastClose}
                message={channelUpdateError.errorMessage}
            />
        </div>
    )

}