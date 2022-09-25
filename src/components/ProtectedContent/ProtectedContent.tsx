import { ReactNode } from "react";
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { AuthenticationService } from "../../services/authenticationService";
import { login } from '../../redux/authSlice';
import { User } from "../../interfaces/IUser";

type ProtectedContentProps = {
    children: ReactNode;
};

const ProtectedContent = ({ children } : ProtectedContentProps) => {
    const authStatus = useSelector((state:any) => state.auth);
    const dispatch = useDispatch();
    const token = window.localStorage.getItem('access_token');
    const authenticationService = new AuthenticationService();

    async function getUserInfos():Promise<User | null> {
        try {
            const response = await authenticationService.getMe();
            if(response.isSucceed) {
                return response.result;
            }
            return null;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    if(authStatus.token && token) {
        return <div>{children}</div> ;
    }
    
    if(!authStatus.token && token) {
        getUserInfos()
        .then(response => {
            if(response) {
                const newState = {
                    isLogged: true,
                    access_token: token,
                    user: response
                }
                dispatch(login(newState));
                return <div>{children}</div>
            }
            else {
                return <Navigate to="/auth" ></Navigate>
            }
        })
        .catch(error => {
            console.log(error);
            return <Navigate to="/auth" ></Navigate>
        });
    }
    if(!authStatus.token && !token) {
        return <Navigate to="/auth" ></Navigate>
    }
    
    return <div>Veuillez patienter</div>
}

export default ProtectedContent;