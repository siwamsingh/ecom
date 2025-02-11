import axios from 'axios';
import refreshApi from '../auth/refresh-token.api';

const serverUrl = import.meta.env.VITE_API_URL;

type MasterSwitchData = {
  switch: number; // 0 or 1
};

const masterSwitch = async (switchData: MasterSwitchData) => {
  try {
    const response = await axios.post(`${serverUrl}/product/master-switch`, switchData, {
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' },
    });

    const { data, statusCode, message, success } = response.data;

    if (success && statusCode === 200) {
      console.log(message);
      return data;
    } else {
      throw new Error(message || 'An unexpected error occurred.');
    }
  } catch (error) {
    throw error;
  }
};

const masterSwitchController = async (switchData: MasterSwitchData) => {
  try {
    await masterSwitch(switchData);
  } catch (error: any) {
    console.error('Error during master switch operation:', error?.message);
    try {
      if (error?.status === 577) {
        await refreshApi();
        return await masterSwitch(switchData);
      } else {
        throw error;
      }
    } catch (err: any) {
      throw err;
    }
  }
};

export default masterSwitchController;
