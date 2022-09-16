import { Outlet, Link } from 'react-router-dom';

import './Auth.scss';

function Auth() {
    return (
        <div className="auth">
            <h2>Auth works !</h2>
            <Link to="/auth/login">login</Link><br/>
            <Link to="/auth/signup">Signup</Link>
            <Outlet />
        </div>
    )
}

export default Auth;