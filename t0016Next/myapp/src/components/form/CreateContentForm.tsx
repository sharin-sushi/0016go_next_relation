import React, { MouseEventHandler, useEffect, useState } from "react";
import { set, useForm } from "react-hook-form";
import axios, { AxiosRequestConfig } from "axios";

import { domain } from "@/../env";
import type {
  CrudDate,
  BasicDataProps,
  ReceivedVtuber,
} from "@/types/vtuber_content";
import { DropDownVtuber } from "@/components/dropDown/Vtuber";
import { DropDownMovie } from "@/components/dropDown/Movie";
import { DropDownKaraoke } from "@/components/dropDown/Karaoke";
import { checkLoggedin, extractVideoId, ValidateCreate } from "@/util";
import { FormTW, ToClickTW } from "@/styles/tailwiind";
import { DisableBox, NeedBox } from "@/components/box/Box";
import { getYoutubeMovie, SelectCrudContent } from "@/components/form/Common";
import router from "next/router";
import { FmdBadTwoTone, Https } from "@mui/icons-material";
import { ClickEvent } from "@szhsin/react-menu";
import https from "https";

export type CreatePageProps = {
  posts: BasicDataProps;
  isSignin: boolean;
};

type CreateDataProps = {
  posts: BasicDataProps;
  selectedVtuber: number;
  selectedMovie: string;
  selectedKaraoke: number;
  setSelectedVtuber: (vtuberId: number) => void;
  setSelectedMovie: (url: string) => void;
  setSelectedKaraoke: (KaraokeId: number) => void;
  clearMovieHandler: () => void;
  setCurrentVideoId: (id: string) => void;
  setRerendaringFlag: React.Dispatch<React.SetStateAction<boolean>>;
  setPosts: React.Dispatch<React.SetStateAction<BasicDataProps>>;
};

type CreateVtuber = {
  VtuberName: string;
  VtuberKana: string;
  IntroMovieUrl: string | null;
};
type CreateMovie = {
  VtuberId: number;
  MovieTitle: string;
  MovieUrl: string;
};
type CreateKaraoke = {
  MovieUrl: string;
  SongName: string;
  SingStart: string;
};

