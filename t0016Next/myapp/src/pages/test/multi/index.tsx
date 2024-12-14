import React, { useState } from "react";
import { Layout } from "@/components/layout/Layout";

import { YouTubePlayer } from "@/components/moviePlayer/YoutubePlayer";

const pageNum = 0;
const pageName = "test";
// http://localhost:80/test/multi
const TopPage = () => {
  const currentMovieId = "HLvwenXhslI";
  const start = 0;
  return (
    <Layout pageName={pageName} isSignin={false}>
      <TestLink thisPageNum={pageNum} />
      視聴回数カウント確認用。※youtubeページで直接見ないこと。 5/27時点で1回。
      <YouTubePlayer videoId={currentMovieId} start={start} />
    </Layout>
  );
};
export default TopPage;

import Link from "next/link";

// // https://dev.classmethod.jp/articles/introduce-tanstack-table/
const titles = ["index", "Filtering-puls"];

export function TestLink({ thisPageNum }: { thisPageNum: number }) {
  return (
    <div>
      <Link
        href={`/test`}
        className="float-left bg-green-200 text-[#000000] font-extrabold px-4 min-w-5 rounded-full "
      >
        test-top
      </Link>
      {titles?.map((item: string, index: number) => {
        const isThisPage = thisPageNum === index;
        const isIndexPage = index === 0;
        return (
          // eslint-disable-next-line react/jsx-key
          <Link
            href={`/test/multi/${isIndexPage ? "" : index}`}
            className={`
                            float-left
                            ${isThisPage ? "bg-green-200" : "bg-[#FFF6E4]"}
                            text-[#000000] font-extrabold px-4 min-w-5 rounded-full `}
          >
            {index}:{item}
          </Link>
        );
      })}
    </div>
  );
}
