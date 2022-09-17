import { useState } from 'react';

import { signupForm } from '../../interfaces/ISignupForm';
import "./Signup.scss";

export default function Signup() {
    
    let formObject: signupForm = {
        pseudo: '',
        email: '',
        password: '',
        passwordconfirm: '',
        image: ''
    }

    const [inputValue, setInputValue] = useState(formObject);

    function valueChange(event: any):void {
        let inputKey:string = event.target.id.substring(event.target.id.lastIndexOf('-') + 1);
        if(Object.keys(formObject).includes(inputKey)) {
            Object.defineProperty(formObject, inputKey, {value: event.target.value});
        }
        setInputValue(formObject);
    }

    function handleSubmit(event: any):void {
        event.preventDefault();
        console.log(inputValue);
    }
    
    return (
        <div className="Signup">
            <div className="signup-form">
                <h2>inscription</h2>
                <div className="field-box">
                    <div className="signup-form-pseudo signup-form__fields">
                        <label className='signup-form__labels' htmlFor="signup-pseudo">Pseudo :</label>
                        <input type="text" name="signup_pseudo" id="signup-pseudo" onChange={valueChange} />
                    </div>
                    <div className='signup-form-email signup-form__fields'>
                        <label className='signup-form__labels' htmlFor="signup-email">Email :</label>
                        <input type="text" name="signup_email" id="signup-email" onChange={valueChange} />
                    </div>
                    <div className="signup-form-password signup-form__fields">
                        <label className="signup-form__labels" htmlFor="signup-password">Mot de passe :</label>
                        <input type="text" name="signup_password" id="signup-password" onChange={valueChange} />
                    </div>
                    <div className="signup-form-passwordconfirm signup-form__fields">
                        <label className="signup-form__labels" htmlFor="signup-passwordconfirm">Confirmez :</label>
                        <input type="text" name="signup_passwordconfirm" id="signup-passwordconfirm" onChange={valueChange} />
                    </div>
                    <button type="submit" onClick={handleSubmit} >envoi</button>
                </div>
            </div>
        </div>
    )
}