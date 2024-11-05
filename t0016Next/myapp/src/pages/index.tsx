import React, { useState } from "react";
import Link from "next/link";
import https from "https";
import axios, { AxiosRequestConfig } from "axios";

import { domain } from "@/../env";
import type {
  ReceivedVtuber,
  ReceivedMovie,
  ReceivedKaraoke,
} from "@/types/vtuber_content";
import { YouTubePlayer } from "@/components/moviePlayer/YoutubePlayer";
import { ExtractVideoId } from "@/components/Conversion";
import { Layout } from "@/components/layout/Layout";
import { VtuberTable } from "@/components/table/Vtuber";
import { MovieTable } from "@/components/table/Movie";
import {
  KaraokeThinTable,
  KaraokeMinRandamTable,
} from "@/components/table/Karaoke";
import { ToClickTW } from "@/styles/tailwiind";
import { ContextType } from "@/types/server";
import Image from "next/image";
import { TopPageNotice } from "@/features/notice/notice";

const pageName = "Top";

type TopPage = {
  posts: {
    vtubers: ReceivedVtuber[];
    vtubers_movies: ReceivedMovie[];
    vtubers_movies_karaokes: ReceivedKaraoke[];
    latest_karaokes: ReceivedKaraoke[];
  };
  isSignin: boolean;
};

const TopPage = ({ posts, isSignin }: TopPage) => {
  const vtubers = posts?.vtubers || ([] as ReceivedVtuber[]);
  const movies = posts?.vtubers_movies || ([] as ReceivedMovie[]);
  const karaokes = posts?.vtubers_movies_karaokes || ([] as ReceivedKaraoke[]);
  const latestKaraokes = posts?.latest_karaokes || ([] as ReceivedKaraoke[]);
  const [start, setStart] = useState<number>(36 * 60 + 41);
  const [currentMovieId, setCurrentMovieId] = useState<string>("E7x2TZ1_Ys4");

  const handleMovieClickYouTube = (url: string, start: number) => {
    //クリティカルな環境バグなので再発時用に残しておく
    // if (currentMovieId == ExtractVideoId(url)) {
    // setStart(-1);
    // setStart(start);
    // } else {
    setCurrentMovieId(ExtractVideoId(url));
    // setStart(start);
    //以下をonReady発火させられれば、ユーザー環境による差を少なくできる気がする
    // setTimeout(function () {
    // setStart(-1);
    setStart(start);
    // }, 1400); //local環境で、1100ms 高確率で✖, 1300ms:✖が少なくない //短すぎるとエラーになる注意
    // }
  };

  return (
    <Layout pageName={pageName} isSignin={isSignin}>
      <div className="pt-1">
        <TitleGroup />
        <TopPageNotice />

        <div className="flex flex-col justify-center">
          <div
            id="feature"
            className={`flex flex-col md:flex-row bg-[#657261] rounded
                max-w-[1000px]  md:h-[290px] h-[400px] w-full mx-auto
                top-0 p-1
                `}
          >
            {/* 左側の要素 */}
            <div className="flex flex-col mr-1 ">
              <div className="relative flex justify-center">
                <YouTubePlayer videoId={currentMovieId} start={start} />
              </div>
              <span className="relative flex md:top-2 justify-center md:mb-3">
                {"音量差 注意（特に個人→大手）"}
              </span>
            </div>

            {/* 右側の要素 */}
            <div
              id="right"
              className={`relative w-full h-full border px-1 rounded `}
            >
              <span className="mx-2 mt-1 absolute w-[70%]">
                最近登録された50曲
              </span>

              <Link
                href={`/sings/karaoke`}
                className={`${ToClickTW.regular}
                     absolute flex right-1 top-[1px]  `}
              >
                <Image
                  src="/content/note.svg"
                  className="h-5 mx-1 "
                  width={24}
                  height={20}
                  alt="note image"
                />
                もっと見る
              </Link>

              <div
                id="table"
                className="absolute  mt-7 m w-[98%] md:w-[99%] overflow-scroll h-[82%] md:h-[88%] "
              >
                <KaraokeThinTable
                  posts={latestKaraokes}
                  handleMovieClickYouTube={handleMovieClickYouTube}
                />
              </div>
            </div>
          </div>

          {vtubers.length == 0 && <FailedMessge />}

          <div
            id="feature"
            className={`flex-col md:flex-row justify-center max-w-[1000px] w-full mx-auto inline-block top-0 p-1`}
          >
            <div className="mt-4 max-w-[1000px]">
              <div className="flex">
                <Image
                  src="/content/human_white.svg"
                  className="h-5 mr-1"
                  width={24}
                  height={20}
                  alt="humans icon"
                />
                <h2 className="h-5 flex-1 mb-1">配信者</h2>
              </div>

              <div>
                <VtuberTable posts={vtubers} />
                <br />
                <h2 className="flex">
                  <Image
                    src="/content/movie.svg"
                    className="h-5 mr-1"
                    width={24}
                    height={20}
                    alt="movie icon"
                  />
                  歌枠(動画)
                </h2>
                <MovieTable
                  posts={movies}
                  handleMovieClickYouTube={handleMovieClickYouTube}
                />
                <br />
                <h2 className="flex">
                  <Image
                    src="/content/note.svg"
                    className="h-5 mr-1"
                    width={24}
                    height={20}
                    alt="note icon"
                  />
                  歌
                </h2>
                <KaraokeMinRandamTable
                  posts={karaokes}
                  handleMovieClickYouTube={handleMovieClickYouTube}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default TopPage;

const TitleGroup = () => {
  return (
    <div className="flex flex-col items-center">
      <hgroup className="pb-1 md:pb-3 ">
        <h1 className="flex justify-center text-xl sm:text-2xl md:text-3xl font-bold underline">
          V-Karaoke (VTuber-Karaoke-Lists)
        </h1>
        <h2 className="flex justify-center text-sm  md:text-base">
          「推し」の「歌枠」の聴きたい「歌」
        </h2>
        <h2 className="flex justify-center text-xs ms:text-sm md:text-base ">
          「ささっと把握」、「さくっと再生」、「ばばっと布教」
        </h2>
      </hgroup>
    </div>
  );
};

const FailedMessge = () => {
  return (
    <div className="flex justify-center py-12">
      <div className="flex flex-col  items-center bg-[#657261] font-bold text-xl p-6 max-w-[1200px]">
        <span className="mb-3">データの取得に失敗しました。</span>
        <span>ページ更新してもこの文章が表示された場合は</span>
        <Link
          href="https://twitter.com/shari_susi"
          className="text-3xl text-[#b3d854] underline hover:opacity-70"
        >
          開発者のX
        </Link>
        <span>にDMいただけますと幸いです。</span>
      </div>
    </div>
  );
};

/////////////////////////////////////////////////////////////////////////////
export async function getServerSideProps(context: ContextType) {
  const rawCookie = context.req.headers.cookie;
  const sessionToken = rawCookie
    ?.split(";")
    .find((cookie: string) => cookie.trim().startsWith("auth-token="))
    ?.split("=")[1];
  let isSignin = false;
  if (sessionToken) {
    isSignin = true;
  }
  console.log(
    "pageName, sessionToken, isSigni =",
    pageName,
    sessionToken,
    isSignin
  ); //アクセス数記録のため

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
    const res = await axios.get(`${domain.backendHost}/vcontents/`, options);
    resData = res.data;
  } catch (error) {
    console.log("erroe in axios.get:", error);
  }
  return {
    props: {
      posts: resData,
      isSignin: isSignin,
    },
  };
}
