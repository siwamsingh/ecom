import  { useEffect, useState } from "react";
import masterSwitchController from "../apis/products/masterSwitch.api";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { toast } from "react-toastify";

const ManageProfile = () => {
  const [userDetails, setUserDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [switchStatus, setSwitchStatus] = useState<number>(0);

  
  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setUserDetails(user);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, [user]);

  const handleMasterSwitch = async (status: number) => {
    try {
      setSwitchStatus(status);
      await masterSwitchController({ switch: status });
      toast.success(`Master Switch turned ${status === 1 ? "ON" : "OFF"} successfully.`);
    } catch (error) {
      toast.error("Failed to update Master Switch status. Please try again.")
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg mt-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        Manage Profile
      </h1>
      {userDetails ? (
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <p className="font-semibold text-gray-700 dark:text-gray-300">
              Name:
            </p>
            <p className="text-gray-800 dark:text-gray-200">{userDetails.username || "N/A"}</p>
          </div>
          <div className="flex items-center space-x-4">
            <p className="font-semibold text-gray-700 dark:text-gray-300">
              Phone Number:
            </p>
            <p className="text-gray-800 dark:text-gray-200">
              {userDetails.phone_number || "N/A"}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <p className="font-semibold text-gray-700 dark:text-gray-300">
              Role:
            </p>
            <p className="text-gray-800 dark:text-gray-200">{userDetails.role || "N/A"}</p>
          </div>
        </div>
      ) : (
        <p className="text-gray-700 dark:text-gray-300">No user details found.</p>
      )}

      <div className="mt-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Master Switch
        </h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => handleMasterSwitch(1)}
            className={`px-4 py-2 rounded-lg text-white font-semibold ${
              switchStatus === 1 ? "bg-green-500" : "bg-gray-500 hover:bg-green-600"
            }`}
          >
            Turn ON
          </button>
          <button
            onClick={() => handleMasterSwitch(0)}
            className={`px-4 py-2 rounded-lg text-white font-semibold ${
              switchStatus === 0 ? "bg-red-500" : "bg-gray-500 hover:bg-red-600"
            }`}
          >
            Turn OFF
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageProfile;
