import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AxiosError } from "axios";

import DisabledByDefaultRoundedIcon from '@mui/icons-material/DisabledByDefaultRounded';
import { red } from "@mui/material/colors";
import { Button, Snackbar, Stack } from "@mui/material";

import { ChannelBase } from "../../interfaces/IChannel.base";
import ChannelCreationForm from "../ChannelCreationForm/ChannelCreationForm";
import { removeChannel } from "../../redux/serversSlice";
import { ChannelService } from "../../services/channelService";

import './ChannelManager.scss';
import ChannelUpdateForm from "../ChannelUpdateForm/ChannelUpdateForm";

const channelService = new ChannelService();

interface channelManagingProps {
    channels: ChannelBase[]
    avoidManaging: () => void
}

const ChannelManager: React.FC<channelManagingProps> = ({channels, avoidManaging}) => {
    const dispatch = useDispatch();
    const [isUpdatingOne, setIsUpdatingOne] = useState<string>('');
    const [ mainContent, setMainContent ] = useState<string>('home');
    const [ deleteChannelError, setDeleteChannelError ] = useState<{isError:boolean, errorMessage:string}>({isError:false, errorMessage:''});
    
    function getChannelName(id:string) {
        return channels.find(channel => channel.id === isUpdatingOne)?.title;
    }

    function editChannel(id:string) {
        setIsUpdatingOne(id);
        setMainContent('edit')
    }

    function avoidEditingChannel() {
        setIsUpdatingOne('');
        setMainContent('home');
    }

    function closeChannelCreation() {
        setIsUpdatingOne('');
        setMainContent('home');
    }

    function closeChannelUpdate() {
        setIsUpdatingOne('');
        setMainContent('home');
    }

    async function deleteChannel() {
        console.log(channels.find(chan => chan.id === isUpdatingOne));
        try {
            const response = await channelService.deleteChannel(isUpdatingOne);
            dispatch(removeChannel(channels.find(chan => chan.id === isUpdatingOne)));
            setIsUpdatingOne('');
            setMainContent('home');
        } catch(error) {
            let errorMessage = 'Channel non supprimé, veuillez réessayer';
            if(error instanceof AxiosError) {
                errorMessage = error.response?.data.message;
            }
            setDeleteChannelError({isError:true, errorMessage:'Channel non supprimé, veuillez réessayer'});
        }
    }

    const handledeleteChannelClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if(reason === 'clickaway') {
            return;
        }
        setDeleteChannelError({isError:false, errorMessage:''});
    }

    return (
        <div className="ChannelManager">
            <h2>Channel managing<DisabledByDefaultRoundedIcon sx={{ color: red[500] }} onClick={() => avoidManaging()} /></h2>
            {mainContent === 'home' && (
                <>
                <Button variant="contained" onClick={() => setMainContent('create')}>Ajouter</Button>
                <Stack className="channels-stack" spacing={0.8}>
                    {channels.map(channel => (
                        <span className="channels-stack__items" key={`span-${channel.id}`} onClick={() => {editChannel(channel.id)}}>
                            {channel.title}
                            
                        </span>
                    ))}
                
                </Stack>
                </>
            )}
            {mainContent === 'edit' && (
                // <>
                //     <h3>updating channel : {
                //         getChannelName(isUpdatingOne)
                //     }
                //     <DisabledByDefaultRoundedIcon sx={{ color: red[500] }} onClick={() => avoidEditingChannel()} />
                //     </h3>

                //     <Button variant="contained" onClick={() => deleteChannel()}>Supprimer</Button>
                // </>
                <ChannelUpdateForm channel={channels.find(chan => chan.id === isUpdatingOne)!} closeChannelUpdate={closeChannelUpdate} />
                
            )}
            {mainContent === 'create' && (
                <ChannelCreationForm closeChannelCreation={closeChannelCreation}/>
            )}
            <Snackbar 
                open={deleteChannelError.isError}
                autoHideDuration={4000}
                onClose={handledeleteChannelClose}
                message={deleteChannelError.errorMessage}
            />
        </div>
    )
}

export default ChannelManager;