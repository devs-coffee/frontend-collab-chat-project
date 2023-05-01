import { useState } from "react";
import { useDispatch } from "react-redux";

import DisabledByDefaultRoundedIcon from '@mui/icons-material/DisabledByDefaultRounded';
import { Button, Stack } from "@mui/material";
import { red } from "@mui/material/colors";

import { ChannelBase } from "../../interfaces/IChannel.base";
import { ChannelService } from "../../services/channelService";
import ChannelCreationForm from "../ChannelCreationForm/ChannelCreationForm";

import ChannelUpdateForm from "../ChannelUpdateForm/ChannelUpdateForm";
import './ChannelManager.scss';

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