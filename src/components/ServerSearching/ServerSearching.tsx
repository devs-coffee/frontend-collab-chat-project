import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Avatar, Snackbar } from '@mui/material';


import { ServerService } from '../../services/serverService';
import { Server } from '../../interfaces/IServer';
import { AxiosError } from 'axios';

const serverService = new ServerService();

export default function ServerSearching() {
    const [searchInput, setSearchInput] = useState('');
    const [foundServers, setFoundServers] = useState<Server[] | null>(null);
    const [ searchError, setSearchError ] = useState<boolean>(false);
    const [ axiosErrorMessage, setAxiosErrorMessage ] = useState<string>('');
    
    const searchServers = async () => {
        setAxiosErrorMessage('');
        setSearchError(false);
        try {
            const response = await serverService.searchServers(searchInput);
            if(response.isSucceed) {
                setFoundServers(response.result);
            } else {
                console.log(response.errorMessage);
                setAxiosErrorMessage(response.errorMessage!)
                setSearchError(true);
            }
        } catch(error) {
            console.log(error);
            if(error instanceof AxiosError) {
                setAxiosErrorMessage(error.response?.data.message);
            } else {
                setAxiosErrorMessage('Une erreur est survenue, veuillez réessayer');
            }
            setSearchError(true)
        }
    }

    const handleToastClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if(reason === 'clickaway') {
            return;
        }
        setSearchError(false);
        setAxiosErrorMessage('');
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
            <Snackbar 
                open={searchError}
                autoHideDuration={4000}
                onClose={handleToastClose}
                message={axiosErrorMessage}
            />
        </div>
        
    )
}
