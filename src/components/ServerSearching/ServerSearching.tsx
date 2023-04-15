import { useState, MouseEvent } from 'react';
import { Link } from 'react-router-dom';

import { Avatar } from '@mui/material';


import { ServerService } from '../../services/serverService';
import { Server } from '../../interfaces/IServer';

const serverService = new ServerService();

export default function ServerSearching() {
    const [searchInput, setSearchInput] = useState('');
    const [foundServers, setFoundServers] = useState<Server[] | null>(null);
    
    const searchServers = async (e: MouseEvent<HTMLButtonElement>) => {
        const response = await serverService.searchServers(searchInput);
        console.log(response);
        setFoundServers(response.result);
    }
    
    return (
        <div>
            <div>SearchServer works !</div>
            <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} type='text' />
            <button onClick={(e: MouseEvent<HTMLButtonElement>) => searchServers(e)}>envoyer</button>
            {foundServers && (
                <div>
                    {foundServers.length > 0 && (
                        <>
                        <p>Trouvé {foundServers.length} serveurs :</p>
                        {foundServers.map((server, index) => (
                            <div key={index}>
                                <Link to={`/server/${server.id}`} title={server.name}>
                                    {server.picture ?
                                        (<Avatar alt="avatar server" src={server.picture} />)
                                        :
                                        (<Avatar>{server.name.substring(0, 1).toUpperCase()}</Avatar>)
                                    }
                                </Link>
                                {server.name}
                            </div>
                        ))}
                        </>
                    )}
                    {foundServers.length < 1 && (
                        <p>Aucun serveur trouvé</p>
                    )}
                </div>
            )}
            
        </div>
    )
}
