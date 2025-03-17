import { redirect } from "next/navigation";

const checkAuth = async (cookieHeader: string) => {
  if (!cookieHeader) {
    redirect("/auth/login");
  }
};

export default checkAuth;