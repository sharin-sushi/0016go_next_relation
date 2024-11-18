import { useEffect, useState } from "react";
import https from "https";
import axios, { AxiosRequestConfig } from "axios";

import { domain } from "@/../env";
import type { User } from "@/types/user";
import { GetLogout, Withdraw } from "@/components/button/User";
import { Layout } from "@/components/layout/Layout";
import { NotLoggedIn } from "@/components/layout/Main";
import { ContextType } from "@/types/server";
import { checkLoggedin } from "@/util/webStrage/cookie";

const pageName = "MyProfile";

type Mypage = {
  listener: User;
  isSignin: boolean;
};

const Profile = ({ listener, isSignin }: Mypage) => {
  if (!isSignin) {
    return (
      <Layout pageName={pageName} isSignin={isSignin}>
        <div>
          <NotLoggedIn />
        </div>
      </Layout>
    );
  }

  return (
    <Layout pageName={"MyProfile"} isSignin={isSignin}>
      <div className="mt-6">
        <h2>会員情報</h2>
        <ul>
          <li>メンバー名: {listener?.ListenerName} </li>
          <li>登録日 : {listener?.CreatedAt?.toString()}</li>
          <br />
          <GetLogout /> <br />
          <br />
          <Withdraw />
        </ul>
      </div>
    </Layout>
  );
};

export default Profile;

export async function getServerSideProps(context: ContextType) {
  const { sessionToken, isLoggedin } = checkLoggedin(context);
  console.log(
    "pageName, sessionToken, isLoggedin =",
    pageName,
    sessionToken,
    isLoggedin
  ); // 会員、非会員、どのページかの記録のため

  const httpsAgent = new https.Agent({ rejectUnauthorized: false });
  const options: AxiosRequestConfig = {
    headers: {
      cookie: `auth-token=${sessionToken}`,
    },
    withCredentials: true,
    httpsAgent: process.env.NODE_ENV === "production" ? undefined : httpsAgent,
  };

  let resData = null;
  try {
    const res = await axios.get(`${domain.backendHost}/users/profile`, options);
    resData = res.data;
  } catch (error) {
    console.log("erroe in axios.get:", error);
    return {
      props: {
        listener: resData,
        isSignin: isLoggedin,
      },
    };
  }
  return {
    props: {
      listener: resData,
      isSignin: isLoggedin,
    },
  };
}
