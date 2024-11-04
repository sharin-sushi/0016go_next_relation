import { ToClickTW } from "@/styles/tailwiind";
import Link from "next/link";
import { useState } from "react";

export const TopPageNotice = () => {
  const [isDisplay, setIsDisplay] = useState(false);

  return (
    <>
      {isDisplay && (
        <div
          className="absolute z-40 top-[-150px] h-52 w-[86%] md:w-96  bg-[#B7A692]
            p-2 pt-5 rounded-2xl shadow-lg shadow-black"
        >
          <div className="flex flex-col item-center md:text-2xl font-bold">
            <span className="mx-auto">登録完了しました。</span>
            <span className="flex mx-auto">
              ページ内のリストを更新しますか？
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:text-xl mt-2 md:mt-6">
            <button
              type="button"
              onClick={() => setIsDisplay(false)}
              className={`${ToClickTW.boldChoice} p-2 mx-auto mt-4 md:my-0 font-bold`}
            >
              入力を維持するために <br />
              更新しない
            </button>
          </div>
        </div>
      )}

      <div>〇お知らせ</div>
      <div className="ml-4">
        <div className="pl-6">機能追加を順次予定しております。</div>
        {NoticeItems.map((item) => (
          <li key={item.id}>{item.content}</li>
        ))}
        {/* <li>本サイトは視聴機能付きの「ユーザー参加型データベース」です。ご登録をお願いします！</li> */}
      </div>
    </>
  );
};

type NoticeItem = {
  id: string;
  content: React.ReactNode;
};

const NoticeItems: NoticeItem[] = [
  {
    id: "notice-2024-06-03",
    content: (
      <>
        <Link href="/sings/karaoke" className="font-bold">
          「カラオケ」
        </Link>
        ページの検索機能を強化(6/3)
      </>
    ),
  },
  {
    id: "notice-2024-10-18",
    content: (
      <>
        <Link href="/user/signin" className="font-bold">
          「ログイン」
        </Link>
        ページのデザインとエラー表示の改善、ログインできない不具合の修正(10/18)
      </>
    ),
  },
  {
    id: "notice-2024-10-22",
    content:
      "10/20～10/22におけるサイトが不安定な問題を解決しました。引き続きご利用いただけますと幸いです。",
  },
];
