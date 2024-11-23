import Head from "next/head";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";

import { GestLogin, GestLoginForHamburger } from "../button/User";
import { HeaderCss, FooterTW } from "@/styles/tailwiind";
import { ToClickTW } from "@/styles/tailwiind";
import { getWindowSize } from "@/features/layout/Layout";
import {
  CreateLink,
  DeleteLink,
  EditLink,
  KaraokeLink,
  OriginalSongLink,
  LoginLink,
  MyPageLink,
  ProfileLink,
  SignUpLink,
  TitleLink,
  TopLink,
} from "../button/link/Humbarger";
import Image from "next/image";

type LayoutProps = {
  pageName: string;
  children: any;
  isSignin: boolean;
};
export const SigninContext = React.createContext(
  {} as {
    isSignin: boolean;
  }
);

export function Layout({ pageName, children, isSignin }: LayoutProps) {
  return (
    <div className="h-full">
      <SigninContext.Provider value={{ isSignin }}>
        <Head>
          <link rel="icon" href="/shari.ico" />
          <title>{`V-kara/${pageName}`}</title>
        </Head>
        <Header pageName={pageName} />
        <main className="flex flex-col min-h-screen p-4 pt-8 ">
          <div className="md:absolute md:right-1 ">
            <span className="flex-1 "> {pageName}</span>
            <span className="flex-1 px-1">|</span>
            <span className="flex-1 ">
              {(isSignin && "ログイン中") || "非ログイン中"}
            </span>
          </div>
          {children}
        </main>
        <Footer />
      </SigninContext.Provider>
    </div>
  );
}

type HeaderProps = {
  pageName: string;
};
const md = 768;

