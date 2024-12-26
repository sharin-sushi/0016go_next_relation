import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import https from "https";
import axios, { AxiosRequestConfig } from "axios";

import { domain } from "@/../env";
import type { ReceivedMovie, ReceivedKaraoke } from "@/types/vtuber_content";
import type { ContextType } from "@/types/server";
import { EditPageProps, EditForm } from "@/components/form/EditContentForm";
import { Layout } from "@/components/layout/Layout";
import { YouTubePlayer } from "@/components/moviePlayer/YoutubePlayer";
import { convertStringToTime, extractVideoId } from "@/util";
import { GestLogin } from "@/components/button/User";
import { NotLoggedIn } from "@/components/layout/Main";
import { checkLoggedin } from "@/util/webStrage/cookie";

const pageName = "コンテンツ編集";

export const EditPage = ({ posts, isSignin }: EditPageProps) => {
  const [selectedVtuber, setSelectedVtuber] = useState<number>(0);
  const [selectedMovie, setSelectedMovie] = useState<string>("");
  const [selectedKaraoke, setSelectedKaraoke] = useState<number>(0);
  const [currentVideoId, setCurrentVideoId] = useState<string>("AAsRtnbDs-0");
  const [currentStart, setCurrentStart] = useState<number>(27);

  const movies = useMemo(
    () => posts?.vtubers_movies_karaokes || [{} as ReceivedMovie],
    [posts]
  );
  const karaokes = useMemo(
    () => posts?.vtubers_movies_karaokes || [{} as ReceivedKaraoke],
    [posts]
  );

  useEffect(() => {
    const foundMovie = movies.find(
      (movies) => movies.MovieUrl === selectedMovie
    );
    if (foundMovie) {
      const foundYoutubeId = extractVideoId(foundMovie.MovieUrl);
      setCurrentVideoId(foundYoutubeId);
      setCurrentStart(1);
    }
  }, [selectedMovie, setCurrentVideoId, setCurrentStart, movies]);

  const clearMovieHandler = () => {
    //中身空でもKaraokeのoptinosを空にしてくれるんだが…
    // setSelectedKaraoke(0);
  };

  useEffect(() => {
    if (selectedVtuber && selectedMovie && selectedKaraoke) {
      const foundMovies = karaokes.filter(
        (karaoke) => karaoke.MovieUrl === selectedMovie
      );
      const foundKaraoke = foundMovies.find(
        (foundMovie) => foundMovie.KaraokeId === selectedKaraoke
      );
      if (foundKaraoke) {
        const foundSingStart = convertStringToTime(foundKaraoke.SingStart);
        setCurrentStart(foundSingStart);
      }
    }
  }, [selectedVtuber, selectedMovie, selectedKaraoke, karaokes]);

  if (!isSignin) {
    return (
      <Layout pageName={pageName} isSignin={isSignin}>
        <div>
          <NotLoggedIn />
        </div>
      </Layout>
    );
  }

  if (!isSignin) {
    return (
      <div className="by-3 mx-auto">
        <h1>ログインが必要なサービスです</h1>
        <Link href={`/user/signin`}>
          <u>ログイン</u>
        </Link>
        <br />
        <Link href={`/user/signup`}>
          <u>会員登録</u>
        </Link>
        <GestLogin />
      </div>
    );
  }

  return (
    <Layout pageName={pageName} isSignin={isSignin}>
      <div className="">
        <div className="flex justify-center text-sm mb-3 ">
          <span className="">
            <h1 className="bg-gray-600 w-[180px]">会員の方へ</h1>
            <li>
              現在、データの編集・削除はデータ登録者とサイト管理者しかできないようにロックしています。
            </li>
            <li>
              ご自身の登録データは
              <Link
                href="/user/mypage"
                className="underline underline-offset-1"
              >
                マイページ
              </Link>
              で確認できます。
            </li>
          </span>
        </div>

        <div
          id="feature"
          className={`flex flex-col  w-full max-w-[1000px] mx-auto`}
        >
          <div className="inline-block flex-col top-0 mx-auto ">
            <div className="inline-block mx-auto md:mx-0 md:min-h-[255px] p-0 md:p-3">
              <YouTubePlayer videoId={currentVideoId} start={currentStart} />
            </div>
          </div>

          <div
            id="form"
            className={`
                       inline-block flex-col w-full top-0 max-w-[1000px] h-[700px]
                    `}
          >
            <EditForm
              posts={posts}
              selectedVtuber={selectedVtuber}
              selectedMovie={selectedMovie}
              selectedKaraoke={selectedKaraoke}
              setSelectedVtuber={setSelectedVtuber}
              setSelectedMovie={setSelectedMovie}
              setSelectedKaraoke={setSelectedKaraoke}
              clearMovieHandler={clearMovieHandler}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default EditPage;

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
