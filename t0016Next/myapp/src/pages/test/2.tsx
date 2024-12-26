import React, { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { useForm } from "react-hook-form";

function RectHookForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  const [sendData, setSendData] = useState(null);
  const onSubmit2 = (data: any) => console.log(data);
  console.log(errors);

  return (
    <>
      : {getValues("First name2")}
      <form
        onSubmit={handleSubmit(onSubmit2)}
        className="flex flex-col w-96 py-2 gap-1"
      >
        <input
          type="text"
          placeholder="First name"
          {...register("First name", {
            required: true,
            max: 5,
            min: 3,
            maxLength: 80,
          })}
        />
        <input
          type="text"
          placeholder="Last name"
          {...register("Last name", { required: true, maxLength: 100 })}
        />
        <input
          type="text"
          placeholder="Email"
          {...register("Email", { required: true, pattern: /^\S+@\S+$/i })}
        />
        <input
          type="tel"
          placeholder="Mobile number"
          {...register("Mobile number", {
            required: true,
            minLength: 6,
            maxLength: 12,
          })}
        />
        <select {...register("Title", { required: true })}>
          <option value="Mr">aaaa</option>
          <option value="Mr">Mr</option>
          <option value="Mrs">Mrs</option>
          <option value="Miss">Miss</option>
          <option value="Dr">Dr</option>
        </select>

        <input
          {...register("Developer", { required: true })}
          type="radio"
          value="Yes"
        />
        <input
          {...register("Developer", { required: true })}
          type="radio"
          value="No"
        />

        <input type="submit" />
      </form>
      <div>{sendData}</div>
    </>
  );
}

const pageName = "test";
// http://localhost:3005/test/2
const TopPage = () => {
  const currentMovieId = "HLvwenXhslI";
  const start = 0;
  return (
    <Layout pageName={pageName} isSignin={false}>
      <RectHookForm />
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
