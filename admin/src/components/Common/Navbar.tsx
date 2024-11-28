import { FaUserCircle } from "react-icons/fa";
import { clearUser } from "../../redux/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import logoutApi from "../../apis/auth/logout.api";
import { useNavigate } from "react-router-dom";
import refreshApi from "../../apis/auth/refresh-token.api";

function Navbar() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const navigate = useNavigate();

  const logoutUser = async () => {
    try {
      await logoutApi();
    } catch (error: any) {
      if (error?.status === 577) {
        try {
          await refreshApi();
        } catch (error: any) {
          if (error?.status === 577) {
            localStorage.removeItem("userData");
            dispatch(clearUser());
            navigate("/login");
          } else {
            console.error("Failed to refresh token.");
            localStorage.removeItem("userData");
            dispatch(clearUser());
            navigate("/login");
            throw error;
          }
        }
      } else {
        localStorage.removeItem("userData");
        dispatch(clearUser());
        navigate("/login");
        throw error;
      }
    }
    localStorage.removeItem("userData");
    dispatch(clearUser());
    navigate("/");
  };

  return user ? (
    <div>
      <div className="navbar bg-base-100">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <button onClick={() => navigate("/")}>Home</button>
              </li>
              <li>
                <button onClick={() => navigate("/categories")}>
                  Categories
                </button>
              </li>
              <li>
                <a>Parent</a>
                <ul className="p-2">
                  <li>
                    <button>All Categories</button>
                  </li>
                  <li>
                    <button>Add New Category</button>
                  </li>
                  <li>
                    <button>Add New Category</button>
                  </li>
                </ul>
              </li>
              <li>
                <a>Item 3</a>
              </li>
            </ul>
          </div>
          <a className="btn btn-ghost text-xl">daisyUI</a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <button onClick={() => navigate("/")}>Home</button>
            </li>
            <li>
              <button onClick={() => navigate("/categories")}>
                Categories
              </button>
            </li>
            <li>
              <details>
                <summary>Parent</summary>
                <ul className="p-2">
                  <li>
                    <a>Submenu 1</a>
                  </li>
                  <li>
                    <a>Submenu 2</a>
                  </li>
                </ul>
              </details>
            </li>
            <li>
              <a>Item 3</a>
            </li>
          </ul>
        </div>
        <div className="navbar-end ">
          <ul className="menu menu-horizontal px-1">
            <li>
              <details>
                <summary>
                  <FaUserCircle size={30} />
                </summary>
                <ul className="">
                  <li>
                    <button
                      onClick={logoutUser}
                      className="btn btn-outline btn-error"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </details>
            </li>
          </ul>
        </div>
      </div>
    </div>
  ) : null;
}

export default Navbar;
