import { useState } from 'react';
import { Login, Signup, Header } from '../../components';
import './Auth.scss';

export function Auth() {

    const [signup, setSignup] = useState(true);
    const displayLogin = () => (<Login />)
    const displaySignup = () => (<Signup />)

    return (
        <div className="auth">
            <Header />
            <div className='form-selector' onClick={():void => setSignup(!signup)}>{signup ? 'Nouveau ?\nS\'enregistrer' : 'Déjà inscrit?\nSe connecter'}</div>
            {signup ? displayLogin() : displaySignup()}
        </div>
    )
    
}

