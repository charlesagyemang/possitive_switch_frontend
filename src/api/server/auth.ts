import { cookies } from "next/headers";
import { apiCall } from "../api-utils";
import { API_WHO_AM_I } from "../auth/routes";

const JWT_KEY = "jwt";
const SESSION_KEY = "_session_id";
export const requireAuthUser = async () => {
  const cookieStore = await cookies();
  const jwt = cookieStore.get(JWT_KEY)?.value;
  const sessionId = cookieStore.get(SESSION_KEY)?.value;
  try {
    const obj = await apiCall(API_WHO_AM_I, null, {
      server: true,
      method: "GET",
      headers: {
        Cookie: `${JWT_KEY}=${jwt}; ${SESSION_KEY}=${sessionId}`,
      },
    });
    console.log("See JWT, SESSION", jwt, sessionId);
    return obj?.data?.user;
  } catch (e) {
    console.log("lets see e", e?.toString());
  }
};
