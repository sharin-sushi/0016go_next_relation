import { FormTW } from "@/styles/tailwiind";

export const NeedBox = () => {
  return <span className={`${FormTW.need} mx-1`}>必須</span>;
};

export const DisableBox = () => {
  return <span className={`bg-[#36a91c] ${FormTW.auto} mx-1`}>自動可</span>;
};
