import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

import { domain } from "@/../env";
import type { CrudDate, BasicDataProps } from "@/types/vtuber_content";
import { DropDownVtuber } from "@/components/dropDown/Vtuber";
import { DropDownMovie } from "@/components/dropDown/Movie";
import { ValidateEdit } from "@/util";
import { FormTW, ToClickTW } from "@/styles/tailwiind";
import { DropDownKaraoke } from "../dropDown/Karaoke";
import { CrudContentSelector } from "@/components/form/Common";
import router from "next/router";

export type EditPageProps = {
  posts: BasicDataProps;
  isSignin: boolean;
};

type EditDataProps = {
  posts: BasicDataProps;
  selectedVtuber: number;
  selectedMovie: string;
  selectedKaraoke: number;
  setSelectedVtuber: (arg0: number) => void;
  setSelectedMovie: (arg0: string) => void;
  setSelectedKaraoke: (arg0: number) => void;
  clearMovieHandler: () => void;
};
type EditVtuber = {
  VtuberId: number;
  VtuberName: string | undefined;
  VtuberKana: string | undefined;
  IntroMovieUrl: string | null | undefined;
};
type EditMovie = {
  VtuberId: number;
  MovieTitle: string | undefined;
  MovieUrl: string;
};
type EditKaraoke = {
  MovieUrl: string;
  KaraokeId: number;
  SongName: string | undefined;
  SingStart: string | undefined;
};

