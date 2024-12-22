import React, { useContext, useEffect, useMemo, useState } from "react";
import https from "https";
import axios, { AxiosRequestConfig } from "axios";

import { domain } from "@/../env";
import type {
  ReceivedVtuber,
  ReceivedMovie,
  ReceivedKaraoke,
} from "@/types/vtuber_content";
import type { ContextType } from "@/types/server";
import { YouTubePlayer } from "@/components/moviePlayer/YoutubePlayer";
import { timeStringToSecondNum, extractVideoId } from "@/util";
import { Layout } from "@/components/layout/Layout";
import { VtuberDeleteTable } from "@/components/table/Vtuber";
import { MovieDeleteTable } from "@/components/table/Movie";
import { KaraokeDeleteTable } from "@/components/table/Karaoke";
import { ToClickTW } from "@/styles/tailwiind";
import { NotLoggedIn } from "@/components/layout/Main";
import Image from "next/image";
import { checkLoggedin } from "@/util/webStrage/cookie";

const pageName = "コンテンツ削除";

export const ToDeleteContext = React.createContext(
  {} as {
    toDeleteVtuberId: number;
    setToDeleteVtuberId: React.Dispatch<React.SetStateAction<number>>;
    toDeleteMovieUrl: string;
    setToDeleteMovieUrl: React.Dispatch<React.SetStateAction<string>>;
    toDeleteKaraokeId: number;
    setToDeleteKaraokeId: React.Dispatch<React.SetStateAction<number>>;
    setCurrentVideoId: React.Dispatch<React.SetStateAction<string>>;
    setCurrentStart: React.Dispatch<React.SetStateAction<number>>;
  }
);

type MyPagePosts = {
  vtubers_movies_karaokes_u_created: ReceivedKaraoke[];
  vtubers_movies_u_created: ReceivedMovie[];
  vtubers_u_created: ReceivedVtuber[];
  all_vtubers: ReceivedVtuber[];
  all_vtubers_movies: ReceivedMovie[];
};

type Mypage = {
  posts: MyPagePosts;
  isSignin: boolean;
};

