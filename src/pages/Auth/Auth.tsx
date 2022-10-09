import { useState } from 'react';

import Login from '../../components/auth/Login/Login';
import Signup from '../../components/auth/Signup/Signup';

import './Auth.scss';

function Auth() {
    const [signup, setSignup] = useState(true);

    const toggleComponent = ():void => {
        setSignup(!signup);
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
            <h2>Bienvenue sur<br />OpenWebChat</h2>
            <div className='form-selector' onClick={toggleComponent}>{signup ? 'Nouveau ?\nS\'enregistrer' : 'Se connecter'}</div>
            {signup ? displayLogin() : displaySignup()}
        </div>
    )
}

export default Auth;