const Header = ({ pageName }: HeaderProps) => {
  const pathName = usePathname();
  const { isSignin } = useContext(SigninContext);

  const [isOpen, setIsOpen] = useState<Boolean>(false);
  const [width, setWidth] = useState<number>(900);

  useEffect(() => {
    const { width } = getWindowSize();
    setWidth(width);
  }, []);
  if (width > md) {
    return (
      <div>
        <header className={`${HeaderCss.regular}`}>
          <a href="#pageTop" />
          <Link
            href="/"
            className="flex float-left bg-[#FFF6E4] text-[#000000] font-extrabold px-4 pb-1 pr-6 rounded-br-full "
          >
            V-kara
          </Link>
          <div className="flex float-right">
            <div className="px-1">
              <span>
                <Link href="/" className={`${ToClickTW.regular} mr-1`}>
                  TOP
                </Link>
              </span>
              <span>
                <Link
                  href="/sings/karaoke"
                  className={`${ToClickTW.regular} mr-1`}
                >
                  カラオケ
                </Link>
              </span>
              <span>
                <Link
                  href="/sings/original-song"
                  className={`${ToClickTW.regular} mr-1`}
                >
                  オリ曲
                </Link>
              </span>
              /
            </div>

            {isSignin && (
              <div className="px-1">
                <span className="pr-1">データの</span>
                <span className="pr-1">
                  <Link href="/crud/create" className={`${ToClickTW.regular} `}>
                    登録
                  </Link>
                </span>
                <span className="pr-1">:</span>
                <span className="pr-1">
                  <Link href="/crud/edit" className={`${ToClickTW.regular} `}>
                    編集
                  </Link>
                </span>
                <span className="pr-1">:</span>
                <span className="pr-1">
                  <Link href="/crud/delete" className={`${ToClickTW.regular} `}>
                    削除
                  </Link>
                </span>
                /
              </div>
            )}

            {!isSignin && (
              <div className="pr-1">
                <Link
                  href="/user/signup"
                  className={`${ToClickTW.regular} mr-1`}
                >
                  会員登録
                </Link>
                <span className="pr-1">:</span>
                <Link
                  href="/user/signin"
                  className={`${ToClickTW.regular} mr-1`}
                >
                  ログイン
                </Link>
                <span className="pr-1">:</span>
                <GestLogin />
              </div>
            )}

            {isSignin && (
              <div>
                <span className="pr-1">
                  <Link href="/user/mypage" className={`${ToClickTW.regular} `}>
                    マイページ
                  </Link>
                </span>
                {pathName === "/user/mypage" && (
                  <>
                    <span className="pr-1">:</span>
                    <Link
                      href="/user/profile"
                      className={`${ToClickTW.regular} px-1`}
                    >
                      プロフィール
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </header>
      </div>
    );
  } else {
    return (
      <header className={`${HeaderCss.regular}  z-40`}>
        <a href="#pageTop" />
        <TitleLink />
        <div className={``}>
          <div className=" h-6 flex float-right justify-end z-30  items-center ">
            <Link href="/" className={`${ToClickTW.regular} mr-1 w-10 `}>
              TOP
            </Link>
            <Link href="/sings/karaoke" className={`${ToClickTW.regular} mr-1`}>
              カラオケ
            </Link>
            <Link
              href="/sings/original-song"
              className={`${ToClickTW.regular} mr-1`}
            >
              オリ曲
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="hover:bg-[#657261] rounded-lg "
            >
              <Image
                src="/user/hamburger.svg"
                className="h-7"
                width={24}
                height={20}
                alt={""}
              />
            </button>
          </div>

          {isOpen && (
            <div>
              <button
                onClick={() => setIsOpen(false)}
                className="absolute w-screen h-screen opacity-85 inset-0 bg-[#1f2724] z-10 "
              ></button>
              <div
                className={`absolute right-0 flex float-right flex-col h-screen w-[40%]  min-w-44 bg-[#657261] z-40  scroll-smooth`}
              >
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="absolute right-0 top-0 h-7 hover:bg-[#1f2724] rounded-lg  "
                >
                  <Image
                    src="/user/cross_bold.svg"
                    className="h-7 "
                    width={24}
                    height={20}
                    alt={""}
                  />
                </button>

                <div id="area" className="flex flex-col h-full">
                  <hr id="hr1" className="flex w-[50%] my-4" />
                  <hr className=" w-[40%] my-4" />
                  <hr className=" w-[10%] my-4" />
                  <div
                    id="menu"
                    className="absolute flex flex-col right-0 w-36 sm:w-48 mt-[20%]  rounded "
                  >
                    <div className=" flex flex-col ">
                      <TopLink />
                      <KaraokeLink />
                      <OriginalSongLink />
                    </div>
                    <hr className="w-[60%] top-10 right-0 my-3" />

                    {!isSignin && (
                      <div className=" flex flex-col ">
                        <SignUpLink />
                        <LoginLink />
                        <GestLoginForHamburger />
                        <hr className=" w-[60%] top-10 right-0 my-3 " />
                      </div>
                    )}

                    {isSignin && (
                      <div>
                        <div className=" flex flex-col h-32  ">
                          <CreateLink />
                          <EditLink />
                          <DeleteLink />
                        </div>

                        <hr className=" flex w-[50%] mb-3 " />

                        <div className=" flex flex-col ">
                          <MyPageLink />
                          <ProfileLink />
                        </div>
                        <hr className="flex w-[50%] my-3 ml-28" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    );
  }
};

const Footer = () => {
  const pathName = usePathname();
  const { isSignin } = useContext(SigninContext);
  return (
    <footer className={`${FooterTW.regular}`}>
      <div className="flex float-right">
        <Link href="/" className="mx-1">
          TOP
        </Link>
        :
        <Link href="/sings/karaoke" className="mx-1">
          {" "}
          カラオケ
        </Link>
        :
        <Link href="/sings/original-song" className="mx-1">
          {" "}
          オリ曲
        </Link>
        /
        {isSignin && (
          <div className="mx-1">
            <Link href="/crud/create" className="mx-1">
              登録
            </Link>
            :
            <Link href="/crud/edit" className="mx-1">
              編集
            </Link>
            :
            <Link href="/crud/delete" className="mx-1">
              削除
            </Link>
            /
          </div>
        )}
        {!isSignin && (
          <div className="mx-1">
            <Link href="/user/signup" className="mx-1">
              会員登録
            </Link>
            :
            <Link href="/user/signin" className="mx-1">
              ログイン
            </Link>
          </div>
        )}
        {isSignin && (
          <div className="">
            <Link href="/user/mypage" className="mx-1">
              マイページ
            </Link>
            {pathName === "/user/mypage" && (
              <div>
                :
                <Link href="/user/profile" className="mx-1">
                  プロフィール
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
      <div
        id="pageTop"
        className="flex float-left bg-[#FFF6E4] text-[#000000] font-extrabold px-4 pb-1 pr-6 rounded-tr-full "
      >
        V-kara
      </div>
    </footer>
  );
};