export function CreateForm({
  posts,
  selectedVtuber,
  selectedMovie,
  selectedKaraoke,
  setSelectedVtuber,
  setSelectedMovie,
  setSelectedKaraoke,
  clearMovieHandler,
  setCurrentVideoId,
  setRerendaringFlag,
  setPosts,
}: CreateDataProps) {
  const [vtubers, setVtubers] = useState(posts.vtubers);
  const [movies, setMovies] = useState(posts.vtubers_movies);
  const [karaokes, setKaraokes] = useState(posts.vtubers_movies_karaokes);

  const foundVtuber = vtubers?.find(
    (vtuber) => vtuber.VtuberId === selectedVtuber
  );
  const foundMovie = movies?.find((movie) => movie.MovieUrl === selectedMovie);
  const foundKaraoke = karaokes?.find(
    (karaoke) => karaoke.KaraokeId === selectedKaraoke
  );

  const [vtuberNameInput, setVtuberNameInput] = useState(
    foundVtuber?.VtuberName ?? ""
  );
  const [VtuberKanaInput, setVtuberKanaInput] = useState(
    foundVtuber?.VtuberKana ?? ""
  );
  const [IntroMovieUrInput, setIntroMovieUrInput] = useState(
    foundVtuber?.IntroMovieUrl ?? ""
  );
  const [MovieUrlInput, setMovieUrlInput] = useState(
    foundMovie?.MovieUrl ?? ""
  );
  const [MovieTitleInput, setMovieTitleInput] = useState(
    foundMovie?.MovieTitle ?? ""
  );
  const [SingStartInput, setSingStartInput] = useState(
    foundKaraoke?.SingStart ?? ""
  );
  const [SongNameInput, setSongNameInput] = useState(
    foundKaraoke?.SongName ?? ""
  );

  const [crudContentType, setCrudContentType] = useState("movie");

  const axiosClient = axios.create({
    baseURL: `${domain.backendHost}/vcontents`,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const [isDisplaySuccessModal, setIsDisplaySuccessModal] = useState(false);
  const openSuccessModal = () => {
    setIsDisplaySuccessModal(true);
    setTimeout(() => setIsDisplaySuccessModal(false), 4500);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CrudDate>({ reValidateMode: "onChange" });

  const getTitle = async (e: React.MouseEvent<Element, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("getTitle");

    if (MovieUrlInput != null && MovieUrlInput != "") {
      const movieId = MovieUrlInput.split("watch?v=")[1];
      try {
        const res = await getYoutubeMovie({ movieId, isSnippet: true });
        if (res) {
          console.log("res", res.items[0].snippet.title);
          setMovieTitleInput(res.items[0].snippet.title);
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      setMovieTitleInput("動画タイトルが取得できませんでした。");
    }
  };

  const onSubmit = async (CrudData: CrudDate) => {
    if (crudContentType === "vtuber") {
      console.log("vtuber");
      try {
        const reqBody: CreateVtuber = {
          VtuberName: CrudData.VtuberName,
          VtuberKana: CrudData.VtuberKana,
          IntroMovieUrl: CrudData.IntroMovieUrl,
        };
        await axiosClient.post("/create/vtuber", reqBody);
        const res: AxiosRequestConfig<BasicDataProps> = await axios.get(
          `${domain.backendHost}/vcontents/`
        );
        openSuccessModal();
        if (res?.data) {
          setVtubers(res.data.vtubers);
          setRerendaringFlag((prev) => !prev);
        }
      } catch (err) {
        alert("登録失敗: VTuber");
        console.error(err);
      } finally {
        return;
      }
    }

    if (crudContentType === "movie") {
      console.log("movie");
      try {
        const reqBody: CreateMovie = {
          VtuberId: selectedVtuber, //既存値
          MovieTitle: CrudData.MovieTitle,
          MovieUrl: CrudData.MovieUrl,
        };
        await axiosClient.post("/create/movie", reqBody);
        const newData = await axiosClient.get<BasicDataProps>(
          `${domain.backendHost}/vcontents/`
        );

        openSuccessModal();
        if (newData?.data) {
          setVtubers(newData.data.vtubers);
          setMovies(newData.data.vtubers_movies);
          setRerendaringFlag((prev) => !prev);
          setPosts(newData.data);
        }
      } catch (err) {
        alert("登録失敗: 動画");
        console.error(err);
      } finally {
        return;
      }
    }

    if (crudContentType === "karaoke") {
      console.log("karaoke");
      try {
        const reqBody: CreateKaraoke = {
          MovieUrl: selectedMovie, //既存値
          SongName: CrudData.SongName,
          SingStart: CrudData.SingStart,
        };
        await axiosClient.post("/create/karaoke", reqBody);
        const newDataRes: AxiosRequestConfig<BasicDataProps> = await axios.get(
          `${domain.backendHost}/vcontents/`
        );
        openSuccessModal();
        if (newDataRes?.data) {
          console.log("newData", newDataRes);
          setVtubers(newDataRes.data.vtubers);
          setMovies(newDataRes.data.vtubers_movies);
          setKaraokes(newDataRes.data.vtubers_movies_karaokes);
          setRerendaringFlag((prev) => !prev);
        }
      } catch (err) {
        alert("登録失敗: karaoke");
        console.error(err);
      } finally {
        return;
      }
    }

    console.log(
      "登録するデータの種類(vtuber, movie, karaoke)の選択で想定外のエラーが発生しました。"
    );
  };

  return (
    <div
      className="flex flex-col justify-center w-full bg-[#FFF6E4]
              shadow-md rounded px-1 md:px-4 pt-4 mb-4"
    >
      <div id="selectContent" className="w-full mx-1 md:mx-3">
        <div className="flex flex-col justify-center w-full text-black font-bold">
          <SelectCrudContent
            contentType={crudContentType}
            setContentType={setCrudContentType}
          />
        </div>
      </div>
      <hr className={`${FormTW.horizon}`} />

      <div id="form" className="flex flex-col">
        <div>
          <div className="flex flex-col">
            <span className="text-black mx-auto">
              親データを選択してください
            </span>
            {(crudContentType === "movie" || crudContentType === "karaoke") && (
              <div className="w-full">
                <div className="pb-3">
                  <span className={`${FormTW.label}`}>VTuber</span>
                  <div className="">
                    {crudContentType === "movie" && !selectedVtuber && (
                      <span className="text-[#ff3f3f] ">
                        <u className="px-1">Vtuber</u>を選択してください
                      </span>
                    )}
                    {crudContentType === "karaoke" && (
                      <div className="text-[#ff3f3f] ">
                        {selectedVtuber == 0 && selectedMovie == "" && (
                          <span>
                            <u className="px-1">Vtuber</u>を選択してください
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <DropDownVtuber
                    posts={posts}
                    onVtuberSelect={setSelectedVtuber}
                    defaultMenuIsOpen={false}
                  />
                </div>
                {crudContentType === "karaoke" && (
                  <div className="flex flex-col w-full ">
                    <span className={`${FormTW.label}`}>動画(歌枠)</span>
                    <div className="text-[#ff3f3f] ">
                      {selectedMovie == "" && (
                        <span className="flex">
                          <u className="mx-1"> 動画(歌枠) </u>
                          を選択してください
                        </span>
                      )}
                    </div>
                    <DropDownMovie
                      posts={posts}
                      selectedVtuber={selectedVtuber}
                      setSelectedMovie={setSelectedMovie}
                      clearMovieHandler={clearMovieHandler}
                    />
                  </div>
                )}
                <hr className={`${FormTW.horizon}`} />
              </div>
            )}
          </div>

          <div>
            {crudContentType === "karaoke" && (
              <div id="decide" className=" ">
                <div className="flex flex-col  mt-1 my-4">
                  <span className="mx-auto text-black">
                    登録しようとしている歌が登録済みでないことを確認してください。
                    <br />
                    （この欄は入力データに影響はありませんが、選択すると再生が始まります）
                    <br />
                    同じ動画で同じ曲を歌った場合は、「曲(〇回目)」としてください。
                  </span>
                  <DropDownKaraoke
                    posts={posts}
                    selectedMovie={selectedMovie}
                    onKaraokeSelect={setSelectedKaraoke}
                  />
                </div>
                <hr className={`${FormTW.horizon}`} />
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <h2 className="text-black mx-auto">
              登録するデータを入力してください
            </h2>
            <div>
              {crudContentType === "vtuber" && (
                <div>
                  <div className="mb-3">
                    <div className="">
                      <span className={`${FormTW.label}`}>
                        VTuber
                        <NeedBox />
                      </span>
                    </div>
                    <input
                      className={`${ToClickTW.input}`}
                      {...register("VtuberName", ValidateCreate.VtuberName)}
                      placeholder={foundVtuber?.VtuberName || "例:妹望おいも"}
                      onChange={(e) => setVtuberNameInput(e.target.value)}
                    />
                    <span className="text-black">
                      {errors.VtuberName?.message}
                    </span>
                  </div>

                  <div className="mb-3">
                    <span className={`${FormTW.label}`}>
                      読み(kana)
                      <NeedBox />
                    </span>
                    <input
                      className={`${ToClickTW.input}`}
                      {...register("VtuberKana", ValidateCreate.VtuberKana)}
                      placeholder={
                        foundVtuber?.VtuberKana || "例:imomochi_oimo"
                      }
                      onChange={(e) => setVtuberKanaInput(e.target.value)}
                    />
                    <span className="text-black">
                      {errors.VtuberKana?.message}
                    </span>
                  </div>
                  <div>
                    <span className={`${FormTW.label}`}>紹介動画URL(*):</span>
                    <input
                      className={`${ToClickTW.input}`}
                      {...register(
                        "IntroMovieUrl",
                        ValidateCreate.IntroMovieUrl
                      )}
                      placeholder={
                        foundVtuber?.IntroMovieUrl ||
                        "例:www.youtube.com/watch?v=AlHRqSsF--8&t=75"
                      }
                      onChange={(e) => setIntroMovieUrInput(e.target.value)}
                    />
                    <span className="text-black">
                      {errors.IntroMovieUrl?.message}
                    </span>
                  </div>
                  <div className="flex flex-col text-black">
                    <span>* クエリで時間指定可能</span>
                    <span className="ml-4">
                      例:www.youtube.com/watch?v=7QStB569mto<u>&t=290</u>
                    </span>
                  </div>
                </div>
              )}

              {crudContentType === "movie" && (
                <div className="pt-3">
                  <div className="flex">
                    <span className={`${FormTW.label}`}>
                      URL
                      <NeedBox />
                    </span>
                    <button
                      className="bg-slate-400 rounded px-1"
                      onClick={getTitle}
                    >
                      動画タイトルを取得
                    </button>
                    <button
                      className="bg-slate-400 rounded px-1"
                      onClick={() =>
                        setCurrentVideoId(extractVideoId(MovieUrlInput))
                      }
                    >
                      再生
                    </button>
                  </div>
                  <input
                    className={`${ToClickTW.input}`}
                    {...register("MovieUrl", ValidateCreate.MovieUrl)}
                    placeholder={
                      foundMovie?.MovieUrl ||
                      "例: www.youtube.com/watch?v=AlHRqSsF--8"
                    }
                    onChange={(e) => setMovieUrlInput(e.target.value)}
                  />
                  <br />
                  <span className="text-black">{errors.MovieUrl?.message}</span>
                  <div className="mb-3">
                    <div className="">
                      <span className="block text-gray-700 text-sm font-bold">
                        動画タイトル
                        <NeedBox />
                        <DisableBox />
                      </span>
                    </div>
                    <input
                      className={`${ToClickTW.input}`}
                      value={MovieTitleInput}
                      {...register("MovieTitle", ValidateCreate.MovieTitle)}
                      placeholder={foundMovie?.MovieTitle || "動画タイトル"}
                      onChange={(e) => setMovieTitleInput(e.target.value)}
                    />
                    <span className="text-black">
                      {errors.MovieTitle?.message}
                    </span>
                  </div>
                </div>
              )}

              {crudContentType === "karaoke" && (
                <div className="pt-3">
                  <div className="flex">
                    <span className={`${FormTW.label}`}>
                      曲
                      <NeedBox />
                    </span>
                  </div>
                  <input
                    className={`${ToClickTW.input}`}
                    {...register("SongName", ValidateCreate.SongName)}
                    placeholder={foundKaraoke?.SongName || "曲"}
                    onChange={(e) => setSongNameInput(e.target.value)}
                  />
                  <span className="text-black">{errors.SongName?.message}</span>
                  <div className="flex mt-3">
                    <span className={`${FormTW.label}`}>
                      開始時間
                      <NeedBox />
                    </span>
                  </div>
                  <input
                    className={`${ToClickTW.input}`}
                    type="time"
                    step="1"
                    {...register("SingStart", ValidateCreate.SingStart)}
                    placeholder={foundKaraoke?.SingStart || "例 00:05:30"}
                    onChange={(e) => setSingStartInput(e.target.value)}
                  />
                  <span className="text-black">
                    {errors.SingStart?.message}
                  </span>
                </div>
              )}
            </div>
          </div>

          <hr className={`${FormTW.horizon}`} />

          <div className="flex relative justify-center">
            <button
              onClick={handleSubmit(onSubmit)}
              className={`${ToClickTW.decide} m-4 w-[100px] `}
            >
              登録確定
            </button>
          </div>
        </div>

        {isDisplaySuccessModal && (
          <div className="absolute z-40 bottom-[150px] left-[50%] -translate-x-[50%] h-52 w-[86%] md:w-96 bg-[#B7A692] p-2 pt-5 rounded-2xl shadow-lg shadow-black">
            <div className="flex flex-col justify-center item-center md:text-2xl font-bold">
              <span className="mx-auto">登録完了しました。</span>
              <span className="mx-auto">ページ内のリストを更新しますか？</span>
            </div>
            <div className="flex flex-col md:flex-row md:text-xl mt-2 md:mt-6">
              <button
                type="button"
                onClick={() => router.reload()}
                className={`${ToClickTW.boldChoice} p-2 mx-auto`}
              >
                更新する
              </button>
              <button
                type="button"
                onClick={() => setIsDisplaySuccessModal(false)}
                className={`${ToClickTW.boldChoice} p-2 mx-auto mt-4 md:my-0 font-bold`}
              >
                入力を維持するために <br />
                更新しない
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// export function CreateForm2({
//   posts,
//   selectedVtuber,
//   selectedMovie,
//   selectedKaraoke,
//   setSelectedVtuber,
//   setSelectedMovie,
//   setSelectedKaraoke,
//   clearMovieHandler,
//   setCurrentVideoId,
// }: CreateDataProps) {
//   const vtubers = posts?.vtubers;
//   const movies = posts?.vtubers_movies;
//   const karaokes = posts?.vtubers_movies_karaokes;

//   const foundVtuber = vtubers?.find(
//     (vtuber) => vtuber.VtuberId === selectedVtuber
//   );
//   const foundMovie = movies?.find((movie) => movie.MovieUrl === selectedMovie);
//   const foundKaraoke = karaokes?.find(
//     (karaoke) => karaoke.KaraokeId === selectedKaraoke
//   );

//   // NOTE: このsetterが無いと連続で登録できない。そもそもUIから変更予定なので一緒に直す。
//   const [vtuberNameInput, setVtuberNameInput] = useState(
//     foundVtuber?.VtuberName
//   );
//   const [VtuberKanaInput, setVtuberKanaInput] = useState(
//     foundVtuber?.VtuberKana
//   );
//   const [IntroMovieUrInput, setIntroMovieUrInput] = useState(
//     foundVtuber?.IntroMovieUrl
//   );
//   const [MovieUrlInput, setMovieUrlInput] = useState(
//     foundMovie?.MovieUrl ?? ""
//   );
//   const [MovieTitleInput, setMovieTitleInput] = useState(
//     foundMovie?.MovieTitle
//   );
//   const [SingStartInput, setSingStartInput] = useState(foundKaraoke?.SingStart);
//   const [SongNameInput, setSongNameInput] = useState(foundKaraoke?.SongName);

//   const [crudContentType, setCrudContentType] = useState<string>("movie");

//   const axiosClient = axios.create({
//     baseURL: `${domain.backendHost}/vcontents`,
//     withCredentials: true,
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });

//   const [isDisplay, setIsDisPlay] = useState<boolean>(false);
//   const handleOpen = () => {
//     setIsDisPlay(true);
//     setTimeout(() => setIsDisPlay(false), 4500);
//   };

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<CrudDate>({ reValidateMode: "onChange" });

//   const getTitle = async () => {
//     if (MovieUrlInput != null && MovieUrlInput != "") {
//       const movieId = MovieUrlInput.split("watch?v=")[1];
//       try {
//         const res = await getYoutubeMovie({ movieId, isSnippet: true });
//         if (res) {
//           console.log("res", res.items[0].snippet.title);
//           setMovieTitleInput(res.items[0].snippet.title);
//         }
//       } catch (err) {
//         console.error(err);
//       }
//     } else {
//       setMovieTitleInput("動画タイトルが取得できませんでした。");
//     }
//   };

//   const onSubmit = async (CrudData: CrudDate) => {
//     if (crudContentType === "vtuber") {
//       try {
//         const reqBody: CreateVtuber = {
//           VtuberName: CrudData.VtuberName,
//           VtuberKana: CrudData.VtuberKana,
//           IntroMovieUrl: CrudData.IntroMovieUrl,
//         };
//         const response = await axiosClient.post("/create/vtuber", reqBody);
//         if (response.status) {
//           handleOpen();
//         } else {
//           throw new Error(response.statusText);
//         }
//       } catch (err) {
//         alert("登録失敗");
//         console.error(err);
//       }
//     } else if (crudContentType === "movie") {
//       try {
//         const reqBody: CreateMovie = {
//           VtuberId: selectedVtuber, //既存値
//           MovieTitle: CrudData.MovieTitle,
//           MovieUrl: CrudData.MovieUrl,
//         };
//         const response = await axiosClient.post("/create/movie", reqBody);
//         if (response.status) {
//           handleOpen();
//         } else {
//           throw new Error(response.statusText);
//         }
//       } catch (err) {
//         alert("登録失敗");
//         console.error(err);
//       }
//     } else if (crudContentType === "karaoke") {
//       try {
//         const reqBody: CreateKaraoke = {
//           MovieUrl: selectedMovie, //既存値
//           SongName: CrudData.SongName,
//           SingStart: CrudData.SingStart,
//         };
//         const response = await axiosClient.post("/create/karaoke", reqBody);
//         if (response.status) {
//           handleOpen();
//         } else {
//           throw new Error(response.statusText);
//         }
//       } catch (err) {
//         alert("登録失敗");
//         console.error(err);
//       }
//     } else {
//       console.log(
//         "登録するデータの種類(vtuber, movie, karaoke)の選択で想定外のエラーが発生しました。"
//       );
//     }
//   };
//   return (
//     <div
//       className="flex flex-col justify-center w-full bg-[#FFF6E4]
//               shadow-md rounded px-1 md:px-4 pt-4 mb-4"
//     >
//       <div id="selectContent" className="w-full mx-1 md:mx-3">
//         <div className="flex flex-col justify-center w-full text-black font-bold">
//           <SelectCrudContent
//             contentType={crudContentType}
//             setContentType={setCrudContentType}
//           />
//         </div>
//       </div>
//       <hr className={`${FormTW.horizon}`} />

//       <div id="form" className="flex flex-col">
//         <form onSubmit={handleSubmit(onSubmit)}>
//           <div className="flex flex-col">
//             <span className="text-black mx-auto">
//               親データを選択してください
//             </span>
//             {(crudContentType === "movie" || crudContentType === "karaoke") && (
//               <div className="w-full">
//                 <div className="pb-3">
//                   <span className={`${FormTW.label}`}>VTuber</span>
//                   <div className="">
//                     {crudContentType === "movie" && !selectedVtuber && (
//                       <span className="text-[#ff3f3f] ">
//                         <u className="px-1">Vtuber</u>を選択してください
//                       </span>
//                     )}
//                     {crudContentType === "karaoke" && (
//                       <div className="text-[#ff3f3f] ">
//                         {selectedVtuber == 0 && selectedMovie == "" && (
//                           <span>
//                             <u className="px-1">Vtuber</u>を選択してください
//                           </span>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                   <DropDownVtuber
//                     posts={posts}
//                     onVtuberSelect={setSelectedVtuber}
//                     defaultMenuIsOpen={false}
//                   />
//                 </div>
//                 {crudContentType === "karaoke" && (
//                   <div className="flex flex-col w-full ">
//                     <span className={`${FormTW.label}`}>動画(歌枠)</span>
//                     <div className="text-[#ff3f3f] ">
//                       {selectedMovie == "" && (
//                         <span className="flex">
//                           <u className="mx-1"> 動画(歌枠) </u>
//                           を選択してください
//                         </span>
//                       )}
//                     </div>
//                     <DropDownMovie
//                       posts={posts}
//                       selectedVtuber={selectedVtuber}
//                       setSelectedMovie={setSelectedMovie}
//                       clearMovieHandler={clearMovieHandler}
//                     />
//                   </div>
//                 )}
//                 <hr className={`${FormTW.horizon}`} />
//               </div>
//             )}
//           </div>

//           <div>
//             {crudContentType === "karaoke" && (
//               <div id="decide" className=" ">
//                 <div className="flex flex-col  mt-1 my-4">
//                   <span className="mx-auto text-black">
//                     登録しようとしている歌が登録済みでないことを確認してください。{" "}
//                     <br />
//                     （この欄は入力データに影響はありませんが、選択すると再生が始まります）
//                     <br />
//                     同じ動画で同じ曲を歌った場合は、「曲(〇回目)」としてください。{" "}
//                   </span>
//                   <DropDownKaraoke
//                     posts={posts}
//                     selectedMovie={selectedMovie}
//                     onKaraokeSelect={setSelectedKaraoke}
//                   />
//                 </div>
//                 <hr className={`${FormTW.horizon}`} />
//               </div>
//             )}
//           </div>

//           <div className="flex flex-col">
//             <h2 className="text-black mx-auto">
//               登録するデータを入力してください
//             </h2>
//             <div>
//               {crudContentType === "vtuber" && (
//                 <div>
//                   <div className="mb-3">
//                     <div className="">
//                       <span className={`${FormTW.label}`}>
//                         VTuber
//                         <NeedBox />
//                       </span>
//                     </div>
//                     <input
//                       className={`${ToClickTW.input}`}
//                       {...register("VtuberName", ValidateCreate.VtuberName)}
//                       placeholder={foundVtuber?.VtuberName || "例:妹望おいも"}
//                       onChange={(e) => setVtuberNameInput(e.target.value)}
//                     />
//                     <span className="text-black">
//                       {errors.VtuberName?.message}
//                     </span>
//                   </div>

//                   <div className="mb-3">
//                     <span className={`${FormTW.label}`}>
//                       読み(kana)
//                       <NeedBox />
//                     </span>
//                     <input
//                       className={`${ToClickTW.input}`}
//                       {...register("VtuberKana", ValidateCreate.VtuberKana)}
//                       placeholder={
//                         foundVtuber?.VtuberKana || "例:imomochi_oimo"
//                       }
//                       onChange={(e) => setVtuberKanaInput(e.target.value)}
//                     />
//                     <span className="text-black">
//                       {errors.VtuberKana?.message}
//                     </span>
//                   </div>
//                   <div>
//                     <span className={`${FormTW.label}`}>紹介動画URL(*):</span>
//                     <input
//                       className={`${ToClickTW.input}`}
//                       {...register(
//                         "IntroMovieUrl",
//                         ValidateCreate.IntroMovieUrl
//                       )}
//                       placeholder={
//                         foundVtuber?.IntroMovieUrl ||
//                         "例:www.youtube.com/watch?v=AlHRqSsF--8&t=75"
//                       }
//                       onChange={(e) => setIntroMovieUrInput(e.target.value)}
//                     />
//                     <span className="text-black">
//                       {errors.IntroMovieUrl?.message}
//                     </span>
//                   </div>
//                   <div className="flex flex-col text-black">
//                     <span>* クエリで時間指定可能</span>
//                     <span className="ml-4">
//                       例:www.youtube.com/watch?v=7QStB569mto<u>&t=290</u>
//                     </span>
//                   </div>
//                 </div>
//               )}

//               {crudContentType === "movie" && (
//                 <div className="pt-3">
//                   <div className="flex">
//                     <span className={`${FormTW.label}`}>
//                       URL
//                       <NeedBox />
//                     </span>
//                     <button
//                       className="bg-slate-400 rounded px-1"
//                       onClick={getTitle}
//                     >
//                       動画タイトルを取得
//                     </button>
//                     <button
//                       className="bg-slate-400 rounded px-1"
//                       onClick={() =>
//                         setCurrentVideoId(ExtractVideoId(MovieUrlInput))
//                       }
//                     >
//                       再生
//                     </button>
//                   </div>
//                   <input
//                     className={`${ToClickTW.input}`}
//                     {...register("MovieUrl", ValidateCreate.MovieUrl)}
//                     placeholder={
//                       foundMovie?.MovieUrl ||
//                       "例: www.youtube.com/watch?v=AlHRqSsF--8"
//                     }
//                     onChange={(e) => setMovieUrlInput(e.target.value)}
//                   />
//                   <br />
//                   <span className="text-black">{errors.MovieUrl?.message}</span>
//                   <div className="mb-3">
//                     <div className="">
//                       <span className="block text-gray-700 text-sm font-bold">
//                         動画タイトル
//                         <NeedBox />
//                         <DisableBox />
//                       </span>
//                     </div>
//                     <input
//                       className={`${ToClickTW.input}`}
//                       value={MovieTitleInput}
//                       disabled
//                       // {...register("MovieTitle", ValidateCreate.MovieTitle)}
//                       // placeholder={foundMovie?.MovieTitle || "動画タイトル"}
//                       // onChange={(e) => setMovieTitleInput(e.target.value)}
//                     />
//                     <span className="text-black">
//                       {errors.MovieTitle?.message}
//                     </span>
//                   </div>
//                 </div>
//               )}

//               {crudContentType === "karaoke" && (
//                 <div className="pt-3">
//                   <div className="flex">
//                     <span className={`${FormTW.label}`}>
//                       曲
//                       <NeedBox />
//                     </span>
//                   </div>
//                   <input
//                     className={`${ToClickTW.input}`}
//                     {...register("SongName", ValidateCreate.SongName)}
//                     placeholder={foundKaraoke?.SongName || "曲"}
//                     onChange={(e) => setSongNameInput(e.target.value)}
//                   />
//                   <span className="text-black">{errors.SongName?.message}</span>
//                   <div className="flex mt-3">
//                     <span className={`${FormTW.label}`}>
//                       開始時間
//                       <NeedBox />
//                     </span>
//                   </div>
//                   <input
//                     className={`${ToClickTW.input}`}
//                     type="time"
//                     step="1"
//                     {...register("SingStart", ValidateCreate.SingStart)}
//                     placeholder={foundKaraoke?.SingStart || "例 00:05:30"}
//                     onChange={(e) => setSingStartInput(e.target.value)}
//                   />
//                   <span className="text-black">
//                     {errors.SingStart?.message}
//                   </span>
//                 </div>
//               )}
//             </div>
//           </div>

//           <hr className={`${FormTW.horizon}`} />

//           <div className="flex relative justify-center">
//             {isDisplay && (
//               <div
//                 className="absolute z-40 top-[-150px] h-52 w-[86%] md:w-96  bg-[#B7A692]
//                                 p-2 pt-5 rounded-2xl shadow-lg shadow-black"
//               >
//                 <div className="flex flex-col item-center md:text-2xl font-bold">
//                   <span className="mx-auto">登録完了しました。</span>
//                   <span className="flex mx-auto">
//                     ページ内のリストを更新しますか？
//                   </span>
//                 </div>
//                 <div className="flex flex-col md:flex-row md:text-xl mt-2 md:mt-6">
//                   <button
//                     type="button"
//                     onClick={() => router.reload()}
//                     className={`${ToClickTW.boldChoice} p-2 mx-auto`}
//                   >
//                     更新する
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => setIsDisPlay(false)}
//                     className={`${ToClickTW.boldChoice} p-2 mx-auto mt-4 md:my-0 font-bold`}
//                   >
//                     入力を維持するために <br />
//                     更新しない
//                   </button>
//                 </div>
//               </div>
//             )}
//             <button
//               type="submit"
//               className={`${ToClickTW.decide} m-4 w-[100px] `}
//             >
//               登録確定
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
