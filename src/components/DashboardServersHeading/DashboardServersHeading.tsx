import { Avatar, Stack } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { green } from '@mui/material/colors';
import React from 'react';
import { useSelector } from 'react-redux';

import { Server } from '../../interfaces/IServer';

import './DashboardServersHeading.scss';
import { Link } from 'react-router-dom';

type DashboardServersHeadingProps = {
    addingServer: React.Dispatch<React.SetStateAction<boolean>>,
}

export default function DashboardServersHeading(props:DashboardServersHeadingProps) {
    const addNewServer = () => props.addingServer(true);
    const servers = useSelector((state:any) => state.servers);
    
    return (
        <div className="DashboardServersHeading">
            <h3>Servers heading works !</h3>
            {
                servers.length < 1 ? (<span>Veuillez patienter</span>) :
                (
                    <Stack direction="row" spacing={2}>
                        {servers.map((server:Server) => (
                            <Link to={`/server/${server.id}`} key={`linkto-${server.id}`}>
                                <Avatar>{server.name.substring(0, 1).toUpperCase()}</Avatar>
                            </Link>
                            
                        ))}
                        <Avatar sx={{ bgcolor: green[500] }} >
                            <AddCircleIcon onClick={addNewServer}/>
                        </Avatar>
                    </Stack>
                )
            }
        </div>
    )
}