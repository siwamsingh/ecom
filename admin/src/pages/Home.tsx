import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/slices/userSlice";
import { RootState } from "../redux/store";

function Home() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);

  const setUserHandler = () => {
    const userString = localStorage.getItem("userData");
    if (!userString) return;
    const userData = JSON.parse(userString);
    dispatch(setUser(userData));
  };

  const getUserHandler = () => {
    console.log("Current User State:", user);
  };

  return (
    <div>
      <button className="btn btn-circle btn-secondary" onClick={setUserHandler}>
        Set User
      </button>
      <button className="btn btn-circle btn-primary" onClick={getUserHandler}>
        Get User
      </button>
    </div>
  );
}

export default Home;
