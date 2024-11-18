import Link from "next/link";

export const CreateContentFormDescription = () => {
  return (
    <div id="explain" className="flex justify-center text-sm my-4 ">
      <div className="">
        <div className="my-3">
          <h1 className="bg-gray-600 w-[180px]">〇会員について</h1>
          <li>
            現在、データの編集・削除の権限はそのデータ登録者本人とサイト管理者のみが所持しています。
          </li>
          <li>
            ご自身の登録データは
            <Link href="/user/mypage" className="underline underline-offset-1">
              マイページ
            </Link>
            で確認できます。
          </li>
        </div>

        <div className="">
          <h1 className="bg-gray-600 w-[180px]">〇ゲストユーザーについて</h1>
          <li>
            不要なデータでもお試し登録okです(後で削除していただけたら幸いです。)
          </li>
          <li>登録データは「最近登録された50曲」には表示されません。</li>
          <li>
            登録データは予告無く、削除または別ユーザーへ管理権限を譲渡することがあります。
          </li>
        </div>
      </div>
    </div>
  );
};
