import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import getAllUsersApi from "../../apis/users/getUsers.api";
import { HiUserGroup } from "react-icons/hi";
import { MdOutlinePhoneIphone } from "react-icons/md";

import { PiUserCirclePlusDuotone } from "react-icons/pi";
import { CiSearch } from "react-icons/ci";
import { FaUser } from "react-icons/fa";
import getUserApi from "../../apis/users/getUser.api";
import getErrorMsg from "../../utility/getErrorMsg";

import UserProfileEditor from "./UserProfileEditor";

interface User {
  _id: number;
  username: string;
  phone_number: string;
  status: "active" | "inactive" | "blocked";
}

type UserDataFromDb = {
  status: string;
  login_attempt: number;
  username: string;
  phone_number: string;
  created_at: Date;
  last_login_time: Date;
  role: string;
  _id: number;
};

const GetUserComp: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [searchText, setSearchText] = useState<string>("");
  const [searchUsing, setSearchUsing] = useState<string>("id");
  const [status, setStatus] = useState<"active" | "inactive" | "blocked" | "">(
    ""
  );
  const [userData, setUserData] = useState<UserDataFromDb | null>(null);
  const role = "customer";

  const fetchUsers = async () => {
    try {
      const userFilter = {
        page,
        status,
        role,
      };
      const data = await getAllUsersApi(userFilter);

      setUsers(data.data);
      setTotalPages(data.maxPages);
      setTotalUsers(data.total);
    } catch (error: any) {
      if ((error?.status && error?.status === 577) || error?.status === 477) {
        toast.error("Session Expired Login Again.");
      } else {
        toast.error("Something went wrong while fetching users.");
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, status]);

  type UserData = {
    user_id: number | null | undefined;
    user_phone_number: string | null | undefined;
  };

  const [first,setFirst] = useState(true);

  const fetchUser = async () => {
    setFirst(false);
    let searchData: UserData;
    if (searchUsing === "id") {
      searchData = {
        user_id: Number(searchText),
        user_phone_number: undefined,
      };
    } else {
      searchData = {
        user_id: undefined,
        user_phone_number: searchText,
      };
    }
    try {
      const data = await getUserApi(searchData);
      console.log(data);

      setUserData(data.user);
    } catch (error: any) {
      setUserData(null);
      if ((error?.status && error?.status === 577) || error?.status === 477) {
        toast.error("Session Expired Login Again.");
      } else {
        const errMsg = getErrorMsg(error, null, "getting user");
        toast.error(errMsg);
        console.error(error);
      }
    }
  };

  const handleSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  return (
    <div className="p-4 max-w-screen-xl mx-auto ">
      <div className="max-w-md mb-4 flex gap-1 sm:gap-4 items-center">
        <select
          name="status"
          value={searchUsing}
          onChange={(e) => {
            setSearchUsing(e.target.value);
          }}
          className="text-sm select select-bordered m-0 p-1"
        >
          <option value="id" className="px-2">
            Id
          </option>
          <option value="phone" className="px-2">
            Phone
          </option>
        </select>
        <div className="relative w-full">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            name="search"
            placeholder="Search..."
            value={searchText}
            onChange={handleSearchTextChange}
            required
          />
          <button
            type="submit"
            className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={fetchUser}
          >
            <CiSearch size={20} />
          </button>
        </div>
      </div>

      {userData ? (
        <div className="mb-4">
          <UserProfileEditor userData={userData} />
        </div>
      ) : first ? (
        null
      ) : <div className="max-w-lg mx-auto text-gray-500 flex justify-center items-center font-mono font-bold text-lg sm:text-2xl h-24 sm:h-36 ">
      <span>User Not Found !</span>
    </div>}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base sm:text-2xl font-bold flex items-center gap-2">
          <HiUserGroup />
          <span>Users:</span> <span className="text-red-500">{totalUsers}</span>
        </h2>
        <div className="flex space-x-4">
          <select
            value={status}
            onChange={(e) =>
              setStatus(
                e.target.value as "active" | "inactive" | "blocked" | ""
              )
            }
            className="select select-bordered"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users !== undefined &&
          users.map((user) => (
            <div
              key={user._id}
              className="card bg-gray-100 dark:bg-gray-800 shadow-lg p-4 rounded-lg transition-all duration-300 flex flex-row items-center"
              onClick={() => {
                setUserData(user as UserDataFromDb);
              }}
            >
              <div className="flex-1">
                <div className="flex justify-between">
                  <h2 className="text-sm sm:text-base font-bold mb-2 dark:text-white flex items-center gap-2">
                    <PiUserCirclePlusDuotone size={30} />
                    {user._id}
                  </h2>
                  <span
                    className={`badge ${
                      user.status === "active"
                        ? "badge-success"
                        : user.status === "inactive"
                        ? "badge-warning"
                        : "badge-error"
                    } text-xs`}
                  >
                    {user.status}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300  flex items-center gap-2 ml-2">
                  <MdOutlinePhoneIphone /> {user.phone_number}
                </p>
                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300  flex items-center gap-2 ml-2">
                  <FaUser />
                  {user.username}
                </p>
              </div>
            </div>
          ))}
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          className="btn btn-outline"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          className="btn btn-outline"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default GetUserComp;
