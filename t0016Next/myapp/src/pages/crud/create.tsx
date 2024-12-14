import { useEffect, useState, useMemo } from "react";
import https from "https";
import axios, { AxiosRequestConfig } from "axios";

import { domain } from "@/../env";
import type { ReceivedMovie, ReceivedKaraoke } from "@/types/vtuber_content";
import type { ContextType } from "@/types/server";
import { Layout } from "@/components/layout/Layout";
import { YouTubePlayer } from "@/components/moviePlayer/YoutubePlayer";
import { ConvertStringToTime, ExtractVideoId } from "@/util";
import {
  CreateForm,
  CreatePageProps,
} from "@/components/form/CreateContentForm";
import { NotLoggedIn } from "@/components/layout/Main";
import { checkLoggedin } from "@/util/webStrage/cookie";
import { CreateContentFormDescription } from "@/features/description";

const pageName = "コンテンツ登録";

export const CreatePage = ({ posts: data, isSignin }: CreatePageProps) => {
  const [posts, setPosts] = useState(data);
  const movies = useMemo(
    () => posts?.vtubers_movies || ([] as ReceivedMovie[]),
    [posts]
  );
  const karaokes = useMemo(
    () => posts?.vtubers_movies_karaokes || ([] as ReceivedKaraoke[]),
    [posts]
  );

  const [selectedVtuber, setSelectedVtuber] = useState<number>(0);
  const [selectedMovie, setSelectedMovie] = useState<string>("");
  const [selectedKaraoke, setSelectedKaraoke] = useState<number>(0);
  const [currentVideoId, setCurrentVideoId] = useState<string>("9ehwhQJ50gs");
  const [currentStart, setCurrentStart] = useState<number>(0);
  // TODO: 命名再考
  const [preRender, setPreRender] = useState<boolean>(true);

  useEffect(() => {
    const foundMovie = movies.find(
      (movies) => movies.MovieUrl === selectedMovie
    );
    if (foundMovie) {
      const foundYoutubeId = ExtractVideoId(foundMovie.MovieUrl);
      setCurrentVideoId(foundYoutubeId);
      setCurrentStart(1);
    }
  }, [movies, selectedMovie]);

  const clearMovieHandler = () => {
    //中身空でもKaraokeのoptinosを空にしてくれるんだが…
    // でもこの関数をまるっと消すとダメ
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
        const foundSingStart = ConvertStringToTime(foundKaraoke.SingStart);
        setCurrentStart(foundSingStart);
      }
    }
  }, [selectedMovie, selectedKaraoke, selectedVtuber, karaokes]);

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
      <div id="body" className="flex flex-col w-full">
        <CreateContentFormDescription />

        <div
          id="feature"
          className={`flex flex-col w-full max-w-[1000px] mx-auto`}
        >
          <div className="inline-block flex-col top-0 mx-auto ">
            <div className="inline-block mx-auto md:mx-0 md:min-h-[255px] p-0 md:px-3">
              <YouTubePlayer videoId={currentVideoId} start={currentStart} />
            </div>
          </div>

          <div
            id="form"
            className={`inline-block flex-col top-0 max-w-[1000px] h-[600px]`}
          >
            <div className="mt-1">
              <CreateForm
                posts={posts}
                selectedVtuber={selectedVtuber}
                selectedMovie={selectedMovie}
                selectedKaraoke={selectedKaraoke}
                setSelectedVtuber={setSelectedVtuber}
                setSelectedMovie={setSelectedMovie}
                setSelectedKaraoke={setSelectedKaraoke}
                clearMovieHandler={clearMovieHandler}
                setCurrentVideoId={setCurrentVideoId}
                setRerendaringFlag={setPreRender}
                key={preRender ? "0" : "1"}
                setPosts={setPosts}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

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
export default CreatePage;
