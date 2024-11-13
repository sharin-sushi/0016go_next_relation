import { ContextType } from "@/types/server";

// TODO: sign in → log inへ統一
export const checkLoggedin = (context: ContextType) => {
  const token = sessionToken(context);

  if (token === "") {
    return { sessionToken: token, isLoggedin: false };
  }

  return { sessionToken: token, isLoggedin: true };
};

const sessionToken = (context: ContextType) => {
  const sessionToken = context.req.headers.cookie
    ?.split(";")
    .find((cookie) => cookie.trim().startsWith("auth-token="))
    ?.split("=")[1];
  return sessionToken ?? "";
};
