import { useState } from 'react';

import Login from '../../components/Login/Login';
import Signup from '../../components/Signup/Signup';

import './Auth.scss';

function Auth() {
    const [component, setComponent] = useState(true);

    const toggleComponent = ():void => {
        setComponent(!component);
    }
    
    const displayLogin = () => {
        return (<Login />)
    }
    const displaySignup = () => {
        return (
            <Signup />
        )
    }
    
    return (
        <div className="auth">
            <h2>Auth works !</h2>
            <div onClick={toggleComponent}>{component ? 'S\'enregistrer' : 'Se connecter'}</div>
            {component ? displayLogin() : displaySignup()}
        </div>
    )
}

export default Auth;