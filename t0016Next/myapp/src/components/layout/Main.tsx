import Link from "next/link";
import React from "react";

import { GestLogin } from "../button/User";
import { ToClickTW } from "@/styles/tailwiind";

export function NotLoggedIn() {
  return (
    <div className="h-full ">
      <h1 className="text-lg pt-8">ログインが必要なコンテンツです</h1> <br />
      <div className="flex flex-col md:flex-none">
        <div className="flex flex-row">
          <Link
            href="/user/signup"
            className={`${ToClickTW.regular} flex mr-4 w-[93px] justify-center`}
          >
            会員登録
          </Link>
          <Link
            href="/user/signin"
            className={`${ToClickTW.regular} flex w-[93px] justify-center`}
          >
            ログイン
          </Link>
        </div>
        <span className="pl-2 pb-8">
          データ登録とそのデータの編集、削除ができます。
        </span>
        <div className="w-28">
          <GestLogin />
        </div>
        <span className="pl-2">
          データ登録できますが、そのデータは誰にでも編集・削除できます。
        </span>
      </div>
    </div>
  );
}

export function NotFoundVtuber() {
  return (
    <div className="h-full ">
      <h1 className="text-lg pt-1">Vtuberか歌枠が見つかりません</h1> <br />
      <div className="flex flex-col md:flex-none">
        <span className="pl-2 pb-4">Vtuberや歌枠を登録してみませんか？</span>
        <Link
          className={`${ToClickTW.regular} justify-center float-right px-3 mr-2 w-24`}
          href="/crud/create"
        >
          登録ページ
        </Link>
      </div>
    </div>
  );
}
