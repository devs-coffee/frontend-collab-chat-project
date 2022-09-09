import { useState } from 'react';

import "./Login.scss";

export default function Login() {
    let formObject = {
        email: '',
        password: ''
    }
    const [inputValue, setInputValue] = useState(formObject);
    
    return (
        <div className="Login">
            <div className="login-form">
                <h2>Connexion</h2>
                
            </div>
        </div>
    )
}