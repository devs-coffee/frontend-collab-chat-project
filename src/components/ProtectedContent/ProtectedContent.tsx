import { ReactNode } from "react";
import axios from 'axios';
import { useNavigate, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

type ProtectedContentProps = {
    children: ReactNode;
};


const ProtectedContent = ({ children } : ProtectedContentProps) => {
    const authStatus = useSelector((state:any) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    if(!authStatus.token && !window.localStorage.getItem('oldschoolgames')) {
        // redirect to login
        return <Navigate to="/auth" ></Navigate>
    }
    
    return <div>{children}</div> ;
}



export default ProtectedContent;