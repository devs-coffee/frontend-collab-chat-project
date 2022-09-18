import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { login, signout } from '../../redux/authSlice';

import { loginForm } from '../../interfaces/ILoginForm';
import "./Login.scss";

export default function Login() {
    const authStatus = useSelector((state:any) => state.auth);
    const dispatch = useDispatch();

    let formObject: loginForm = {
        email: '',
        password: ''
    }
    const [inputValue, setInputValue] = useState(formObject);

    function valueChange(event: any):void {
        //console.log(event.target.value);
        let inputKey:string = event.target.id.substring(event.target.id.lastIndexOf('-') +1);
        if(Object.keys(formObject).includes(inputKey)) {
            Object.defineProperty(formObject, inputKey, {value: event.target.value});
        }
        setInputValue(formObject);
    }
    function handleSubmit(event: any):void {
        event.preventDefault();
        console.log('formulaire soumis');
        console.log(inputValue);
        console.log('authStatus :', authStatus);
        dispatch(login({pseudo: 'test'}));
    }

    /*
    // REMOVE AFTER TESTS
    */
   function handleSignout() {
    dispatch(signout());
   }
   /*
   // END REMOVE
   */
    
    return (
        <div className="Login">
            <div className="login-form">
                <h2>Connexion</h2>
                <div className="field-box">
                    <div className='login-form-email login-form__fields'>
                        <label className="login-form__labels" htmlFor="login-email">E-mail :</label>
                        <input type="text" name="login_email" id="login-email" onChange={valueChange} />
                    </div>
                    <div className='login-form-password login-form__fields'>
                        <label className="login-form__labels" htmlFor="login-password">Mot de passe</label>
                        <input type="text" name="login_password" id="login-password" onChange={valueChange} />
                    </div>
                </div>
                <button type="submit" onClick={handleSubmit} >envoi</button>
            </div>
           <br/>
           <br/>
           <br/>
           <p>{authStatus.user}</p>
           <button onClick={handleSignout}>Logout</button>

        </div>
    )
}