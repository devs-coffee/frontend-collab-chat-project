import { Avatar, Stack } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { green } from '@mui/material/colors';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { Server } from '../../interfaces/IServer';

import './DashboardServersHeading.scss';

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
                // servers.status === "idle" ? (<span>Veuillez patienter</span>) :
                // (
                //     <Stack direction="row" spacing={2}>
                //         {servers.data.map((server:Server) => (
                //             <Link to={`/server/${server.id}`} key={`linkto-${server.id}`} title={server.name}>
                                
                //                     {server.picture ?
                //                         (<Avatar alt="avatar server" src={server.picture} />)
                //                         :
                //                         (<Avatar>{server.name.substring(0, 1).toUpperCase()}</Avatar>)
                //                     }
                                
                //             </Link>
                            
                //         ))}
                //         <Avatar sx={{ bgcolor: green[500] }} onClick={addNewServer} >
                //             <AddCircleIcon />
                //         </Avatar>
                //     </Stack>
                // )
                
            }
            { servers.status === "idle" && <span>Veuillez patienter</span> }
            { servers.error && <span>{servers.error}</span>}
            { servers.status === "succeed" &&
                <Stack direction="row" spacing={2}>
                    {servers.data.map((server:Server) => (
                        <Link to={`/server/${server.id}`} key={`linkto-${server.id}`} title={server.name}>
                                
                            {server.picture ?
                                (<Avatar alt="avatar server" src={server.picture} />)
                                :
                                (<Avatar>{server.name.substring(0, 1).toUpperCase()}</Avatar>)
                            }
                                
                        </Link>
                        
                    ))}
                    <Avatar sx={{ bgcolor: green[500] }} onClick={addNewServer} >
                        <AddCircleIcon />
                    </Avatar>
                </Stack>
            }
        </div>
    )
}