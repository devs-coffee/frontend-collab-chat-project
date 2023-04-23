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
    const [ searchError, setSearchError ] = useState<{isError:boolean, errorMessage:string}>({isError: false, errorMessage: ''});
    
    const searchServers = async () => {
        setSearchError({isError: false, errorMessage: ''});
        try {
            const response = await serverService.searchServers(searchInput);
            setFoundServers(response.result);
        } catch(error) {
            let errorMessage: string = 'Une erreur est survenue, veuillez réessayer';
            if(error instanceof AxiosError) {
                errorMessage = error.response?.data.message;
            }
            setSearchError({isError:true, errorMessage});
        }
    }

    const handleToastClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if(reason === 'clickaway') {
            return;
        }
        setSearchError({isError: false, errorMessage: ''});
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
                open={searchError.isError}
                autoHideDuration={4000}
                onClose={handleToastClose}
                message={searchError.errorMessage}
            />
        </div>
    )
}