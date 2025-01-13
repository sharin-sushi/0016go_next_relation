import React, { useState } from "react";
import { FieldError, useForm } from "react-hook-form";
import axios from "axios";

import { domain } from "@/../env";
import type {
  CrudDate,
  BasicDataProps,
  CrudContentType,
  ReceivedVtuber,
  ReceivedMovie,
  ReceivedKaraoke,
} from "@/types/vtuber_content";
import { DropDownVtuber } from "@/components/dropDown/Vtuber";
import { DropDownMovie } from "@/components/dropDown/Movie";
import { DropDownKaraoke } from "@/components/dropDown/Karaoke";
import { extractVideoId, ValidateCreate } from "@/util";
import { FormTW, ToClickTW } from "@/styles/tailwiind";
import { DisableBox, NeedBox } from "@/components/box/Box";
import { getYoutubeVideo, CrudContentSelector } from "@/components/form/Common";
import router from "next/router";

export type CreatePageProps = {
  posts: BasicDataProps;
  isSignin: boolean;
};

type CreateDataProps = {
  posts: BasicDataProps;
  selectedVtuberId: number;
  selectedMovieUrl: string;
  selectedKaraokeId: number;
  setSelectedVtuberId: (vtuberId: number) => void;
  setSelectedMovieUrl: (url: string) => void;
  setSelectedKaraokeId: (KaraokeId: number) => void;
  clearMovieHandler: () => void;
  setCurrentVideoId: (videoId: string) => void;
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
  selectedVtuberId,
  selectedMovieUrl,
  selectedKaraokeId,
  setSelectedVtuberId,
  setSelectedMovieUrl,
  setSelectedKaraokeId,
  clearMovieHandler,
  setCurrentVideoId,
}: CreateDataProps) {
  const [crudContentType, setCrudContentType] =
    useState<CrudContentType>("movie");
  const [vtubers, setVtubers] = useState(posts.vtubers);
  const [movies, setMovies] = useState(posts.vtubers_movies);
  const [karaokes, setKaraokes] = useState(posts.vtubers_movies_karaokes);

  const foundVtuber = vtubers?.find(
    (vtuber) => vtuber.VtuberId === selectedVtuberId
  );
  const foundMovie = movies?.find(
    (movie) => movie.MovieUrl === selectedMovieUrl
  );
  const foundKaraoke = karaokes?.find(
    (karaoke) => karaoke.KaraokeId === selectedKaraokeId
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

  const [gotMovieErrorMessage, setGotMovieErrorMessage] = useState<string>("");

  const getTitle = async (e: React.MouseEvent<Element, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();

    if (MovieUrlInput != null && MovieUrlInput != "") {
      const movieId = MovieUrlInput.split("watch?v=")[1];
      try {
        const res = await getYoutubeVideo({ movieId, isSnippet: true });
        if (res) {
          console.log(`res %o`, res.items[0].snippet);
          setMovieTitleInput(res.items[0].snippet.title);
        }
      } catch (err) {
        setMovieTitleInput("");
        setGotMovieErrorMessage(
          "動画タイトルの取得に失敗しました。一時的な不具合の可能性があります。お手数ですが手入力も検討してください。"
        );
        console.error(err);
      }
    } else {
      // TODO: modalを出す
      setMovieTitleInput("");
      setGotMovieErrorMessage("動画URLまたはIDを入力してください");
    }
  };

  const onSubmit = async (CrudData: CrudDate) => {
    console.log(crudContentType);
    switch (crudContentType) {
      case "vtuber":
        console.log("vtuber");
        try {
          const reqBody: CreateVtuber = {
            VtuberName: CrudData.VtuberName,
            VtuberKana: CrudData.VtuberKana,
            IntroMovieUrl: CrudData.IntroMovieUrl,
          };
          await axiosClient.post("/create/vtuber", reqBody);
          openSuccessModal();
        } catch (err) {
          alert("登録失敗: VTuber");
          console.error(err);
        }
        return;

      case "movie":
        console.log("movie");
        try {
          const reqBody: CreateMovie = {
            VtuberId: selectedVtuberId, //既存値
            MovieTitle: CrudData.MovieTitle,
            MovieUrl: CrudData.MovieUrl,
          };
          await axiosClient.post("/create/movie", reqBody);
          openSuccessModal();
        } catch (err) {
          alert("登録失敗: 動画");
          console.error(err);
        }
        return;
      case "karaoke":
        console.log("karaoke");
        try {
          const reqBody: CreateKaraoke = {
            MovieUrl: selectedMovieUrl, //既存値
            SongName: CrudData.SongName,
            SingStart: CrudData.SingStart,
          };
          await axiosClient.post("/create/karaoke", reqBody);
          openSuccessModal();
        } catch (err) {
          alert("登録失敗: 歌(karaoke)");
          console.error(err);
        }
        return;

      default:
        console.log(
          "データの種類(vtuber, movie, karaoke)の選択で想定外のエラーが発生しました。"
        );
    }
  };

  return (
    <div className="flex flex-col justify-center w-full bg-[#FFF6E4] shadow-md rounded px-1 md:px-4 pt-4 mb-4">
      <div id="selectContent" className="w-full mx-1 md:mx-3">
        <div className="flex flex-col justify-center w-full text-black font-bold">
          <CrudContentSelector
            contentType={crudContentType}
            setContentType={setCrudContentType}
          />
        </div>
      </div>
      <hr className={`${FormTW.horizon}`} />

      <div id="form" className="flex flex-col">
        <div>
          <div className="flex flex-col">
            {crudContentType === "vtuber" && (
              <div className="flex flex-col">
                <h2 className="text-black mx-auto">
                  登録するデータを入力してください
                </h2>
                <div className="mb-3">
                  <div className="">
                    <FormLabel label="VTuber" need />
                  </div>
                  <input
                    className={`${ToClickTW.input}`}
                    {...register("VtuberName", ValidateCreate.VtuberName)}
                    placeholder={foundVtuber?.VtuberName || "例:妹望おいも"}
                    onChange={(e) => setVtuberNameInput(e.target.value)}
                  />
                  <ErrorMessage errorField={errors.VtuberName} />
                </div>

                <div className="mb-3">
                  <FormLabel label="読み(kana)" need />
                  <input
                    className={`${ToClickTW.input}`}
                    {...register("VtuberKana", ValidateCreate.VtuberKana)}
                    placeholder={foundVtuber?.VtuberKana || "例:imomochi_oimo"}
                    onChange={(e) => setVtuberKanaInput(e.target.value)}
                  />
                  <ErrorMessage errorField={errors.VtuberKana} />
                </div>

                <div>
                  <FormLabel label="紹介動画URL *1:" />
                  <input
                    className={`${ToClickTW.input}`}
                    {...register("IntroMovieUrl", ValidateCreate.IntroMovieUrl)}
                    placeholder={
                      foundVtuber?.IntroMovieUrl ||
                      "例:www.youtube.com/watch?v=AlHRqSsF--8&t=75"
                    }
                    onChange={(e) => setIntroMovieUrInput(e.target.value)}
                  />
                  <ErrorMessage errorField={errors.IntroMovieUrl} />
                  <div className="flex flex-col text-black">
                    <span>*1 時間指定方法(&t=秒数)</span>
                    <span className="ml-4">
                      例:www.youtube.com/watch?v=7QStB569mto<u>&t=290</u>
                    </span>
                  </div>
                </div>
              </div>
            )}

            {crudContentType === "movie" && (
              <>
                <div className="flex flex-col w-full">
                  <span className="text-black mx-auto">
                    親データを選択してください
                  </span>

                  <div className="pb-3">
                    <div className={`${FormTW.label}`}>
                      VTuber
                      <NeedBox />
                    </div>
                    <DropDownVtuber
                      posts={posts}
                      onVtuberSelect={setSelectedVtuberId}
                      defaultMenuIsOpen={false}
                      selectedVtuber={findVtuber(vtubers, selectedVtuberId)}
                    />
                    {selectedVtuberId == 0 && (
                      <div className="text-[#ff3f3f] text-sm">
                        チャンネルを選択してください
                      </div>
                    )}
                  </div>

                  <hr className={`${FormTW.horizon}`} />
                </div>

                <div className="flex flex-col">
                  <h2 className="text-black text-center">
                    登録するデータを入力してください
                  </h2>
                  <div className="flex flex-col gap-y-3">
                    <div>
                      <FormLabel label="動画URL" need />
                      <div className="flex gap-x-1 mb-1"></div>
                      <input
                        className={`${ToClickTW.input}`}
                        {...register("MovieUrl", ValidateCreate.MovieUrl)}
                        placeholder={
                          foundMovie?.MovieUrl ||
                          "例: www.youtube.com/watch?v=AlHRqSsF--8"
                        }
                        onChange={(e) => setMovieUrlInput(e.target.value)}
                      />
                      <div className="flex gap-x-1">
                        <button
                          className={`${ToClickTW.buttonNormal} mt-1`}
                          onClick={getTitle}
                        >
                          動画タイトルを取得
                        </button>
                        <button
                          className={`${ToClickTW.buttonNormal} mt-1`}
                          onClick={() =>
                            setCurrentVideoId(extractVideoId(MovieUrlInput))
                          }
                        >
                          再生
                        </button>
                      </div>
                      <span className="text-red-500">
                        {gotMovieErrorMessage}
                      </span>
                      ;
                      <ErrorMessage errorField={errors.MovieUrl} />
                    </div>
                    <div>
                      <FormLabel label="動画タイトル" need />
                      <input
                        className={`${ToClickTW.input}`}
                        value={MovieTitleInput}
                        {...register("MovieTitle", ValidateCreate.MovieTitle)}
                        placeholder={foundMovie?.MovieTitle || "動画タイトル"}
                        onChange={(e) => setMovieTitleInput(e.target.value)}
                      />
                      <ErrorMessage errorField={errors.MovieTitle} />
                    </div>
                  </div>
                </div>
              </>
            )}

            {crudContentType === "karaoke" && (
              <>
                <div className="flex flex-col w-full">
                  <span className="text-black text-center">
                    親データを選択してください
                  </span>
                  <div className="pb-3">
                    <div className={`${FormTW.label}`}>
                      VTuber
                      <NeedBox />
                    </div>
                    <DropDownVtuber
                      posts={posts}
                      onVtuberSelect={setSelectedVtuberId}
                      defaultMenuIsOpen={false}
                      selectedVtuber={findVtuber(vtubers, selectedVtuberId)}
                    />
                    {selectedVtuberId == 0 && (
                      <div className="text-[#ff3f3f] text-sm">
                        <div className="text-[#ff3f3f] ">
                          チャンネルを選択してください
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col w-full ">
                    <div className={`${FormTW.label}`}>
                      動画(歌枠)
                      <NeedBox />
                    </div>
                    <DropDownMovie
                      posts={posts}
                      selectedVtuber={selectedVtuberId}
                      setSelectedMovie={setSelectedMovieUrl}
                      clearMovieHandler={clearMovieHandler}
                    />
                    {selectedMovieUrl == "" && (
                      <div className="text-[#ff3f3f] ">
                        動画を選択してください
                      </div>
                    )}
                  </div>
                </div>

                <hr className={`${FormTW.horizon}`} />

                <div id="decide" className=" ">
                  <div className="flex flex-col justify-center mt-1 my-3">
                    <span className="text-black text-center">
                      登録済みか確認(選択で再生されます)
                      <br />
                      同じ動画で複数曲を登録する際は、「曲(〇回目)」としてください。
                    </span>
                    <DropDownKaraoke
                      posts={posts}
                      selectedMovie={selectedMovieUrl}
                      onKaraokeSelect={setSelectedKaraokeId}
                    />
                  </div>
                </div>

                <hr className={`${FormTW.horizon}`} />

                <div className="flex flex-col">
                  <h2 className="text-black mx-auto">
                    登録するデータを入力してください
                  </h2>
                  <div className="flex flex-col gap-y-3">
                    <div>
                      <FormLabel label="曲" need />
                      <input
                        className={`${ToClickTW.input}`}
                        {...register("SongName", ValidateCreate.SongName)}
                        placeholder={foundKaraoke?.SongName || "曲"}
                        onChange={(e) => setSongNameInput(e.target.value)}
                      />
                      <ErrorMessage errorField={errors.SongName} />
                    </div>
                    <div>
                      <FormLabel label="開始時間" need />
                      <input
                        className={`${ToClickTW.input}`}
                        type="time"
                        step="1"
                        {...register("SingStart", ValidateCreate.SingStart)}
                        onChange={(e) => setSingStartInput(e.target.value)}
                      />
                      <ErrorMessage errorField={errors.SingStart} />
                    </div>
                  </div>
                </div>
              </>
            )}
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

type FormLabelProps = {
  label: string;
  need?: boolean;
  autoForm?: boolean;
};

const FormLabel = ({ label, need, autoForm }: FormLabelProps) => {
  return (
    <div className={`${FormTW.label}`}>
      {label}
      {need && <NeedBox />}
      {autoForm && <DisableBox />}
    </div>
  );
};

type ErrorMessageProps = {
  errorField: FieldError | undefined;
};

const ErrorMessage = ({ errorField }: ErrorMessageProps) => {
  return <span className="text-red-500">{errorField?.message}</span>;
};

const findVtuber = (vtubers: ReceivedVtuber[], vtuberId: number) => {
  return vtubers.find((vtuber) => vtuber.VtuberId === vtuberId);
};

const findMovie = (movies: ReceivedMovie[], movieUrl: string) => {
  return movies.find((movie) => movie.MovieUrl === movieUrl);
};

const findKaraoke = (karaokes: ReceivedKaraoke[], karaokeId: number) => {
  return karaokes.find((karaoke) => karaoke.KaraokeId === karaokeId);
};
