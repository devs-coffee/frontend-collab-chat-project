import { unsetLogs } from "../../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import "./Home.scss";

export default function Home() {
  const dispatch = useDispatch();
  const authStatus = useSelector((state:any) => state.auth);
  return (
    <div className="Home">
      <h1>Hello {authStatus.user.pseudo} !</h1>
      
      <button onClick={() => dispatch(unsetLogs())} >signout</button>
      
    </div>
  );
}
