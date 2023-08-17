import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AxiosError } from "axios";

import { Snackbar, Stack } from "@mui/material";

import IoSocketContext from "../../../contexts/IoSocketContext";
import { User } from "../../../interfaces/IUser";
import { reduxData } from "../../../interfaces/IReduxData";
import { Server } from "../../../interfaces/IServer";
import { UserItem } from "../../../components";
import { ServerService } from "../../../services/serverService";
import { addOrUpdateServer } from "../../../redux/serversSlice";
import { addUsers } from "../../../redux/usersSlice";

import "./ServerMembersBox.scss";

const getServerUsers = async (serverId: string) => {
    try {
        const response = await new ServerService().getServerUsers(serverId);
        return response.result;
    } catch (error) {
        let errorMessage = "membres du serveur non récupérés, veuillez réessayer";
        if (error instanceof AxiosError) {
            errorMessage = error.response?.data.message;
        }
        throw new Error(errorMessage);
    }
}

export function ServerMembersBox(): JSX.Element {
	const dispatch = useDispatch();
	const usersState = useSelector((state: any) => state.users);
	const urlSearchParams = useParams();
	const Socket = useContext(IoSocketContext)!.Socket;
	const server = useSelector((state: reduxData) => state.servers.data.find((server: Server) => server.id === urlSearchParams.serverId));
	const userId = useSelector((state: reduxData) => state.authStatus.user!.id);
	const [serverUsers, setServerUsers] = useState<User[]>([]);
	const [connectedUsers, setConnectedUsers] = useState<string[]>([userId]);
	const [hasConnectdUsers, setHasConnectedUsers] = useState<boolean>(false);
	const [isDisabled, setIsDisabled] = useState<boolean>(false);
	const [joinServerError, setJoinServerError] = useState<{ isError: boolean, errorMessage: string }>({ isError: false, errorMessage: '' });
	const [usersError, setUsersError] = useState<{ isError: boolean, errorMessage: string }>({ isError: false, errorMessage: '' });

	const joinServer = async () => {
        try {
            setIsDisabled(true);
            const response = await new ServerService().joinServer(urlSearchParams.serverId!);
            const newServer = { ...server };
            newServer.isCurrentUserMember = response.result
            dispatch(addOrUpdateServer(newServer));
            const usersData = await getServerUsers(urlSearchParams.serverId!)
            let usersToAdd: User[] = [];
            usersData.forEach((elt: User) => {
                if (!usersState.data.find((user: User) => user.id === elt.id) && elt.id !== userId) {
                    usersToAdd.push(elt);
                }
            })
            dispatch(addUsers(usersToAdd));
            setServerUsers(usersData);
            setIsDisabled(false)
        } catch (error) {
            let errorMessage: string;
            if (error instanceof AxiosError) {
                errorMessage = error.response?.data.message;
            } else {
                errorMessage = 'une erreur est survenue, veuillez réessayer';
            }
            setJoinServerError({ isError: true, errorMessage });
            return;
        }
    }

	const handleJoinToastClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setJoinServerError({ isError: false, errorMessage: '' });
    }

	const handleUsersToastClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setUsersError({ isError: false, errorMessage: '' });
    }

	useEffect(() => {
		if(serverUsers.length === 0) {
			getServerUsers(urlSearchParams.serverId!)
                .then(response => {
                    let usersToAdd: User[] = [];
                    response.forEach((elt: User) => {
                        if (!usersState.data.find((user: User) => user.id === elt.id) && elt.id !== userId) {
                            usersToAdd.push(elt);
                        }
                    });
                    dispatch(addUsers(usersToAdd));
                    setServerUsers(response);
                })
                .catch(error => {
                    setUsersError(error);
                });
        }
		
		if(serverUsers.length !== 0 && !hasConnectdUsers) {
			Socket.emit('getServerConnectedUsers', {serverId: urlSearchParams.serverId!});
		}

		Socket.on('serverUserList', (data: { userList: string[] }) => {
			setHasConnectedUsers(true);
			setConnectedUsers(data.userList);
		})

		Socket.on('userJoined', (data: { pseudo: string, id: string }) => {
			setConnectedUsers([data.id, ...connectedUsers]);
		})

		Socket.on('userLeft', (data: { pseudo: string, id: string }) => {
			setConnectedUsers(connectedUsers.filter(elt => elt !== data.id));
		})

		Socket.on('newMember', (data: {user:User}) => {
			let oldList = JSON.parse(JSON.stringify(serverUsers));
			setServerUsers([data.user, ...oldList]);
		})

		Socket.on('goneMember', (data: { user: User }) => {
			let oldList = JSON.parse(JSON.stringify(serverUsers));
			setServerUsers(oldList.filter((elt: User) => elt.id !== data.user.id));
		})

		return () => {
			Socket.off('serverUserList');
			Socket.off('userJoined');
			Socket.off('userLeft');
			Socket.off('newMember');
			Socket.off('goneMember');
		}

	}, [connectedUsers, serverUsers]
	);

	return (
		<div className="members">
			<h4 className="heading">Users :</h4>
			<Stack className="stack" spacing={0.8}>
				{serverUsers.map(user => (
					<UserItem key={`userBadge_${user.id}`} user={user} isConnected={connectedUsers.includes(user.id)}/>
				))}
			</Stack>
			{serverUsers.length > 0 && (
				<button className="joinOrLeaveButton" onClick={joinServer} disabled={isDisabled}>
					{serverUsers.some(user => user.id === userId ) ? 'leave' : 'join'}
				</button>
			)}
			<Snackbar
				open={usersError.isError}
				autoHideDuration={4000}
				onClose={handleUsersToastClose}
                message={usersError.errorMessage}
			/>
			<Snackbar
				open={joinServerError.isError}
				autoHideDuration={4000}
				onClose={handleJoinToastClose}
				message={joinServerError.errorMessage}
			/>
		</div>
	);
}