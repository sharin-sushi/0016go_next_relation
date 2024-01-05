export const ConvertStringToTime = (SingStart: string): number => {
  console.log(SingStart)
  const match = SingStart.match(/\d+/g);
  if (!match || match.length !== 3) {
    console.error("Invalid input format:", SingStart);
    return 0;
  }
  const hours = Number(match[0]);
  const minutes = Number(match[1]);
  const seconds = Number(match[2]);
  let totalSeconds = (hours * 60 * 60) + (minutes * 60) + seconds;

  console.log("totalSeconds:", totalSeconds);
  return totalSeconds;
}


export const ExtractVideoId = (url: string): string => {
  const match = url.match(/v=([^&]+)/);
  if (match && match[1]) {
    return match[1];
  }
  return '';
};