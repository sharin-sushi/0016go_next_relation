import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/router";

import { domain } from "@/../env";
import type { SignupListener, LoginUser as LoginListener } from "@/types/user";
import { Checkbox } from "@/components/SomeFunction";
import { ValidateListenerName, ValidatePassword, ValidateEmail } from "@/util";
import { NeedBox } from "@/components/box/Box";
import { FormTW, ToClickTW } from "@/styles/tailwiind";

export const SigninForm = () => {
  const defaultValues: LoginListener = {
    Email: "",
    Password: "",
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginListener>({ defaultValues, reValidateMode: "onChange" });
  const [isRevealPassword, setIsRevealPassword] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const router = useRouter();

  type InputValues = LoginListener;
  const onSubmit = async (data: InputValues) => {
    try {
      const response = await fetch(`${domain.backendHost}/users/login`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        router.push(`/`);
      } else {
        throw new Error(response.statusText); //catchに飛ぶから呼び出されること無い？
      }
    } catch (error) {
      setIsOpenModal(true);
      console.error(error);
    }
  };
  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-[#FFF6E4] shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full "
      >
        <div className="mb-2 tesxt-black">
          <div className="mb-2">
            <div className="flex text-black">
              <label className={`${FormTW.label}`}>Email</label>
              <NeedBox />
            </div>
            <input
              className={`${ToClickTW.input}`}
              type="text"
              placeholder="v-karaoke@vkara.com"
              {...register("Email", ValidateEmail)}
            />
            <span className="text-red-400">
              {errors.Email && errors.Email.message}
            </span>
            <br />
          </div>

          <div className="mb-2">
            <div className="flex">
              <label className={`${FormTW.label}`}>Password</label>
              <NeedBox />
            </div>
            <input
              className={`${ToClickTW.input}`}
              placeholder="Password"
              type={isRevealPassword ? "text" : "password"}
              {...register("Password", ValidatePassword)}
            />
            <span className="text-red-400">
              {errors.Password && errors.Password.message} <br />
            </span>
            <Checkbox
              checked={isRevealPassword}
              onChange={() => setIsRevealPassword((state) => !state)}
            >
              <span className="text-gray-700">パスワード表示⇔非表示</span>
            </Checkbox>
          </div>
          <div id="decide" className="flex justify-center my-4 ">
            <button type="submit" className={`${ToClickTW.decide} `}>
              確定
            </button>
          </div>
        </div>
        <div className={`flex justify-between mx-6`}>
          <Link
            href="/"
            className={`${ToClickTW.formButton} flex w-[40%] justify-center `}
          >
            TOPへ戻る
          </Link>
          <Link
            href="/user/signup"
            className={`${ToClickTW.formButton} flex w-[40%] justify-center `}
          >
            会員登録へ
          </Link>
        </div>
      </form>
      {isOpenModal && (
        <ErrorModal
          message={"ログインに失敗しました。"}
          setIsOpen={() => setIsOpenModal(false)}
        />
      )}
    </>
  );
};

export function SignupForm() {
  const defaultValues: SignupListener = {
    ListenerName: "",
    Email: "",
    Password: "",
  };
  const router = useRouter();
  // register：フォームフィールドを登録する関数
  // handleSubmit：フォームの送信を処理する関数
  // errors：フォームフィールドのエラー情報を含むオブジェクト　　の３つを取得
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupListener>({ defaultValues, reValidateMode: "onChange" });
  const [isRevealPassword, setIsRevealPassword] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);

  type InputValues = SignupListener;

  const onSubmit = async (data: InputValues) => {
    try {
      const response = await fetch(`${domain.backendHost}/users/signup`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        router.push(`/`);
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      setIsOpenModal(true);

      console.error(error);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-[#FFF6E4] shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-2">
          <div className="flex">
            <label className={`${FormTW.label}`}>Username</label>
            <NeedBox />
          </div>
          <input
            className={`${ToClickTW.input}`}
            id="username"
            type="text"
            placeholder="UserName"
            {...register("ListenerName", ValidateListenerName)}
          />
          <div className="text-red-400">
            {errors.ListenerName && errors.ListenerName.message}
          </div>
        </div>

        <div className="mb-2">
          <div className="flex">
            <label className={`${FormTW.label}`}>Email</label>
            <NeedBox />
          </div>
          <input
            className={`${ToClickTW.input}`}
            type="text"
            placeholder="v-karaoke@vkara.com"
            {...register("Email", ValidateEmail)}
          />
          <span className="text-red-400">
            {errors.Email && errors.Email.message}
          </span>
        </div>

        <div className="mb-2">
          <div className="flex">
            <label className={`${FormTW.label}`}>Password</label>
            <NeedBox />
          </div>
          <input
            className={`${ToClickTW.input}`}
            placeholder="Password"
            type={isRevealPassword ? "text" : "password"}
            {...register("Password", ValidatePassword)}
          />
          <span className="text-red-400">
            {errors.Password && errors.Password.message} <br />
          </span>
          <Checkbox
            checked={isRevealPassword}
            onChange={() => setIsRevealPassword((state) => !state)}
          >
            <span className="text-gray-700">パスワード表示⇔非表示</span>
          </Checkbox>
          <br />
        </div>

        <div id="decide" className="flex justify-center my-4 ">
          <button type="submit" className={`${ToClickTW.decide} `}>
            確定
          </button>
        </div>
        <div className={`flex justify-between mx-6`}>
          <Link
            href="/"
            className={`${ToClickTW.formButton} flex w-[40%] justify-center`}
          >
            TOPへ戻る
          </Link>
          <Link
            href="/user/signin"
            className={`${ToClickTW.formButton} flex w-[40%] justify-center`}
          >
            ログインへ
          </Link>
        </div>
      </form>

      {isOpenModal && (
        <ErrorModal
          message={"会員登録に失敗しました。"}
          setIsOpen={() => setIsOpenModal(false)}
        />
      )}
    </>
  );
}

const ErrorModal = ({
  message,
  setIsOpen,
}: {
  message: string;
  setIsOpen: () => void;
}) => {
  return (
    <>
      <div className="absolute z-20 flex flex-col bg-[#776D5C] top-32 left-1/2 -translate-x-1/2 gap-y-5 w-80 h-48 p-5 rounded-md">
        <span className="text-xl font-bold">Error</span>
        <span className="text-lg">{message}</span>
        <button
          className={`w-32 py-1 mt-4 mx-auto bg-[#657261] shadow-sm hover:bg-[#B7A692] hover:shadow-none hover:shadow-[#776D5C] shadow-black text-white rounded-md font-bold`}
          onClick={setIsOpen}
        >
          ok
        </button>
      </div>
      {/* TODO: heightををいい感じにする。 */}
      <button
        onClick={() => setIsOpen}
        className="absolute z-10 w-screen h-[145%] opacity-85 inset-0 bg-[#1f2724]"
      ></button>
    </>
  );
};

const memo = {
  //ファイルのtopレベルに置いておくとESLintの自動整形が機能しなくなる
  // ****memo****
  //  <DeleteButton Unique_id ={ Unique_id }/>
  // router.push(`/show?Unique_id=${Unique_id}`)
  //  条件付きレンダリング…左辺がtrueなら右辺を表示する
  // Email: <input {...register("Email", { required: true })} placeholder="Email" /><br />
  // register：フォームフィールドを登録する関数
  // handleSubmit：フォームの送信を処理する関数
  // errors：フォームフィールドのエラー情報を含むオブジェクト　　の３つを取得
  // const router = useRouter();
  // const { Unique_id } = router.query;
  // フォームの送信が行われたとき(他の処理が終わったとき？)に呼び出される
  // const onSubmit = async (data: LoginUser) => {
  // data：送信されたフォームフィールドの値を含むオブジェクト
  // const unique_id = router.query.id;
  // const response = await fetch(`http://localhost:8080/login2`, {
  //     method: 'POST',
  //     headers: {
  //         'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify(data) //dataをJSONに変換
  //     });
  //tryブロック　この中でエラー発生したら直後のchatchブロックが実行される
  // try {
  // fecthとか
  // } chatch{
  // エラー処理とか}
  //
};
