import React, { useState, useEffect, useMemo } from "react";
import Select from "react-select";
import type { BasicDataProps, ReceivedMovie } from "@/types/vtuber_content";
import { DropStyle } from "./common";

// DropDinwMo, Kaについは、on~~Seletがnillとか0なら処理を止めべき
type MovieOptions = {
  value: string;
  label: string;
};

type DropDownMovieProps = {
  posts: BasicDataProps;
  selectedVtuber: number;
  setSelectedMovie: (value: string) => void;
  clearMovieHandler: () => void;
};

export const DropDownMovie = ({
  posts,
  selectedVtuber,
  setSelectedMovie,
  clearMovieHandler,
}: DropDownMovieProps) => {
  const movies = useMemo(
    () => posts?.vtubers_movies || [{} as ReceivedMovie],
    [posts]
  );

  const handleMovieClear = () => {
    setSelectedMovie("");
    clearMovieHandler();
  };
  const [movieOptions, setMovieOptions] = useState<MovieOptions[]>([]);

  useEffect(() => {
    if (!selectedVtuber) {
      setMovieOptions([]);
      setSelectedMovie("");
      // ここで表示も消したい。消し方不明
      return;
    } else {
      const filterMoviesBySelectedVtuber = async () => {
        try {
          const movieDatum = movies.filter(
            (movies: ReceivedMovie) => movies.VtuberId === selectedVtuber
          );
          const movieOptions = movieDatum.map((movie: ReceivedMovie) => ({
            value: movie.MovieUrl,
            label: movie.MovieTitle,
          }));
          setMovieOptions(movieOptions);
        } catch (error) {
          console.error(
            "Error: failed to filter Movies By Selected Vtuber in /dropDown/:",
            error
          );
        }
      };
      filterMoviesBySelectedVtuber();
    }
  }, [selectedVtuber, setSelectedMovie, movies]);

  return (
    <Select
      id="selectbox"
      instanceId="selectbox"
      placeholder="動画タイトルを検索/選択"
      className="basic-single"
      classNamePrefix="select"
      // value={""} //何を入れても選択したものが表示されないだけ
      isClearable={true}
      isSearchable={true}
      name="movie"
      blurInputOnSelect={true}
      captureMenuScroll={true}
      styles={DropStyle}
      options={movieOptions}
      onChange={(option) => {
        if (option) {
          setSelectedMovie(option.value);
        } else {
          handleMovieClear();
        }
      }}
    />
  );
};

type DropDownAllMovieProps = {
  preMovies: ReceivedMovie[];
  setSelectedMovie: (value: string) => void;
  // ✩１
  // clearMovieHandler: () => void;
};

export const DropDownAllMovie = ({
  preMovies,
  setSelectedMovie,
}: DropDownAllMovieProps) => {
  // ✩１
  // const handleMovieClear = () => {
  // setSelectedMovie("");
  // clearMovieHandler();
  // };

  const movieOptions = preMovies?.map((movie: ReceivedMovie) => ({
    value: movie.MovieUrl,
    label: movie.MovieTitle,
  }));

  return (
    <Select
      id="selectbox"
      instanceId="selectbox"
      placeholder="動画タイトルを検索/選択"
      className="basic-single"
      classNamePrefix="select"
      isClearable={true}
      isSearchable={true}
      name="movie"
      blurInputOnSelect={true}
      captureMenuScroll={true}
      styles={DropStyle}
      options={movieOptions}
      onChange={(option) => {
        if (option) {
          setSelectedMovie(option.value);
        } else {
          setSelectedMovie("");
          // ✩１(↓がある時は↑が不要)
          // handleMovieClear();
        }
      }}
    />
  );
};
