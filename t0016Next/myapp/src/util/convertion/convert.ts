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
  const match = url.match(/v=([^&]+)/);
  if (match && match[1]) {
    return match[1];
  }
  return "";
};
