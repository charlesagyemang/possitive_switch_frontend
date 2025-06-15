import { cookies } from "next/headers";
import { apiCall } from "../api-utils";
import { API_WHO_AM_I } from "../auth/routes";
import { PUI_TOKEN } from "../constants";
import { redirect } from "next/navigation";

const JWT_KEY = "jwt";
const SESSION_KEY = "_session_id";
const SIDEBAR_STATE = "sidebar_state";
export const requireAuthUser = async () => {
  const cookieStore = await cookies();
  // const jwt = cookieStore.get(JWT_KEY)?.value;
  // const sessionId = cookieStore.get(SESSION_KEY)?.value;
  // const sbs = cookieStore.get(SIDEBAR_STATE)?.value;
  const token = cookieStore.get(PUI_TOKEN)?.value;
  if (!token) return redirect("/auth/login");
  try {
    const obj = await apiCall(API_WHO_AM_I, null, {
      server: true,
      method: "GET",
      headers: {
        // Cookie: `${JWT_KEY}=${jwt}; ${SESSION_KEY}=${sessionId}`,
        Authorization: `Brearer ${token}`,
      },
    });
    // console.log("See JWT, SESSION, SBS", jwt, sessionId, sbs);
    return obj?.data?.user;
  } catch (e) {
    console.log("lets see e", e?.toString());
  }
};
