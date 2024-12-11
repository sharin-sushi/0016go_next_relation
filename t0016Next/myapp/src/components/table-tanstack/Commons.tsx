// 今後こっち(tasnstack)に移行していく
// TODO : 雑多に集めすぎたので、フォルダ分け
import React, { useState, useContext } from "react";
import { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

import { domain } from "@/../env";
import { ReceivedKaraoke, FavoriteKaraoke } from "@/types/vtuber_content";
import { LinkTW, TableCss as TableTW } from "@/styles/tailwiind";
import { SigninContext } from "@/components/layout/Layout";
import { ConvertStringToTime } from "@/util";
import { TableCss } from "@/styles/tailwiind";
import type {
  FavoriteColumn,
  KaraokeTablefilterInputProps,
  KaraokeTablePagenationButtonsProps as TablePagenationButtonsProps,
} from "./types";

export const YouTubePlayerContext = React.createContext(
  {} as {
    handleMovieClickYouTube(movieId: string, time: number): void;
  }
);

export const SeletctPostContext = React.createContext(
  {} as {
    setSelectedPost: (arg0: ReceivedKaraoke) => void;
  }
);

export function FavoriteColumn({
  count,
  isFav,
  movie,
  karaoke,
}: FavoriteColumn) {
  const [isFavNow, setIsCheck] = useState(isFav);
  const [isDisplay, setIsDisplay] = useState<boolean>(false);
  const { isSignin } = useContext(SigninContext);
  const handleClick = async () => {
    if (isSignin == false) {
      setIsDisplay(true);
      setTimeout(() => setIsDisplay(false), 1500);
      return;
    }

    setIsCheck(!isFavNow);
    const axiosClient = axios.create({
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    try {
      const reqBody: FavoriteKaraoke = {
        MovieUrl: movie,
        KaraokeId: karaoke,
      };
      if (isFavNow) {
        const response = await axiosClient.delete(
          `${domain.backendHost}/fav/unfavorite/karaoke`,
          { data: reqBody }
        );
        if (!response.status) {
          throw new Error(response.statusText);
        }
      } else {
        const response = await axiosClient.post(
          `${domain.backendHost}/fav/favorite/karaoke`,
          reqBody
        );
        if (!response.status) {
          throw new Error(response.statusText);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="flex justify-center">
      <button
        className={`${TableTW.favoriteColumn} relative flex `}
        onClick={handleClick}
      >
        {isFavNow ? (
          <Image
            src="/content/heart_pink.svg"
            className="flex w-5 m-1 mr-0"
            width={24}
            height={20}
            alt=""
          />
        ) : (
          <Image
            src="/content/heart_white.svg"
            className="flex w-5 m-1 mr-0"
            width={24}
            height={20}
            alt=""
          />
        )}

        {isFavNow == isFav ? count : isFavNow ? count + 1 : count - 1}

        {isDisplay && (
          <div className="absolute bg-[#B7A692] rounded-2xl right-0 top-0 px-2 w-[140px]">
            ログインが必要です
          </div>
        )}
      </button>
    </div>
  );
}

export const ColumnVtuberName: ColumnDef<ReceivedKaraoke>[] = [
  {
    header: "名前",
    accessorKey: "VtuberName",
    enableSorting: true,
    cell: ({ row }: { row: { original: ReceivedKaraoke } }) => {
      return (
        <div className="relative">
          <Link
            href={`/vtuber/${row.original.VtuberKana}`}
            className={`flex ${LinkTW.base}`}
          >
            <Image
              src="/content/external_link.svg"
              className="w-5 mr-1"
              width={24}
              height={20}
              alt=""
            />
            {row.original.VtuberName}
          </Link>
        </div>
      );
    },
  },
];

export const KaraokeBasicColumuns: ColumnDef<ReceivedKaraoke>[] = [
  {
    header: "曲名(Click it)",
    accessorKey: "SongName",
    enableSorting: true,
    cell: ({ row }: { row: { original: ReceivedKaraoke } }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { handleMovieClickYouTube } = useContext(YouTubePlayerContext); //表示ページに再生したいデータを渡す
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { setSelectedPost } = useContext(SeletctPostContext);
      const handleClickPlay = (post: ReceivedKaraoke) => {
        handleMovieClickYouTube(
          row.original.MovieUrl,
          ConvertStringToTime(row.original.SingStart)
        );
        setSelectedPost(post);
      };
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [isDisplay, setIsDisplay] = useState<boolean>(false);
      const handleClick = async () => {
        const url =
          "https://" +
          row.original.MovieUrl +
          "&t=" +
          ConvertStringToTime(row.original.SingStart);
        await navigator.clipboard.writeText(url);
        setIsDisplay(true);
        setSelectedPost(row.original);
        setTimeout(() => setIsDisplay(false), 2000);
      };

      return (
        <div className="relative flex w-auto">
          <button
            className={`flex ${LinkTW.base}`}
            onClick={() => handleClickPlay(row.original)}
          >
            <Image
              src="/content/play_black.svg"
              className="w-5 mr-1 bottom-0"
              width={24}
              height={20}
              alt=""
            />
            {row.original.SongName}
          </button>

          <div className="absolute right-0">
            <button className="flex " onClick={() => handleClick()}>
              <Image
                src="/content/copy_gray.svg"
                className="h-5 mr-2 flex hover:bg-[#B7A692] stroke-2  rounded-md"
                alt={""}
                width={18}
                height={18}
              />
            </button>
            {isDisplay && (
              <div className="absolute bg-[#B7A692] rounded-2xl right-0 top-0 px-2 w-[130px]">
                URL was copied
              </div>
            )}
          </div>
        </div>
      );
    },
  },
  { header: "再生開始", accessorKey: "SingStart", enableSorting: true },
  { header: "動画タイトル", accessorKey: "MovieTitle", enableSorting: true },
  {
    header: "いいね",
    accessorKey: "Count",
    enableSorting: true,
    cell: ({ row }: { row: { original: ReceivedKaraoke } }) => {
      return (
        <FavoriteColumn
          count={row.original.Count}
          isFav={row.original.IsFav}
          movie={row.original.MovieUrl}
          karaoke={row.original.KaraokeId}
        />
      );
    },
  },
];

export const KaraokeGlobalFilterColumns: ColumnDef<ReceivedKaraoke>[] = [
  // TODO:　クリックでfilterしたい
  {
    header: "名前",
    accessorKey: "VtuberName",
    enableSorting: true,
    cell: ({ row }: { row: { original: ReceivedKaraoke } }) => {
      return (
        <div className="relative">
          <Link
            href={`/vtuber/${row.original.VtuberKana}`}
            className={`flex ${LinkTW.base}`}
          >
            {row.original.VtuberName}
          </Link>
        </div>
      );
    },
  },
  ...KaraokeBasicColumuns,
];

// TODO : schemeに配信日カラムを追加し、それでソートできるようにする。↓な感じで表示変換しつつできるらしい。
// {
//     accessorKey: 'livedAt',
//     header: sortableHeader('配信日時(UNIX)'),
//     cell: ({ row }) => {
//         const user = row.original;
//         return format(new Date(user.livedAt), 'yyyy/MM/dd HH:mm', {
//             locale: ja,
//         });
//     },
// },

export const KaraokeTableAFilterInput = ({
  table,
  accesKey,
}: KaraokeTablefilterInputProps) => {
  if (accesKey === "Count") {
    return (
      <div className="mr-1">
        {/* TODO : form要素を使うと、padding merginがなんか崩れる。崩れないならreset要素実装したい。 */}
        <input
          className="bg-gray-200 text-gray-800 w-12 mb-0.5"
          placeholder={`num...`}
          onChange={(e) =>
            table.getColumn(`${accesKey}`)?.setFilterValue(e.target.value)
          }
        />
      </div>
    );
  }

  return (
    <div className="mr-1">
      {/* TODO : form要素を使うと、padding merginがなんか崩れる。崩れないならreset要素実装したい。 */}
      <input
        className="bg-gray-200 text-gray-800 w-full mb-0.5"
        placeholder={`filter...`}
        onChange={(e) =>
          table.getColumn(`${accesKey}`)?.setFilterValue(e.target.value)
        }
      />
    </div>
  );
};

export const KaraokeTableFilterInput = ({
  table,
}: KaraokeTablefilterInputProps) => {
  return (
    <div className="bg-[#B7A692] mt-0.5 py-1 px-2 rounded-xl max-w-[400px]">
      <input
        className="bg-gray-200 text-gray-800 w-full rounded-sm "
        placeholder="filter from all Columns..."
        onChange={(e) => {
          table.setGlobalFilter(e.target.value);
        }}
      />
    </div>
  );
};

//  TODO : Vtuber, Movie, Karaikeのテーブル全部で使いまわせるように出来ると思う
export const KaraokeTablePagenationButtons = ({
  table,
  maxPageSize,
}: TablePagenationButtonsProps) => {
  return (
    <div className="flex bg-[#B7A692] mt-1 py-1 px-2 md:px-3 rounded-t-xl md:rounded-t-2xl max-w-[400px] ">
      <button
        className={`${TableCss.pageNationDouble} md:mx-1`}
        onClick={() => table.setPageIndex(0)}
        disabled={!table.getCanPreviousPage()}
      >
        {"<<"}
      </button>
      <button
        className={`${TableCss.pageNationSingle} sm:mx-0.5 md:mx-1`}
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        {"<"}
      </button>
      <strong className="sm:mx-0.5 ">
        {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
      </strong>
      <button
        className={`${TableCss.pageNationSingle} sm:mx-1`}
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        {">"}
      </button>
      <button
        className={`${TableCss.pageNationDouble} md:mx-1`}
        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
        disabled={!table.getCanNextPage()}
      >
        {">>"}
      </button>

      <select
        className="text-right"
        value={table.getState().pagination.pageSize}
        onChange={(e) => {
          table.setPageSize(Number(e.target.value));
        }}
      >
        {[25, 50, 75, 100, maxPageSize].map((pageSize) => (
          <option key={pageSize} value={pageSize}>
            Show {pageSize}
          </option>
        ))}
      </select>
    </div>
  );
};
