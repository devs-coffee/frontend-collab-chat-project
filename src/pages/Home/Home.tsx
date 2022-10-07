import { Outlet, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { unsetLogs } from "../../redux/authSlice";
import Header from "../../components/template/header/Header";

import "./Home.scss";


export default function Home() {
  const dispatch = useDispatch();
  const authStatus = useSelector((state:any) => state.auth);
  return (
    <div className="Home">
      <Header/>
      <nav><Link to="/">Accueil</Link><Link to="profile">Editer le profil</Link></nav>
      
      <button onClick={() => dispatch(unsetLogs())} >signout</button>
      <Outlet />
    </div>
  );
}
