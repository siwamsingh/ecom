export interface UserDataResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data: {
    _id: number;
    username: string;
    phone_number: string;
    status: string;
    role: string;
    last_login_time: string;
    login_attempt: string;
    created_at: string;
  };
}
