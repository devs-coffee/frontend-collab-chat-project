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
    
    function editChannel(id:string) {
        setIsUpdatingOne(id);
        setMainContent('edit')
    }

    function closeChannelCreation() {
        setIsUpdatingOne('');
        setMainContent('home');
    }

    function closeChannelUpdate() {
        setIsUpdatingOne('');
        setMainContent('home');
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
                <ChannelUpdateForm channel={channels.find(chan => chan.id === isUpdatingOne)!} closeChannelUpdate={closeChannelUpdate} />
                
            )}
            {mainContent === 'create' && (
                <ChannelCreationForm closeChannelCreation={closeChannelCreation}/>
            )}
        </div>
    )
}

export default ChannelManager;