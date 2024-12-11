// 今後こっち(tasnstack)に移行していく
import React, { useState, useEffect } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";

import { ReceivedKaraoke } from "@/types/vtuber_content";
import { TableCss } from "@/styles/tailwiind";
import {
  KaraokeGlobalFilterColumns,
  KaraokeTableAFilterInput,
  KaraokeTableFilterInput,
  KaraokeTablePagenationButtons,
  SeletctPostContext,
  YouTubePlayerContext,
} from "../Commons";
import { KaraokeTableReturnPostProps } from "../types";
import Image from "next/image";

export default function KaraokeGlobalFilterTable({
  posts: karaokes,
  handleMovieClickYouTube,
  setSelectedPost,
}: KaraokeTableReturnPostProps) {
  const maxPageSize = 99999;
  const [data, setData] = useState<ReceivedKaraoke[]>(karaokes);

  const [sorting, setSorting] = React.useState<SortingState>([]);

  useEffect(() => {
    const fetchData = async () => {
      setData(await karaokes);
    };
    fetchData();
  }, [karaokes]);

  const table = useReactTable({
    columns: KaraokeGlobalFilterColumns,
    data,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 25,
      },
    },
    state: { sorting },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    isMultiSortEvent: () => false,
  });
  return (
    <SeletctPostContext.Provider value={{ setSelectedPost }}>
      <YouTubePlayerContext.Provider value={{ handleMovieClickYouTube }}>
        <div id="tab" className="bg-red">
          <KaraokeTableFilterInput table={table} />
          <KaraokeTablePagenationButtons
            table={table}
            maxPageSize={maxPageSize}
          />
          <main className="w-full overflow-scroll md:overflow-hidden">
            <table className={`${TableCss.regular}`}>
              <thead className={`${TableCss.regularThead}`}>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        colSpan={header.colSpan}
                        className="mx-2"
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            className={`flex items-center cursor-pointer select-none ${
                              header.column.getCanSort() ? "" : "opacity-50"
                            }`}
                            onClick={header.column.getToggleSortingHandler()}
                            title={
                              header.column.getCanSort()
                                ? header.column.getNextSortingOrder() === "asc"
                                  ? "Sort ascending"
                                  : header.column.getNextSortingOrder() ===
                                    "desc"
                                  ? "Sort descending"
                                  : "Clear sort"
                                : undefined
                            }
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            <span className="className='inline-block w-6 h-5'">
                              {header.column.getIsSorted() === false && (
                                <Image
                                  src="/content/sort.svg"
                                  className="h-5"
                                  width={24}
                                  height={20}
                                  alt=""
                                />
                              )}
                              {header.column.getIsSorted() === "asc" && (
                                <span>🔼</span>
                              )}
                              {header.column.getIsSorted() === "desc" && (
                                <span>🔽</span>
                              )}
                            </span>
                          </div>
                        )}
                        <KaraokeTableAFilterInput
                          table={table}
                          accesKey={header.id}
                        />
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => {
                  return (
                    <tr key={row.id} className={`${TableCss.regularTr}`}>
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <td key={cell.id} className="px-2 border-gray-400">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div id="tab" className=" "></div>
          </main>
        </div>
      </YouTubePlayerContext.Provider>
    </SeletctPostContext.Provider>
  );
}
