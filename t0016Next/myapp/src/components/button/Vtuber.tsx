import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

import { domain } from "@/../env";
import { BasicDataProps, CrudDate } from "@/types/vtuber_content";

type selectedDate = {
  posts: BasicDataProps;
  selectedVtuber: number;
  selectedMovie: string;
  selectedKaraoke: number;
};

export default function DeleteButton({
  posts,
  selectedVtuber,
  selectedMovie,
  selectedKaraoke,
}: selectedDate) {
  const vtubers = posts?.vtubers;
  const movies = posts?.vtubers_movies;
  const karaokes = posts?.vtubers_movies_karaokes;
  const router = useRouter();
  let defaultValues: CrudDate = {
    VtuberId: selectedVtuber, //入力不可とする
    VtuberName: "",
    VtuberKana: "",
    IntroMovieUrl: "",
    MovieUrl: "",
    MovieTitle: "",
    KaraokeId: selectedKaraoke, //入力不可とする
    SingStart: "",
    SongName: "",
  };

  const foundVtuber = vtubers.find(
    (vtuber) => vtuber.VtuberId === selectedVtuber
  );
  const foundMovie = movies.find((movie) => movie.MovieUrl === selectedMovie);
  const foundMovies = karaokes.filter(
    (karaoke) => karaoke.MovieUrl === selectedMovie
  );
  const foundKaraoke = karaokes.find(
    (karaoke) => karaoke.KaraokeId === selectedKaraoke
  );

  const [crudContentType, setCrudContentType] = useState<string>("");

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
          VtuberId: selectedVtuber, //deleteで必須
          VtuberName: foundVtuber.VtuberName, //deleteで必須
        };
        const response = await axiosClient.delete("/delete/vtuber", {
          data: reqBody,
        });
        if (!response.status) {
          throw new Error(response.statusText);
        }
      } catch (err) {
        console.error(err);
      }
    } else if (crudContentType === "movie" && foundMovie?.MovieUrl) {
      try {
        const reqBody: DeleteMovie = {
          VtuberId: selectedVtuber, //deleteで必須
          MovieUrl: foundMovie.MovieUrl, //deleteで必須
        };
        const response = await axiosClient.delete("/delete/movie", {
          data: reqBody,
        });
        if (!response.status) {
          throw new Error(response.statusText);
        }
      } catch (err) {
        console.error(err);
      }
    } else if (crudContentType === "karaoke" && foundKaraoke?.SongName) {
      try {
        const reqBody: DeleteKaraoke = {
          MovieUrl: selectedMovie, //deleteで必須
          KaraokeId: selectedKaraoke, //deleteで必須
          SongName: foundKaraoke.SongName, //deleteで必須
        };
        const response = await axiosClient.delete("/delete/karaoke", {
          data: reqBody,
        });
        if (!response.status) {
          throw new Error(response.statusText);
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      console.log(
        "削除するデータの種類(vtuber, movie, karaoke)の選択、またはで想定外のエラーが発生しました。"
      );
    }
  };

  return (
    <div>
      削除するコンテンツを選択
      <br />
      <button type="button" onClick={() => setCrudContentType("vtuber")}>
        ＜VTuber＞
      </button>
      <button type="button" onClick={() => setCrudContentType("movie")}>
        ＜歌枠動画＞
      </button>
      <button type="button" onClick={() => setCrudContentType("karaoke")}>
        ＜歌＞
      </button>
      <br />
      <br />
      {crudContentType === "vtuber" && (
        <div>
          VTuber：{foundVtuber?.VtuberName}
          <br />
          &nbsp;&nbsp; の登録を削除しまか？
        </div>
      )}
      {crudContentType === "movie" && (
        <div>
          VTuber：{foundVtuber?.VtuberName && foundVtuber?.VtuberName}
          <br />
          の<br />
          歌枠動画：{foundMovie?.MovieTitle}
          を削除しますか？
        </div>
      )}
      {crudContentType === "karaoke" && (
        <div>
          VTuber：{foundVtuber?.VtuberName && foundVtuber?.VtuberName}
          <br />
          歌枠動画：{foundMovie?.MovieTitle}
          <br />
          の<br />
          曲名：{foundKaraoke?.SongName}
          <br />
          (再生時間：{foundKaraoke?.SingStart})<br />
          &nbsp;&nbsp; の登録を削除します？
        </div>
      )}
      <br />
      {crudContentType && (
        <div>
          <button onClick={handleClick}>決定</button>
        </div>
      )}
    </div>
  );
}
