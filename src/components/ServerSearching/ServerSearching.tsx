import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AxiosError } from 'axios';

import { Avatar } from '@mui/material';

import { ServerService } from '../../services/serverService';
import { ServerBase } from '../../interfaces/IServerBase';
import { MessageError } from '../';

export function ServerSearching() {
    const [searchInput, setSearchInput] = useState('');
    const [foundServers, setFoundServers] = useState<ServerBase[] | null>(null);
    const [searchError, setSearchError] = useState<string>('');

    const searchServers = async () => {
        setSearchError('');
        if (searchInput === '') {
            setSearchError('le champ de recherche ne peut être vide!!');
            return;
        }
        try {
            const response = await new ServerService().searchServers(searchInput);
            setFoundServers(response.result);
        } catch (error) {
            const errorMessage = error as Error;
            setSearchError(errorMessage.message);
        }
    }

    return (
        <div>
            <div>SearchServer works !</div>
            <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} type='text' />
            <button onClick={() => searchServers()}>envoyer</button>
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
            <MessageError
                open={searchError !== ''}
                setCallbackClose={() => setSearchError('')}
                message={searchError}
            />
        </div>
    )
}