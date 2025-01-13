import React, { useState } from "react";
import { domain } from "../../../env";
import { BasicDataProps } from "@/types/vtuber_content";
import https from "https";
import axios, { AxiosRequestConfig } from "axios";

import type { ReceivedMovie, ReceivedKaraoke } from "@/types/vtuber_content";
import type { ContextType } from "@/types/server";
import { Layout } from "@/components/layout/Layout";
import { YouTubePlayer } from "@/components/moviePlayer/YoutubePlayer";
import { timeStringToSecondNum, extractVideoId } from "@/util";
import {
  CreateForm,
  CreatePageProps,
} from "@/components/form/CreateContentForm";
import { NotLoggedIn } from "@/components/layout/Main";
import { checkLoggedin } from "@/util/webStrage/cookie";
import { CreateContentFormDescription } from "@/features/description";
import { set } from "react-hook-form";

export default function App({ posts: data, isSignin }: CreatePageProps) {
  const [posts, setPosts] = useState(data);
  const [vtubers, setVtubers] = useState(posts.vtubers);
  const [movies, setMovies] = useState(posts.vtubers_movies);
  const [karaokes, setKaraokes] = useState(posts.vtubers_movies_karaokes);
  //クリックされたかどうかの状態を保持する
  const [isClick, setIsClick] = useState(false);

  const handleclick = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsClick(true);
    const endpointURL = `${domain.backendHost}/vcontents`;

    try {
      const res: AxiosRequestConfig<BasicDataProps> = await axios.get(
        `${domain.backendHost}/vcontents/`
      );
      if (res.data) {
        setVtubers(res.data.vtubers);
        setMovies(res.data.vtubers_movies);
        setKaraokes(res.data.vtubers_movies_karaokes);
      }
    } catch (err) {
      console.log(err);
    }

    return (
      <div className="p-1">
        <div onClick={handleclick}>
          <input
            type="button"
            value="click here!"
            className="px-1 bg-green-700 hover:underline cursor-pointer rounded-md"
          />
          {isClick ? (
            <ShowApi
              vtubers={data.vtubers}
              vtubers_movies={data.vtubers_movies}
              vtubers_movies_karaokes={data.vtubers_movies_karaokes}
            />
          ) : (
            <p className="">表示されていません</p>
          )}
        </div>

        <div onClick={() => setIsClick(false)}>
          <input
            className="bg-red-600 hover:underline cursor-pointer rounded-md"
            type="button"
            value="リセット"
          ></input>
        </div>
      </div>
    );
  };
}

const ShowApi = ({
  vtubers,
  vtubers_movies: movies,
  vtubers_movies_karaokes: karaokes,
}: BasicDataProps) => {
  return (
    <div>
      {karaokes?.map((karaoke) => {
        return (
          <div key={karaoke.KaraokeId}>
            <span>{karaoke.KaraokeId}</span>
            <span>{karaoke.SongName}</span>
          </div>
        );
      })}
    </div>
  );
};

const axiosClient = axios.create({
  baseURL: `${domain.backendHost}/vcontents`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getServerSideProps(context: ContextType) {
  const { sessionToken, isLoggedin } = checkLoggedin(context);
  const httpsAgent = new https.Agent({ rejectUnauthorized: false });
  const options: AxiosRequestConfig = {
    headers: {
      cookie: `auth-token=${sessionToken}`,
    },
    withCredentials: true,
    httpsAgent: process.env.NODE_ENV === "production" ? undefined : httpsAgent,
  };

  try {
    const res = await axios.get(`${domain.backendHost}/vcontents/`, options);
    const resData = res.data;
    return {
      props: {
        posts: resData,
        isSignin: isLoggedin,
      },
    };
  } catch (error) {
    console.log("erroe in axios.get:", error);
  }
  return {
    props: {
      posts: null,
      isSignin: isLoggedin,
    },
  };
}
