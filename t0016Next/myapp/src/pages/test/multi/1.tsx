import React, { useState, useEffect } from "react";
import { useMemo } from "react";
import https from "https";
import axios, { AxiosRequestConfig } from "axios";

import { domain } from "@/../../env";
import type {
  ReceivedVtuber,
  ReceivedMovie,
  ReceivedKaraoke,
} from "@/types/vtuber_content";
import { Layout } from "@/components/layout/Layout";
import { ContextType } from "@/types/server";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { VtuberCOLUMNS4 } from "./libs/data";
import { TestLink } from "./index";
import { checkLoggedin } from "@/util/webStrage/cookie";

// http://localhost:80/test/multi
// const pageNum = Number(window.location.pathname.split("/").pop());
const pageNum = 1;
const pageName = "test/multi/" + pageNum;
type TopPage = {
  posts: {
    vtubers: ReceivedVtuber[];
    vtubers_movies: ReceivedMovie[];
    vtubers_movies_karaokes: ReceivedKaraoke[];
    latest_karaokes: ReceivedKaraoke[];
  };
  isSignin: boolean;
};

export default function App({ posts, isSignin }: TopPage) {
  const [data, setData] = useState<ReceivedVtuber[]>([]);

  const initialPageIndex = 0;
  const initialPageSize = 2;

  useEffect(() => {
    const vtubers = posts?.vtubers || [{} as ReceivedVtuber];
    const fetchData = async () => {
      setData(await vtubers);
    };
    fetchData();
  }, [posts?.vtubers]);

  const columns = useMemo(() => VtuberCOLUMNS4, []);

  const table = useReactTable({
    columns,
    data,
    initialState: {
      pagination: {
        pageIndex: initialPageIndex,
        pageSize: initialPageSize,
      },
      sorting: [{ id: "id", desc: true }],
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });
  return (
    <Layout pageName={pageName} isSignin={isSignin}>
      <TestLink thisPageNum={pageNum} />

      <div style={{ padding: "10px" }}>
        <input
          placeholder="Filter vtuber_name..."
          value={
            (table.getColumn("VtuberName")?.getFilterValue() as string) ?? ""
          }
          onChange={(e) =>
            table.getColumn("VtuberName")?.setFilterValue(e.target.value)
          }
        />
        <input
          placeholder="Filter all..."
          onChange={(e) => table.setGlobalFilter(e.target.value)}
        />
      </div>
      <div className="">
        <main className="">
          <table className="bg-slate-600">
            <thead className="bg-slate-700 border-b-2">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className="mx-2"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => {
                return (
                  <tr key={row.id} className="">
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
          <div style={{ margin: "5px" }}>
            <span>Page</span>
            <strong>
              {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </strong>
          </div>
          <div>
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              {"<<"}
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {"<"}
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {">"}
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              {">>"}
            </button>
          </div>
          <select
            style={{ margin: "10px" }}
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            {[2, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>

          <p>{table.getRowModel().rows.length} Rows</p>
        </main>
      </div>
    </Layout>
  );
}
// export default TopPage;

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

  let resData = null;
  try {
    // const res = await axios.get(`${domain.backendHost}/vcontents/dummy-top-page`, options);
    const res = await axios.get(`${domain.backendHost}/vcontents/`, options);
    resData = res.data;
  } catch (error) {
    console.log("erroe in axios.get:", error);
  }
  return {
    props: {
      posts: resData,
      isSignin: isLoggedin,
    },
  };
}
