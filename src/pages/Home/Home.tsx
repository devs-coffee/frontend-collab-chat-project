import { Outlet, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { unsetLogs } from "../../redux/authSlice";

import "./Home.scss";


export default function Home() {
  const dispatch = useDispatch();
  const authStatus = useSelector((state:any) => state.auth);
  return (
    <div className="Home">
      <h1>Hello {authStatus.user.pseudo} !</h1>
      <nav><Link to="/">Accueil</Link><Link to="profile">Editer le profil</Link></nav>
      
      <button onClick={() => dispatch(unsetLogs())} >signout</button>
      <Outlet />
    </div>
  );
}