export const DeletePage = ({ posts, isSignin }: Mypage) => {
  const vtubers =
    posts?.vtubers_u_created != null
      ? posts.vtubers_u_created
      : ([] as ReceivedVtuber[]);
  const movies = useMemo(
    () =>
      posts?.vtubers_movies_u_created != null
        ? posts.vtubers_movies_u_created
        : ([] as ReceivedMovie[]),
    [posts]
  );
  const karaokes = useMemo(
    () =>
      posts?.vtubers_movies_karaokes_u_created != null
        ? posts.vtubers_movies_karaokes_u_created
        : ([] as ReceivedKaraoke[]),
    [posts]
  );

  const [toDeleteVtuberId, setToDeleteVtuberId] = useState<number>(0);
  const [toDeleteMovieUrl, setToDeleteMovieUrl] = useState<string>("");
  const [toDeleteKaraokeId, setToDeleteKaraokeId] = useState<number>(0);
  const [currentVideoId, setCurrentVideoId] = useState<string>("LnL8i4c8sfo");
  const [currentStart, setCurrentStart] = useState<number>(0);

  useEffect(() => {
    if (toDeleteVtuberId && !toDeleteMovieUrl) {
    }
    if (toDeleteVtuberId && toDeleteMovieUrl) {
      const foundMovie = movies.find(
        (movies) => movies.MovieUrl === toDeleteMovieUrl
      );
      if (foundMovie) {
        const foundYoutubeId = extractVideoId(foundMovie.MovieUrl);
        setCurrentVideoId(foundYoutubeId);
        setCurrentStart(1);
      }
    }
  }, [toDeleteVtuberId, toDeleteMovieUrl, movies]);

  useEffect(() => {
    if (toDeleteVtuberId && toDeleteMovieUrl && toDeleteKaraokeId) {
      const foundKaraoke = karaokes.find(
        (karaoke) => karaoke.KaraokeId === toDeleteKaraokeId
      );
      if (foundKaraoke) {
        const foundSingStart = timeStringToSecondNum(foundKaraoke.SingStart);
        setCurrentStart(foundSingStart);
      }
    }
  }, [toDeleteMovieUrl, toDeleteKaraokeId, movies, toDeleteVtuberId, karaokes]);

  const handleMovieClickYouTube = (s: string, n: number) => {};

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
    <Layout pageName={pageName} isSignin={isSignin}>
      <ToDeleteContext.Provider
        value={{
          toDeleteVtuberId,
          setToDeleteVtuberId,
          toDeleteMovieUrl,
          setToDeleteMovieUrl,
          toDeleteKaraokeId,
          setToDeleteKaraokeId,
          setCurrentStart,
          setCurrentVideoId,
        }}
      >
        <div className="">
          <div id="decideBottun" className="fixed z-40">
            <div className="">
              <DeleteDecideButton
                posts={posts}
                selectedVtuberId={toDeleteVtuberId}
                selectedMovieUrl={toDeleteMovieUrl}
                selectedKaraokeId={toDeleteKaraokeId}
              />
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="inline-block text-sm mb-4 mt-2 mx-auto">
              <h1>会員の方へ</h1>
              <li>
                現在、データの編集・削除はデータ登録者とサイト管理者しかできないようにロックしています。
              </li>
              <li>ご自身の登録データはmypageでも確認できます。</li>
            </div>

            <div className={`mx-auto`}>
              <YouTubePlayer videoId={currentVideoId} start={currentStart} />
            </div>

            <div
              id="feature"
              className={`flex-col md:flex-row justify-center
                            max-w-[1000px] w-full mx-auto inline-block
                            top-0 p-1
                           `}
            >
              <div className="flex mt-1 md:mt-4 ">
                <Image
                  src="/content/human_white.svg"
                  className="h-5 mr-1"
                  width={24}
                  height={20}
                  alt=""
                />
                配信者: 自分の登録数{vtubers.length}
              </div>
              <VtuberDeleteTable posts={vtubers} />
              <div className="flex mt-4 ">
                <Image
                  src="/content/movie.svg"
                  className="h-5 mr-1"
                  width={24}
                  height={20}
                  alt=""
                />
                歌枠(動画): 自分の登録数{movies.length}
              </div>
              <MovieDeleteTable
                posts={movies}
                handleMovieClickYouTube={handleMovieClickYouTube}
              />

              <div className="flex mt-4">
                <Image
                  src="/content/note.svg"
                  className="h-5 mr-1"
                  width={24}
                  height={20}
                  alt=""
                />
                歌: 自分の登録数{karaokes != null ? karaokes.length : 0}
              </div>
              <div className="flex flex-col">
                <KaraokeDeleteTable
                  posts={karaokes}
                  handleMovieClickYouTube={handleMovieClickYouTube}
                />
              </div>
            </div>
          </div>
        </div>
      </ToDeleteContext.Provider>
    </Layout>
  );
};

export default DeletePage;
/////////////////////////////////////////////////////////////////////////////////////////
type selectedDate = {
  posts: MyPagePosts;
  selectedVtuberId: number;
  selectedMovieUrl: string;
  selectedKaraokeId: number;
};

type DeleteVtuber = {
  VtuberId: number;
  VtuberName: string | undefined;
};
type DeleteMovie = {
  VtuberId: number | undefined;
  MovieUrl: string;
};
type DeleteKaraoke = {
  MovieUrl: string;
  KaraokeId: number;
  SongName: string;
};

