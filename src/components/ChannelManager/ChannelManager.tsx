import { useState } from "react";

import DisabledByDefaultRoundedIcon from '@mui/icons-material/DisabledByDefaultRounded';
import { red } from "@mui/material/colors";
import { ChannelBase } from "../../interfaces/IChannel.base";

interface channelManagingProps {
    channels: ChannelBase[]
    avoidManaging: () => void
}

const ChannelManager: React.FC<channelManagingProps> = ({channels, avoidManaging}) => {
    const [isUpdatingOne, setIsUpdatingOne] = useState<boolean>(false);
    return (
        <>
            <h2>Channel managing<DisabledByDefaultRoundedIcon sx={{ color: red[500] }} onClick={() => avoidManaging()} /></h2>
            
        </>
        
    )
}

export default ChannelManager;