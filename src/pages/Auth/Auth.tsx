import { useState } from 'react';
import { Login, Signup, Header } from '../../components';
import './Auth.scss';

export function Auth() {
    const [signup, setSignup] = useState(true);

    const toggleComponent = (): void => {
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
            <Header />
            <div className='form-selector' onClick={toggleComponent}>{signup ? 'Nouveau ?\nS\'enregistrer' : 'Déjà inscrit?\nSe connecter'}</div>
            {signup ? displayLogin() : displaySignup()}
        </div>
    )
}

