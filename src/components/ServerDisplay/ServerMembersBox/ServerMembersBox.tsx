import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Snackbar, Stack } from "@mui/material";

import { User } from "../../../interfaces/IUser";

import IoSocketContext from "../../../contexts/IoSocketContext";
import { UserItem } from "../../../components";

import "./ServerMembersBox.scss";
import { ServerService } from "../../../services/serverService";
import { AxiosError } from "axios";
import { reduxData } from "../../../interfaces/IReduxData";
import { Server } from "../../../interfaces/IServer";
import { addOrUpdateServer } from "../../../redux/serversSlice";
import { addUsers } from "../../../redux/usersSlice";

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

interface ServerMemberBoxProps {
	//serverUsers: User[];
	userId: string; 
	//joinServer: () => void;
	//isDisabled: boolean;
	//setServerUsers: Dispatch<SetStateAction<User[]>>
}

export function ServerMembersBox(props: ServerMemberBoxProps): JSX.Element {
	const dispatch = useDispatch();
	const usersState = useSelector((state: any) => state.users);
	const urlSearchParams = useParams();
	const Socket = useContext(IoSocketContext)!.Socket;
	const server = useSelector((state: reduxData) => state.servers.data.find((server: Server) => server.id === urlSearchParams.serverId));
	const [serverUsers, setServerUsers] = useState<User[]>([]);
	const [connectedUsers, setConnectedUsers] = useState<string[]>([props.userId]);
	const [hasConnecetdUsers, setHasConnectedUsers] = useState<boolean>(false);
	const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const [joinServerError, setJoinServerError] = useState<{ isError: boolean, errorMessage: string }>({ isError: false, errorMessage: '' });
	const [hasFetchUsers, setHasFetchUsers] = useState<boolean>(false);
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
                if (!usersState.data.find((user: User) => user.id === elt.id) && elt.id !== props.userId) {
                    usersToAdd.push(elt);
                }
            })
            dispatch(addUsers(usersToAdd));
            setServerUsers(usersData);
			setHasFetchUsers(true);
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
                        if (!usersState.data.find((user: User) => user.id === elt.id) && elt.id !== props.userId) {
                            usersToAdd.push(elt);
                        }
                    });
                    dispatch(addUsers(usersToAdd));
                    //setHasFetchUsers(true);
                    setServerUsers(response);

                })
                .catch(error => {
                    setServerUsers(error);
                });
        }
		
		if(!hasConnecetdUsers) {
			Socket.emit('getServerConnectedUsers', {serverId: urlSearchParams.serverId!});
		}
		

		Socket.on('serverUserList', (data:{userList: string[]}) => {
            setHasConnectedUsers(true);
			setConnectedUsers(data.userList);
        })

        Socket.on('userJoined', (data: {pseudo: string, id: string}) => {
            console.log(`${data.pseudo} connects`);
            setConnectedUsers([data.id, ...connectedUsers]);
        })

        Socket.on('userLeft', (data: {pseudo: string, id: string}) => {
            console.log(`${data.pseudo} left`);
            setConnectedUsers(connectedUsers.filter(elt => elt !== data.id));
        })

		Socket.on('newMember', (data: {user:User}) => {
			let oldList = JSON.parse(JSON.stringify(serverUsers));
			oldList.push(data.user);
			setServerUsers([data.user, ...oldList]);
		})

		Socket.on('goneMember', (data: {user:User}) => {
			console.log('Gone member : ', data);
			console.log(serverUsers); // []
			console.log(serverUsers.filter(elt => elt.id !== data.user.id));
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

      }, [urlSearchParams, connectedUsers]
	);

	console.log('MemberBox renders');
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
					{serverUsers.some(user => user.id === props.userId ) ? 'leave' : 'join'}
				</button>
			)}
			<Snackbar
				open={usersError.isError}
				autoHideDuration={4000}
				onClose={handleUsersToastClose}
                message={/*getFullError()*/usersError.errorMessage}
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