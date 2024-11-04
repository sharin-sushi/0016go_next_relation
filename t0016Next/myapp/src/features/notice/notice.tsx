import { ToClickTW } from "@/styles/tailwiind";
import Link from "next/link";
import { useState } from "react";

export const TopPageNotice = () => {
  const [isDisplay, setIsDisplay] = useState(false);

  return (
    <div className="flex flex-col items-center max-w-[1000px] m-auto mt-2">
      <div>
        <div className="flex items-end">
          <div className="items-start">〇お知らせ</div>
          <div
            className="flex text-xs justify-center rounded-md h-[15px] w-[15px] m-0.5 bg-[#776D5C] hover:opacity-70 cursor-pointer"
            onClick={() => setIsDisplay(true)}
          >
            ？
          </div>
        </div>
      </div>
      <div className="ml-4">
        <li>{NoticeItems[0].content}</li>
        <li>{NoticeItems[1].content}</li>
        <li>{NoticeItems[2].content}</li>
        {/* <li>本サイトは視聴機能付きの「ユーザー参加型データベース」です。ご登録をお願いします！</li> */}
      </div>

      {isDisplay && (
        <div className="absolute flex items-center justify-center z-10 top-0 left-0 h-full w-full">
          <div
            className="h-full w-full bg-black opacity-50"
            onClick={() => setIsDisplay(false)}
          />

          <div
            className="absolute z-40 flex flex-col top-[150px] items-center md:max-w-3xl w-[90%] p-2 pt-5
            bg-[#B7A692] rounded-2xl shadow-lg shadow-black"
          >
            <div className="ml-4 text-black">
              <div className="font-bold">お知らせ全件</div>
              {NoticeItems.map((item) => (
                <li key={item.id}>{item.content}</li>
              ))}
              {/* <li>本サイトは視聴機能付きの「ユーザー参加型データベース」です。ご登録をお願いします！</li> */}
            </div>
            <div
              className={`${ToClickTW.regular} font-normal w-13`}
              onClick={() => {
                setIsDisplay(false);
              }}
            >
              閉じる
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const NoticeLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  return (
    <Link href={href} className="font-bold hover:opacity-50 hover:underline">
      {children}
    </Link>
  );
};

type NoticeItem = {
  id: string;
  content: React.ReactNode;
};

const NoticeItems: NoticeItem[] = [
  {
    id: "notice-2024-10-22",
    content: "10/20～10/22におけるサイトが不安定な問題の解決 (10/23)",
  },

  {
    id: "notice-2024-10-18",
    content: (
      <>
        <NoticeLink href="/user/signin">「ログイン」</NoticeLink>
        ページのデザインとエラー表示の改善、ログインできない不具合の修正 (10/18)
      </>
    ),
  },
  {
    id: "notice-2024-06-03",
    content: (
      <>
        <NoticeLink href="/sings/karaoke">「カラオケ」</NoticeLink>
        ページの検索機能を強化 (6/3)
      </>
    ),
  },
  {
    id: "notice-2024-05-30",
    content: (
      <>
        <NoticeLink href="https://x.com/i_mo_5">「妹望おいも」</NoticeLink>
        誕生日(5/30)
      </>
    ),
  },
];