export function EditForm({
  posts,
  selectedVtuber,
  selectedMovie,
  selectedKaraoke,
  setSelectedVtuber,
  setSelectedMovie,
  setSelectedKaraoke,
  clearMovieHandler,
}: EditDataProps) {
  const vtubers = posts?.vtubers;
  const movies = posts?.vtubers_movies;
  const karaokes = posts?.vtubers_movies_karaokes;

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
  const [MovieTitleInput, setMovieTitleInput] = useState(
    foundMovie?.MovieTitle ?? ""
  );
  const [SingStartInput, setSingStartInput] = useState(
    foundKaraoke?.SingStart ?? ""
  );
  const [SongNameInput, setSongNameInput] = useState(
    foundKaraoke?.SongName ?? ""
  );

  const [crudContentType, setCrudContentType] = useState<string>("karaoke");

  const axiosClient = axios.create({
    baseURL: `${domain.backendHost}/vcontents`,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CrudDate>({ reValidateMode: "onChange" });

  const resultDisplay = () => {
    let result = window.confirm("編集完了しました。\nページを更新しますか？");
    if (result) {
      router.reload();
    }
  };

  const onSubmit = async (CrudData: CrudDate) => {
    if (crudContentType === "vtuber") {
      try {
        const reqBody: EditVtuber = {
          VtuberId: selectedVtuber, //既存値
          VtuberName: CrudData.VtuberName || foundVtuber?.VtuberName,
          VtuberKana: CrudData.VtuberKana || foundVtuber?.VtuberKana,
          IntroMovieUrl: CrudData.IntroMovieUrl || foundVtuber?.IntroMovieUrl,
        };
        const response = await axiosClient.post("/edit/vtuber", reqBody);
        if (response.status) {
          resultDisplay();
        } else {
          throw new Error(response.statusText);
        }
      } catch (err) {
        alert(
          "編集失敗\nご自身で登録したデータのみ編集できます。マイページで確認してください。\n解決しない場合は開発者へお知らせいただけると幸いです。"
        );
        console.error(err);
      }
    } else if (crudContentType === "movie") {
      try {
        const reqBody: EditMovie = {
          VtuberId: selectedVtuber, //既存値
          MovieUrl: selectedMovie, //既存値
          MovieTitle: CrudData.MovieTitle || foundMovie?.MovieTitle,
        };
        const response = await axiosClient.post("/edit/movie", reqBody);
        if (response.status) {
          resultDisplay();
        } else {
          throw new Error(response.statusText);
        }
      } catch (err) {
        alert(
          "編集失敗 \n ご自身で登録したデータのみ編集できます。マイページで確認してください。\n解決しない場合は開発者へお知らせいただけると幸いです。"
        );
        console.error(err);
      }
    } else if (crudContentType === "karaoke") {
      try {
        const reqBody: EditKaraoke = {
          MovieUrl: selectedMovie, //既存値
          KaraokeId: selectedKaraoke, //既存値
          SongName: CrudData.SongName || foundKaraoke?.SongName,
          SingStart: CrudData.SingStart || foundKaraoke?.SingStart,
        };
        const response = await axiosClient.post("/edit/karaoke", reqBody);
        if (response.status) {
          resultDisplay();
        } else {
          throw new Error(response.statusText);
        }
      } catch (err) {
        alert(
          "編集失敗\nご自身で登録したデータなのかマイページで確認してください。\n解決しない場合は開発者へお知らせいただけると幸いです。"
        );
        console.error(err);
      }
    } else {
      console.log(
        "編集するデータの種類(vtuber, movie, karaoke)の選択で想定外のエラーが発生しました。"
      );
    }
  };

  return (
    <div
      className="flex flex-col justify-center w-full bg-[#FFF6E4]
         shadow-md rounded px-1 md:px-4 pt-4 mb-4"
    >
      <div id="selectContent" className="w-full mx-1 md:mx-3 ">
        <div className="flex flex-col justify-center w-full text-black font-bold">
          <CrudContentSelector
            contentType={crudContentType}
            setContentType={setCrudContentType}
          />
        </div>
      </div>

      <hr className={`${FormTW.horizon}`} />

      <div id="selectData" className="flex flex-col">
        <div className="mx-auto text-black">
          編集するデータを選択してください
        </div>
        <div className="pb-3">
          <div className="h-7">
            {selectedVtuber == 0 && (
              <span className="text-[#ff3f3f]">
                <u> Vtuber </u>を選択してください
              </span>
            )}
          </div>
          <div className="bottom-0">
            <DropDownVtuber
              posts={posts}
              onVtuberSelect={setSelectedVtuber}
              defaultMenuIsOpen={false}
            />
          </div>
        </div>
        {(crudContentType === "movie" || crudContentType === "karaoke") && (
          <div className="pb-3 ">
            <div className="h-7 ">
              {selectedMovie == "" && (
                <span className="text-[#ff3f3f] ">
                  <u> 動画 </u>を選択してください
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
        {crudContentType === "karaoke" && (
          <div className="pb-3">
            <div className="h-7">
              {selectedKaraoke == 0 && (
                <span className="text-[#ff3f3f] ">
                  <u> 歌(karaoke) </u>を選択してください
                </span>
              )}
            </div>
            <DropDownKaraoke
              posts={posts}
              selectedMovie={selectedMovie}
              onKaraokeSelect={setSelectedKaraoke}
            />
          </div>
        )}
      </div>

      <hr className={`${FormTW.horizon}`} />

      <div id="form" className="flex flex-col">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col  items-center  underline text-lg text-black">
            <span className="">編集するデータを入力してください</span>
            <span className="">※空欄ｓにた項目は編集されません</span>
          </div>
          {crudContentType === "vtuber" && (
            <div>
              <div className="mb-3">
                <div className="">
                  <span className={`${FormTW.label}`}>VTuber:</span>
                </div>
                <input
                  className={`${ToClickTW.input}`}
                  {...register("VtuberName", ValidateEdit.VtuberName)}
                  placeholder={foundVtuber?.VtuberName || "例:妹望おいも"}
                  onChange={(e) => setVtuberNameInput(e.target.value)}
                />
                <span className="text-black">{errors.VtuberName?.message}</span>
              </div>

              <div className="mb-3">
                <span className={`${FormTW.label}`}>読み(kana):</span>
                <input
                  className={`${ToClickTW.input}`}
                  {...register("VtuberKana", ValidateEdit.VtuberKana)}
                  placeholder={foundVtuber?.VtuberKana || "例:imomochi_oimo"}
                  onChange={(e) => setVtuberKanaInput(e.target.value)}
                />
                <span className="text-black">{errors.VtuberKana?.message}</span>
              </div>
              <div>
                <span className={`${FormTW.label}`}>紹介動画URL(*):</span>
                <input
                  className={`${ToClickTW.input}`}
                  {...register("IntroMovieUrl", ValidateEdit.IntroMovieUrl)}
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
            <div className="pt-4">
              <div className="mb-3">
                <div className="">
                  <span className="block text-gray-700 text-sm font-bold">
                    動画タイトル:
                  </span>
                </div>
                <input
                  className={`${ToClickTW.input}`}
                  {...register("MovieTitle", ValidateEdit.MovieTitle)}
                  placeholder={foundMovie?.MovieTitle || "動画タイトル"}
                  onChange={(e) => setMovieTitleInput(e.target.value)}
                />
                <span className="text-black">{errors.MovieTitle?.message}</span>
              </div>
              <div className="flex">
                <span className={`${FormTW.label}`}>
                  歌枠の URL は編集できません
                </span>
              </div>
            </div>
          )}

          {crudContentType === "karaoke" && (
            <div className="pt-3">
              <div className="flex">
                <span className={`${FormTW.label}`}>曲:</span>
              </div>
              <input
                className={`${ToClickTW.input}`}
                {...register("SongName", ValidateEdit.SongName)}
                placeholder={foundKaraoke?.SongName || "曲"}
                onChange={(e) => setSongNameInput(e.target.value)}
              />
              <span className="text-black">{errors.SongName?.message}</span>
              <div className="flex mt-3">
                <span className={`${FormTW.label} `}>開始時間:</span>
              </div>
              <input
                className={`${ToClickTW.input}`}
                type="time"
                step="1"
                {...register("SingStart", ValidateEdit.SingStart)}
                placeholder={foundKaraoke?.SingStart || "例 00:05:30"}
                onChange={(e) => setSingStartInput(e.target.value)}
              />
              <span className="text-black">{errors.SingStart?.message}</span>
            </div>
          )}

          <hr className={`${FormTW.horizon}`} />

          <div className="flex justify-center">
            <button
              type="submit"
              className={`${ToClickTW.decide} m-4 w-[100px] `}
            >
              編集確定
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
