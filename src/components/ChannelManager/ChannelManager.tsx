import { useState } from "react";

import DisabledByDefaultRoundedIcon from '@mui/icons-material/DisabledByDefaultRounded';
import { red } from "@mui/material/colors";
import { Button, Stack } from "@mui/material";

import { ChannelBase } from "../../interfaces/IChannel.base";
import ChannelCreationForm from "../ChannelCreationForm/ChannelCreationForm";

import './ChannelManager.scss';

interface channelManagingProps {
    channels: ChannelBase[]
    avoidManaging: () => void
}

const ChannelManager: React.FC<channelManagingProps> = ({channels, avoidManaging}) => {
    const [isUpdatingOne, setIsUpdatingOne] = useState<string>('');
    const [ mainContent, setMainContent ] = useState<string>('home');
    
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
        console.log(channels);
        setIsUpdatingOne('');
        setMainContent('home');
    }

    function deleteChannel() {
        console.log('delete');
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
                <>
                    <h3>updating channel : {
                        getChannelName(isUpdatingOne)
                    }
                    <DisabledByDefaultRoundedIcon sx={{ color: red[500] }} onClick={() => avoidEditingChannel()} />
                    </h3>

                    <Button variant="contained" onClick={() => deleteChannel()}>Ajouter</Button>
                </>
                
            )}
            {mainContent === 'create' && (
                <ChannelCreationForm closeChannelCreation={closeChannelCreation}/>
            )}
        </div>
    )
}

export default ChannelManager;