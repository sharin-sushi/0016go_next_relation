import { MovieUrlPattern } from "../regularExpression/VtuberContent";

export const timeStringToSecondNum = (SingStart: string): number => {
  const match = SingStart.match(/\d+/g);
  if (!match || match.length !== 3) {
    console.error("Invalid input format:", SingStart);
    return 0;
  }
  const hours = Number(match[0]);
  const minutes = Number(match[1]);
  const seconds = Number(match[2]);
  let totalSeconds = hours * 60 * 60 + minutes * 60 + seconds;
  return totalSeconds;
};

export const extractVideoId = (url: string): string => {
  const globalRegex = new RegExp(MovieUrlPattern, "g");
  const isGlobalMatch = globalRegex.test(url);
  if (!isGlobalMatch) {
    return "";
  }

  const match = url.match(/[a-zA-Z0-9_\-]{11}/);
  if (match != null && match[0]) {
    return match[0];
  }
  return "";
};

// const PatternWatch =
//   /(^(https:\/\/)??www\.youtube\.com\/watch\?v=[a-zA-Z0-9_\-]{11}&t=\d+)??$/;
// const PatternLive =
//   /(^(https:\/\/)??www\.youtube\.com\/live\/[a-zA-Z0-9_\-]{11}&t=\d+)??$/;
// const PatternShort =
//   /(^(https:\/\/)??youtu\.be\/[a-zA-Z0-9_\-]{11}(&t=\d+)??$)|^[a-zA-Z0-9_\-]{11}$/;
// const PatternId = /^[a-zA-Z0-9_\-]{11}$/;
