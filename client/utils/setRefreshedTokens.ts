import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

const setRefreshedTokens = (refreshedTokens: any,cookieStore: ReadonlyRequestCookies)=>{
    cookieStore.set("accessToken", refreshedTokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 15 * 24 * 60 * 60, // 15 days
      });

      cookieStore.set("refreshToken", refreshedTokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 15 * 24 * 60 * 60, // 15 days
      });

}

export default setRefreshedTokens