import React, { useState } from "react";
import https from "https";
import axios, { AxiosRequestConfig } from "axios";
import Link from "next/link";
import Image from "next/image";

import { domain } from "@/../env";
import { Layout } from "@/components/layout/Layout";
import type {
  ReceivedKaraoke,
  ReceivedVtuber,
  ReceivedMovie,
} from "../../types/vtuber_content"; //type{}で型情報のみインポート
import { VtuberTable } from "@/components/table/Vtuber";
import { MovieTable } from "@/components/table/Movie";
import { KaraokePagenatoinTable } from "@/components/table/Karaoke";
import { YouTubePlayer } from "@/components/moviePlayer/YoutubePlayer";
import { extractVideoId } from "@/util";
import { ContextType } from "@/types/server";
import { NotLoggedIn } from "@/components/layout/Main";
import { ToClickTW } from "@/styles/tailwiind";
import { checkLoggedin } from "@/util/webStrage/cookie";

const pageName = "MyPage";

type Mypage = {
  data: {
    vtubers_movies_karaokes_u_created: ReceivedKaraoke[];
    vtubers_movies_u_created: ReceivedMovie[];
    vtubers_u_created: ReceivedVtuber[];
  };
  isSignin: boolean;
};

const MyPage = ({ data, isSignin }: Mypage) => {
  const [currentMovieId, setCurrentMovieId] = useState<string>("Bjsn-QpwmvU"); //こむぎ ワールドイズマイン
  const [start, setStart] = useState<number>(8091);
  const [selectedPost, setSelectedPost] = useState<ReceivedKaraoke>(
    {} as ReceivedKaraoke
  );

  if (!isSignin) {
    return (
      <Layout pageName={pageName} isSignin={isSignin}>
        <div>
          <NotLoggedIn />
        </div>
      </Layout>
    );
  }

  const vtubers = data?.vtubers_u_created || ([] as ReceivedVtuber[]);
  const movies = data?.vtubers_movies_u_created || ([] as ReceivedMovie[]);
  const karaokes =
    data?.vtubers_movies_karaokes_u_created || ([] as ReceivedKaraoke[]);

  const handleMovieClickYouTube = (url: string, start: number) => {
    setCurrentMovieId(extractVideoId(url));
    setStart(start);
  };
  const handleMovieClickYouTubeDemoMovie = () => {
    const demoUrl = "HunsO-8Eo7Q";
    const startTimeCreateOfDemo = 130;
    setCurrentMovieId(demoUrl);
    setStart(startTimeCreateOfDemo);
  };

  return (
    <Layout pageName={pageName} isSignin={isSignin}>
      <div className="flex flex-col max-w-[1000px] justify-ite">
        <div className="flex mx-auto mt-6">
          <YouTubePlayer videoId={currentMovieId} start={start} />
        </div>

        {vtubers.length + movies.length + karaokes.length === 0 ? (
          <div
            id="feature"
            className={`bg-[#657261] rounded top-0 p-1
          max-w-[1000px]  md:h-[290px] h-[400px] w-full mx-auto
                `}
          >
            <div className="mt-4 ">
              <h1 className="flex flex-col font-bold text-lg ">
                <span className="mx-auto">自分の登録したデータ一覧</span>
              </h1>

              <div className="flex flex-col p-5">
                <div className="mx-auto">
                  自分で登録したデータが無いようです...TT
                </div>
                <button
                  className={`${ToClickTW.regular} flex max-w-40 mt-8 mx-auto`}
                  onClick={() => handleMovieClickYouTubeDemoMovie()}
                >
                  データ登録方法を <br />
                  動画で見る
                </button>
                <div className="flex justify-center">
                  <span className="py-5">
                    <Link
                      href="/crud/create"
                      className={`${ToClickTW.regular} `}
                    >
                      データ登録する
                    </Link>
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            id="feature"
            className={`flex-col md:flex-row justify-center
                max-w-[1000px] w-full mx-auto inline-block
                top-0 p-1
                `}
          >
            <div className="mt-4 max-w-[1000px] ">
              <h1 className="font-bold text-lg">
                <u></u>自分の登録したデータ一覧
              </h1>
              <div>
                <div className="">
                  <div className=" ">
                    <div className="flex">
                      <Image
                        src="/content/human_white.svg"
                        width={20}
                        height={20}
                        alt="Human Icon"
                        className="h-5 mr-1"
                      />
                      <h2>配信者: 登録数{vtubers.length}</h2>
                    </div>
                    <VtuberTable posts={vtubers} />
                    <br />
                  </div>

                  <div className=" ">
                    <div className="flex">
                      <Image
                        src="/content/movie.svg"
                        width={20}
                        height={20}
                        alt="Movie Icon"
                        className="h-5 mr-1"
                      />
                      <h2>歌枠(動画): 登録数{movies.length}</h2>
                    </div>
                    <MovieTable
                      posts={movies}
                      handleMovieClickYouTube={handleMovieClickYouTube}
                    />
                    <br />
                  </div>

                  <div className=" ">
                    <div className="flex">
                      <Image
                        src="/content/note.svg"
                        width={20}
                        height={20}
                        alt="Note Icon"
                        className="h-5 mr-1"
                      />
                      <h2>歌: 登録数{karaokes.length}</h2>
                    </div>
                  </div>

                  <KaraokePagenatoinTable
                    posts={karaokes}
                    handleMovieClickYouTube={handleMovieClickYouTube}
                    setSelectedPost={setSelectedPost}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        <br />
        <div className={`w-auto`}>
          <Link href="/user/profile" className={`${ToClickTW.regular} w-auto`}>
            プロフィール
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default MyPage;

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

  try {
    const res = await axios.get(`${domain.backendHost}/users/mypage`, options);
    const resData = res.data;

    return {
      props: {
        data: resData,
        isSignin: isLoggedin,
      },
    };
  } catch (error) {
    console.log("erroe in axios.get:", error);
  }
  return {
    props: {
      data: null,
      isSignin: isLoggedin,
    },
  };
}
