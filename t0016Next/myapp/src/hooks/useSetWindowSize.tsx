import { useState, useEffect } from "react";

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  // const [hasWindow, setHasWindowSize] = useState<boolean>(false);

  useEffect(() => {
    // const handleResize = () => {
    //     setWindowSize({
    //         width: window.innerWidth,
    //         height: window.innerHeight,
    //     });
    // };

    // handleResize(); // マウント時にwindowサイズを取得

    setWindowSize({ width: window.innerWidth, height: window.innerHeight });

    // setHasWindowSize(true)

    // window.addEventListener('resize', handleResize);
    // return () => window.removeEventListener('resize', handleResize);
  }, []); // 空の依存関係配列を渡すことで、マウント時とアンマウント時のみ実行されます。

  return windowSize;
};

export default useWindowSize;
