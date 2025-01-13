import React, { useState, useEffect, useMemo } from "react";
import Select from "react-select";
import type { BasicDataProps, ReceivedKaraoke } from "@/types/vtuber_content";
import { DropStyle } from "./common";

type Options = {
  value: number;
  label: string;
};

type DropDownKaraokeProps = {
  posts: BasicDataProps;
  selectedMovie: string;
  onKaraokeSelect: (karoakeId: number) => void;
};

// karaoke_list用
export const DropDownKaraoke = ({
  posts,
  selectedMovie,
  onKaraokeSelect,
}: DropDownKaraokeProps) => {
  const karaokes = useMemo(
    () => posts?.vtubers_movies_karaokes || [{} as ReceivedKaraoke],
    [posts]
  );
  const [karaokeOptions, setKaraokeOptions] = useState<Options[]>([]);
  const [selectedKaraoke, setSelectedKaraoke] = useState<number>(0);
  useEffect(() => {
    if (!selectedMovie) {
      setKaraokeOptions([]);
      return;
    }

    const fetchKaraokes = async () => {
      try {
        const choiceKaraoke = karaokes.filter(
          (karaokes: ReceivedKaraoke) => karaokes.MovieUrl === selectedMovie
        );
        console.log("choiceKa:", choiceKaraoke);
        let havingkaraoke = choiceKaraoke.map((karaoke: ReceivedKaraoke) => ({
          value: karaoke.KaraokeId,
          label: karaoke.SongName || "",
        }));
        if (havingkaraoke) {
          setKaraokeOptions(havingkaraoke);
        }
      } catch (error) {
        console.error("Error fetching Karaokes:", error);
      }
      setSelectedKaraoke(0);
    };
    fetchKaraokes();
  }, [selectedMovie, karaokes]);
  return (
    <div>
      <Select
        id="selectbox"
        instanceId="selectbox"
        placeholder="歌を検索/選択"
        className="basic-single"
        classNamePrefix="select"
        isClearable={true}
        isSearchable={true}
        options={karaokeOptions}
        // isMulti={true}  backspaceRemovesValue={false}
        blurInputOnSelect={true}
        styles={DropStyle}
        onChange={(option) => {
          if (option) {
            onKaraokeSelect(option.value);
          }
        }}
      />
    </div>
  );
};

type DropDownKaraokePartialMatchSearchProps = {
  preKaraokes: ReceivedKaraoke[];
  setSelectedKaraokes: (value: ReceivedKaraoke[]) => void;
};

export const PartialMatchSearch = ({
  preKaraokes,
  setSelectedKaraokes,
}: DropDownKaraokePartialMatchSearchProps) => {
  const [karaokeOptions, setKaraokeOptions] = useState<Options[]>([]);
  const [selectedKaraoke, setSelectedKaraoke] = useState<ReceivedKaraoke[]>([]);
  const text = "";
  // text == ""ならpreKaraokeをそのまま返したいというかそもそもここで処理したらバケツリレー大変だしな…

  useEffect(() => {
    const fetchKaraokes = async () => {
      try {
        // const searchedKaraokes = preKaraokes.filter((ka) => ka.SongName == text)
        // setSelectedKaraokes(searchedKaraokes)
      } catch {}
    };
    fetchKaraokes();
  }, [text]);
  return (
    <div>
      <Select
        id="selectbox"
        instanceId="selectbox"
        placeholder="歌を検索/選択"
        className="basic-single"
        classNamePrefix="select"
        isClearable={true}
        isSearchable={true}
        options={karaokeOptions}
        // isMulti={true}  backspaceRemovesValue={false}
        blurInputOnSelect={true}
        styles={DropStyle}
        onChange={(option) => {
          if (option) {
            // onKaraokeSelect(option.value);
          }
        }}
      />
    </div>
  );
};

const memo = {
  // コメントをファイルのtopレベルに置いておくとESLintの自動整形機能が死ぬ
  //// 公式
  // https://react-select.com/home
  // <select  value={hoge}
  //これがあると、その値が変化したときのみUIが変化する
  // ない場合は「制御されないコンポーネント」となり、どんな変更でもUIが変化する
};
