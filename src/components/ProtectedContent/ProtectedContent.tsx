import { ReactNode, useState } from "react";
import { Navigate, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { AuthenticationService } from "../../services/authenticationService";
import { setUser } from '../../redux/authSlice';
import { User } from "../../interfaces/IUser";

import { MessageError } from "../";

type ProtectedContentProps = {
    children: ReactNode;
};

export const ProtectedContent = ({ children }: ProtectedContentProps) => {
    const authStatus = useSelector((state: any) => state.authStatus);
    const dispatch = useDispatch();
    const token = window.localStorage.getItem('access_token');
    const authenticationService = new AuthenticationService();
    const [errorMessage, setErrorMessage] = useState<string>('')
    const navigate = useNavigate();

    async function getUserInfos(): Promise<User | null> {
        try {
            const response = await authenticationService.getMe();
            if (response.isSucceed) {
                return response.result;
            }
            return null;
        } catch (error) {
            const errorMessage = error as Error;
            setErrorMessage(errorMessage.message);
            return null;
        }
    }

    if (authStatus.isLogged && token) {
        return <div>{children}</div>;
    }

    getUserInfos()
        .then(response => {
            if (response) {
                dispatch(setUser(response))
                return <div>{children}</div>
            }
            else {
                navigate('/auth');
            }
        })
        .catch(error => {
            return <Navigate to="/auth" ></Navigate>
        });

    errorMessage !== "" &&
        <MessageError
        open={errorMessage !== ''}
        setCallbackClose={() => setErrorMessage('')}
        message={errorMessage}
      />
    
    return <div>Veuillez patienter</div>
}

