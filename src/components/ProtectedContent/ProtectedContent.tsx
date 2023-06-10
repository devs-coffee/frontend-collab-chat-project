import { ReactNode } from "react";
import { Navigate, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { AuthenticationService } from "../../services/authenticationService";
import { setUser } from '../../redux/authSlice';
import { User } from "../../interfaces/IUser";

type ProtectedContentProps = {
    children: ReactNode;
};

const ProtectedContent = ({ children } : ProtectedContentProps) => {
    const authStatus = useSelector((state:any) => state.authStatus);
    const dispatch = useDispatch();
    const token = window.localStorage.getItem('access_token');
    const authenticationService = new AuthenticationService();
    const navigate = useNavigate();

    async function getUserInfos():Promise<User | null> {
        try {
            const response = await authenticationService.getMe();
            if(response.isSucceed) {
                return response.result;
            }
            return null;
        } catch (error) {
            return null;
        }
    }

    if(authStatus.isLogged && token) {
        return <div>{children}</div> ;
    }
    
    if(!authStatus.isLogged && token) {
        getUserInfos()
        .then(response => {
            if(response) {
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
    }
    if(!authStatus.isLogged && !token) {
        return <Navigate to="/auth" ></Navigate>
    }
    return <div>Veuillez patienter</div>
}

export default ProtectedContent;