export function DeleteDecideButton({
  posts,
  selectedVtuberId,
  selectedMovieUrl,
  selectedKaraokeId,
}: selectedDate) {
  const vtubers = posts?.all_vtubers || [{} as ReceivedVtuber];
  const movies = posts?.all_vtubers_movies || [{} as ReceivedMovie];
  const karaokes = posts?.vtubers_movies_karaokes_u_created || [
    {} as ReceivedKaraoke,
  ];

  const foundVtuber = vtubers.find(
    (vtuber) => vtuber.VtuberId == selectedVtuberId
  );
  const foundMovie = movies.find((movie) => movie.MovieUrl == selectedMovieUrl);
  const foundKaraoke = karaokes.find(
    (karaoke) => karaoke.KaraokeId == selectedKaraokeId
  );

  const [crudContentType, setCrudContentType] = useState<string>("");
  useEffect(() => {
    if (selectedVtuberId) {
      setCrudContentType("vtuber");
    }
  }, [selectedVtuberId]);
  useEffect(() => {
    if (selectedMovieUrl) {
      setCrudContentType("movie");
    }
  }, [selectedMovieUrl]);
  useEffect(() => {
    if (selectedKaraokeId) {
      setCrudContentType("karaoke");
    }
  }, [selectedKaraokeId]);

  const axiosClient = axios.create({
    baseURL: `${domain.backendHost}/vcontents`,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const handleClick = async () => {
    if (crudContentType === "vtuber" && foundVtuber?.VtuberName) {
      try {
        const reqBody: DeleteVtuber = {
          VtuberId: selectedVtuberId, //deleteで必須
          VtuberName: foundVtuber.VtuberName, //deleteで必須
        };
        const response = await axiosClient.delete("/delete/vtuber", {
          data: reqBody,
        });
        if (response.status) {
          setCrudContentType("");
          alert("削除完了");
        } else {
          throw new Error(response.statusText);
        }
      } catch (err) {
        alert("削除失敗");
        console.error(err);
      }
    } else if (crudContentType === "movie" && foundMovie?.MovieUrl) {
      try {
        const reqBody: DeleteMovie = {
          VtuberId: selectedVtuberId, //deleteで必須
          MovieUrl: foundMovie.MovieUrl, //deleteで必須
        };
        const response = await axiosClient.delete("/delete/movie", {
          data: reqBody,
        });
        if (response.status) {
          setCrudContentType("");
          alert("削除完了");
        } else {
          throw new Error(response.statusText);
        }
      } catch (err) {
        alert("削除失敗");
        console.error(err);
      }
    } else if (crudContentType === "karaoke" && foundKaraoke?.SongName) {
      try {
        const reqBody: DeleteKaraoke = {
          MovieUrl: selectedMovieUrl, //deleteで必須
          KaraokeId: selectedKaraokeId, //deleteで必須
          SongName: foundKaraoke.SongName, //deleteで必須
        };
        const response = await axiosClient.delete("/delete/karaoke", {
          data: reqBody,
        });
        if (response.status) {
          setCrudContentType("");
          alert("削除完了");
        } else {
          throw new Error(response.statusText);
        }
      } catch (err) {
        alert("削除失敗");
        console.error(err);
      }
    } else {
      console.log(
        "削除するデータの種類(vtuber, movie, karaoke)の選択、またはで想定外のエラーが発生しました。"
      );
    }
  };

  const { setToDeleteVtuberId, setToDeleteMovieUrl, setToDeleteKaraokeId } =
    useContext(ToDeleteContext);
  const canselClickHandler = () => {
    setCrudContentType("");
    setToDeleteVtuberId(0);
    setToDeleteMovieUrl("");
    setToDeleteKaraokeId(0);
  };

  return (
    <div className="mid-w-1/2 min-h-3/1">
      <div>
        {crudContentType && (
          <div className="h-screen w-screen opacity-85 inset-0 bg-[#1f2724] z-30" />
        )}
      </div>
      <div className="fixed top-1/2 mx-auto md:left-[10%] md:right-[10%] max-w-[600px]">
        {crudContentType && (
          <div className="bg-[#FFF6E4] text-black p-5 sm:p-20 md:p-[10%] px-auto rounded-md ">
            {crudContentType === "vtuber" && (
              <div>
                VTuber：{foundVtuber?.VtuberName}
                <span className="mt-32"> を削除しますか？</span>
              </div>
            )}
            {crudContentType === "movie" && (
              <div>
                VTuber：{foundVtuber?.VtuberName}
                <br />
                &nbsp;&nbsp; の<br />
                歌枠動画：{foundMovie?.MovieTitle} <br />
                <span className="mt-32"> を削除しますか？</span>
              </div>
            )}
            {crudContentType === "karaoke" && (
              <div className="mx-auto">
                VTuber：{foundVtuber?.VtuberName && foundVtuber?.VtuberName}
                <br />
                歌枠動画：{foundMovie?.MovieTitle}
                <br />
                &nbsp;&nbsp; の<br />
                曲：{foundKaraoke?.SongName}
                (再生時間：{foundKaraoke?.SingStart})<br />
                <span className="mt-32"> を削除しますか？</span>
              </div>
            )}

            <div className="flex flex-row justify-center mt-1 md:mt-12">
              <button
                className={`${ToClickTW.regular} mx-auto w-24`}
                onClick={handleClick}
              >
                決定
              </button>
              <button
                className={`${ToClickTW.regular} mx-auto w-24`}
                onClick={() => canselClickHandler()}
              >
                キャンセル
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

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
    const res = await axios.get(
      `${domain.backendHost}/vcontents/delete/deletePage`,
      options
    );
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
