import axios from 'axios';

const serverUrl = import.meta.env.VITE_API_URL;

type loginData = {
  phone_number: string,
  userPassword: string
}

const loginApi = async (loginData: loginData) => {
  try {
    const response = await axios.post(`${serverUrl}/users/login`, loginData , { withCredentials: true });
    const { data, statusCode, message, success } = response.data;

    if (success && statusCode === 200) {
      const { user } = data;
      if (user.role !== "admin") {
        throw new Error("Access denied. User is not an admin.");
      }
      console.log("Login Successful:", message);
      return user;
    } else {
      throw new Error(message || "An unexpected error occurred.");
    }
  } catch (error: any) {
    console.log(error);
    
    console.error("Error during login:", error?.message);
    throw error; // Rethrow the error to handle it in the calling code
  }
};

export default loginApi;
