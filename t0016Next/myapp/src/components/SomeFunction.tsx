import type { ReceivedKaraoke } from "../types/vtuber_content"; //type{}で型情報のみインポート

export const Checkbox = ({
  children,
  ...props
}: JSX.IntrinsicElements["input"]) => (
  <label style={{ marginRight: "1em" }}>
    <input type="checkbox" {...props} />
    {children}
  </label>
);

export function generateRandomNumber(max: number) {
  return Math.floor(Math.random() * max - 1) + 1;
}

export function shuffleArray(array: ReceivedKaraoke[]) {
  if (array == null) {
    console.log("shuffleArray is null");
    return [];
  }
  let shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); //ランダムな数値jを生成
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
