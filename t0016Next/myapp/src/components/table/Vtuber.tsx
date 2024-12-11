import React, { useContext } from "react";
import { useTable, useSortBy, Column, useRowSelect } from "react-table";
import Link from "next/link";
import { ReceivedVtuber } from "@/types/vtuber_content";
import TableStyle from "@/styles/table.module.css";
import { ToDeleteContext } from "@/pages/crud/delete";
import { LinkTW, TableCss } from "@/styles/tailwiind";
import Image from "next/image";

type VtuberTableProps = {
  posts: ReceivedVtuber[];
};

export function VtuberTable({ posts }: VtuberTableProps) {
  const data = posts || [];
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useSortBy, useRowSelect);

  return (
    <div className="w-full overflow-scroll md:overflow-hidden">
      <table
        {...getTableProps()}
        className={`${TableCss.regular} caption-bottom`}
      >
        <thead className={`${TableCss.regularThead}`}>
          {headerGroups.map((headerGroup, i) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={i}>
              {headerGroup.headers.map((column, j) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  key={column.id}
                >
                  {column.render("Header")}
                  <span>
                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        "🔽"
                      ) : (
                        "🔼"
                      )
                    ) : (
                      <Image
                        src="/content/sort.svg"
                        className="inline mx-1 h-5"
                        width={24}
                        height={20}
                        alt=""
                      />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()} className="">
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                className={`${TableCss.regularTr}`}
                key={i}
              >
                {row.cells.map((cell, j) => {
                  return (
                    <td
                      {...cell.getCellProps()}
                      className={TableStyle.td}
                      key={j}
                    >
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const columns: Column<ReceivedVtuber>[] = [
  {
    Header: "VTuber(click it)",
    accessor: "VtuberName",
    Cell: ({ row }: { row: { original: ReceivedVtuber } }) => {
      return (
        <span className="relative">
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
        </span>
      );
    },
  },
  { Header: "kana", accessor: "VtuberKana" },
  {
    Header: "紹介動画",
    accessor: "IntroMovieUrl",
    Cell: ({ row }: { row: { original: ReceivedVtuber } }) => {
      return (
        <div className="relative w-28">
          {(row.original.IntroMovieUrl && (
            <Link
              href={`https://${row.original.IntroMovieUrl}`}
              className={`flex ${LinkTW.base}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/content/external_link.svg"
                className="w-5 mr-2"
                width={24}
                height={20}
                alt=""
              />
              YouTubeへ
            </Link>
          )) || <span className={`relative pl-7`}>未登録</span>}
        </div>
      );
    },
  },
];

/////////////////////////////////////////////////////
type VtuberDeleteTableProps = {
  posts: ReceivedVtuber[];
};

export function VtuberDeleteTable({ posts }: VtuberDeleteTableProps) {
  const data = posts || [{} as ReceivedVtuber];
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns: deleteColumns, data }, useSortBy, useRowSelect);

  return (
    <div className="w-full overflow-scroll md:overflow-hidden">
      <table {...getTableProps()} className={TableCss.regular}>
        <thead className={`${TableCss.regularThead}`}>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  key={headerGroup.id}
                >
                  {column.render("Header")}
                  <span>
                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        "🔽"
                      ) : (
                        "🔼"
                      )
                    ) : (
                      <Image
                        src="/content/sort.svg"
                        className="inline mx-1 h-5"
                        width={24}
                        height={20}
                        alt=""
                      />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                className={`${TableCss.regularTr}`}
                key={i}
              >
                {row.cells.map((cell, j) => {
                  return (
                    <td {...cell.getCellProps()} key={j}>
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const deleteColumns: Column<ReceivedVtuber>[] = [
  { Header: "VTuber", accessor: "VtuberName" },
  { Header: "kana", accessor: "VtuberKana" },
  {
    Header: "紹介動画",
    accessor: "IntroMovieUrl",
    Cell: ({ row }: { row: { original: ReceivedVtuber } }) => {
      return (
        <div className="relative">
          {(row.original.IntroMovieUrl && (
            <Link
              href={`https://${row.original.IntroMovieUrl}`}
              className={`flex ${LinkTW.base}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/content/play_black.svg"
                className="w-5 mr-2"
                width={24}
                height={20}
                alt=""
              />
              YouTubeへ
            </Link>
          )) || <span className={`pl-7`}>未登録</span>}
        </div>
      );
    },
  },
  {
    Header: "削除",
    accessor: "VtuberId",
    Cell: ({ row }: { row: { original: ReceivedVtuber } }) => {
      const { setToDeleteVtuberId } = useContext(ToDeleteContext);
      const clickHandler = () => {
        setToDeleteVtuberId(row.original.VtuberId);
      };
      return (
        <>
          {row.original.VtuberId != undefined && (
            <button className={`${LinkTW.base}`} onClick={clickHandler}>
              <u>削除</u>
            </button>
          )}
        </>
      );
    },
  },
];
