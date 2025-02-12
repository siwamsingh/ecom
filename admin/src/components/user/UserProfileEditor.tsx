import { useState, useEffect } from "react";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import updateUserApi from "../../apis/users/updateUser.api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

type UserData = {
  status: string;
  login_attempt: number;
  username: string;
  phone_number: string;
  created_at: Date;
  last_login_time: Date;
  role: string;
  _id: number;
};

const UserProfileEditor: React.FC<{ userData: UserData | null }> = ({
  userData,
}) => {
  const defaultData = {
    status: "active",
    login_attempt: 0,
    username: "",
    phone_number: "",
    created_at: new Date().toISOString(),
    last_login_time: new Date().toISOString(),
    role: "customer",
    id: "",
  };

  const [editedData, setEditedData] = useState<{
    status: string;
    login_attempt: number;
  }>({
    status: userData?.status || defaultData.status,
    login_attempt: userData?.login_attempt || defaultData.login_attempt,
  });

  // Update editedData when userData changes
  useEffect(() => {
    if (userData) {
      setEditedData({
        status: userData.status || defaultData.status,
        login_attempt: userData.login_attempt || defaultData.login_attempt,
      });
    }
  }, [userData]);

  const statusOptions = ["active", "inactive", "blocked"];
  const loginAttemptOptions = [0, 1, 2, 3];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "inactive":
        return <XCircle className="w-5 h-5 text-gray-500 dark:text-gray-400" />;
      case "blocked":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: Date | string) => {
    if (dateString === "N/A") {
      return "N/A";
    }
    try {
      return new Date(dateString).toLocaleString("en-GB");
    } catch (error) {
      return "Invalid Date";
    }
  };

  const handleStatusChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setEditedData((prev) => ({
      ...prev,
      status: e.target.value,
    }));
  };

  const handleLoginAttemptChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setEditedData((prev) => ({
      ...prev,
      login_attempt: parseInt(e.target.value),
    }));
  };

  // Merge userData with defaultData to ensure all required fields exist
  const displayData = { ...defaultData, ...userData };


  const handelUpdate = async()=>{
    if(!userData) return;
    try {
      await updateUserApi({user_id:userData._id , user_status: editedData.status , user_login_attempt: editedData.login_attempt})
      toast.success("User Uodated Successfully.")
    } catch (error) {
      toast.error("Failed To Update User.");
      console.error(error);
      
    }
  }

  const navigate = useNavigate();

  const navigateToOrderHistory = ()=>{
    if(!userData?._id) return;
    navigate(`/users/get-user-history/${userData?._id}`);
  }

  return (
    <div className="md:flex gap-2 ">
      <div className="w-full md:w-2/3 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md p-6 mx-auto mb-3">
        <div className="space-y-6 ">
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h2 className="text-lg sm:text-2xl font-semibold ">
                User Profile
              </h2>
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                ID: {displayData._id || "N/A"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(editedData.status)}
              <span className="capitalize text-sm font-medium">
                {editedData.status}
              </span>
            </div>
          </div>

          {/* User Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-500">
                Username
              </label>
              <p className="mt-1 ml-2  text-xs sm:text-base">
                {displayData.username || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-500">
                Phone
              </label>
              <p className="mt-1 ml-2  text-xs sm:text-base">
                {displayData.phone_number || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-500">
                Created At
              </label>
              <p className="mt-1 ml-2  text-xs sm:text-base">
                {formatDate(displayData?.created_at || "N/A")}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-500">
                Last Login
              </label>
              <p className="mt-1 ml-2  text-xs sm:text-base">
                {formatDate(displayData?.last_login_time || "N/A")}
              </p>
            </div>
          </div>

          {/* Editable Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-500 mb-2">
                Status
              </label>
              <select
                value={editedData.status}
                onChange={(e) => {
                  handleStatusChange(e);
                }}
                className="w-full px-2 input input-bordered p-0 text-xs sm:text-sm"
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-500 mb-2">
                Login Attempts
              </label>
              <select
                value={editedData.login_attempt}
                onChange={(e) => {
                  handleLoginAttemptChange(e);
                }}
                className="w-full px-2 input input-bordered p-0 text-xs sm:text-sm"
              >
                {loginAttemptOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Role Badge */}
          <div className="pt-4 border-t flex justify-between items-end">
            <span className="inline-flex text-sm sm:text-base h-fit items-center px-3 py-1 rounded-full  font-medium bg-blue-100 text-blue-800">
              {displayData.role}
            </span>
            <div>
              <button className="btn btn-primary" onClick={handelUpdate}>Update</button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/3 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md p-6 mx-auto mb-3 ">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h2 className="text-lg sm:text-2xl font-semibold mb-5">
                Order History
              </h2>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(editedData.status)}
              <span className="capitalize text-sm font-medium">
                {editedData.status}
              </span>
            </div>
          </div>

          <div 
          onClick={navigateToOrderHistory}
          className="flex w-full flex-col gap-4 hover:bg-gray-800 dark:hover:bg-gray-600 hover:bg-opacity-20 rounded-2xl">
            <div className="skeleton h-32 w-full flex items-center justify-center text font-serif font-semibold text-sm sm:text-base">
              Click To Open Order History
            </div>
            <div className="skeleton h-4 min-w-0 w-28"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileEditor;
