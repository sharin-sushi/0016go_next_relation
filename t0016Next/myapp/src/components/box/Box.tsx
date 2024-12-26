import { FormTW } from "@/styles/tailwiind";
// import React from 'react';

// export const TopPageHowToUseBox = () => {
//     // const [currentVideoId, setCurrentVideoId] = useState<string>("9ehwhQJ50gs");
//     // const [currentStart, setCurrentStart] = useState<number>(0);
//     const originalSong = [
//         { title: "【original anime MV】SHINKIRO【hololive/宝鐘マリン・Gawr Gura】", videoId: "9ehwhQJ50gs" },
//         { title: "星街すいせい - Stellar Stellar / THE FIRST TAKE", videoId: "AAsRtnbDs-0" },
//         { title: "【MV】ChumuNote - Broken Promises (feat. Purukichi) Short ver.", videoId: "LnL8i4c8sfo" },
//     ]
//     return (
//         <span>
//             {originalSong.map((row) => (
//                 <option key={row.}>
//                     {row.title}
//                 </option>
//             ))}
//         </span>
//     )

// }

export const NeedBox = () => {
  return <span className={`${FormTW.need} mx-1`}>必須</span>;
};

export const DisableBox = () => {
  return <span className={`bg-[#36a91c] ${FormTW.auto} mx-1`}>自動可</span>;
};
