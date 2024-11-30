import { FaUserCircle } from "react-icons/fa";
import { clearUser } from "../../redux/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import logoutApi from "../../apis/auth/logout.api";
import { useNavigate } from "react-router-dom";
import getErrorMsg from "../../utility/getErrorMsg";
import { toast } from "react-toastify";

function Navbar() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const navigate = useNavigate();

  const logoutUser = async () => {
    try {
      await logoutApi();
    } catch (error: any) {
      if (error?.status === 577 || error?.status === 477) {
        toast.error("Session Expired Login Again.");
      } else {
        const errMsg = getErrorMsg(error, 477, "logout");
        toast.error(errMsg);
      }
    }

    localStorage.removeItem("userData");
    dispatch(clearUser());
    navigate("/login");
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
                <a>Product</a>
                <ul className="p-2">
                  <li>
                    <button onClick={() => navigate("/products/add")}>
                      Add Product
                    </button>
                  </li>
                  <li>
                    <button onClick={() => navigate("/products/update")}>
                      Update/Delete Product
                    </button>
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
                <summary>Product</summary>
                <ul className="p-2">
                  <li>
                    <button onClick={() => navigate("/products/add")}>
                      Add Product
                    </button>
                  </li>
                  <li>
                    <button onClick={() => navigate("/products/update")}>
                      Update/Delete Product
                    </button>
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
