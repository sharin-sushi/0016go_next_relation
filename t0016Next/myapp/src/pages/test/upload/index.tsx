import Image from "next/image";
import React, { useRef, useState } from "react";
import { TestLink } from "../multi";

// 参考：https://zenn.dev/yuyan/articles/f35da08770a135
export const ImageComponent = () => {
  const [base64Images, setBase64Images] = useState<string[]>([]);
  // const [dragOver, setDragOver] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) {
      return;
    }

    // FileListのままだとforEachが使えないので配列に変換する
    const fileArray = Array.from(files);

    // 読み込み結果を補完するための一時配列
    const loadImages: string[] = new Array(fileArray.length);
    let loadCount = 0; // 読み込み済みのファイル数

    fileArray.forEach((file, index) => {
      // ファイルを読み込むためにFileReaderを利用する
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        if (typeof result !== "string") {
          return;
        }
        // 読み込み結果を一時配列に入れる
        loadImages[index] = result;
        loadCount++; // 読み込み済みカウンタを増やす

        // 全てのファイルが読み込まれたかチェック
        if (loadCount === fileArray.length) {
          setBase64Images((prevImages) => [...prevImages, ...loadImages]);
        }
      };
      // 画像ファイルをbase64形式で読み込む
      reader.readAsDataURL(file as Blob);
    });
    // inputの値をリセットする
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const deleteImage = (index: number) => {
    setBase64Images((prev) => prev.filter((_, idx) => idx !== index));
  };

  // const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
  //   e.preventDefault();
  //   setDragOver(true);
  // };

  // const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
  //   setDragOver(false);
  // };

  // const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
  //   e.preventDefault();
  //   setDragOver(false);

  //   // ドラッグ&ドロップされたファイルを取得
  //   const files = e.dataTransfer.files;
  //   if (files.length === 0) {
  //     return;
  //   }
  //   // 今回は画像は１枚だけと仮定。複数の場合はhandleInputFileと同じように実装する
  //   const file = files[0];
  //   // TODO: ~~png, jpeg以外のファイルなら何もしない~~制限する意味有るのか確認
  //   if (file.type !== "image/*") {
  //     return;
  //   }
  //   const reader = new FileReader();
  //   reader.onloadend = () => {
  //     const data = reader.result;
  //     if (typeof data !== "string") {
  //       return;
  //     }
  //     setBase64Images((prevImages) => [...prevImages, data]);
  //   };
  //   reader.readAsDataURL(file as Blob);
  // };

  return (
    <div className="p-2 rounded space-y-2 ">
      <TestLink thisPageNum={5} />
      <div className="h-4" />
      <div className="pt-4 px-1 w-[600px]">
        <input
          hidden
          id="file"
          type="file"
          accept="image/*"
          onChange={handleInputFile}
          ref={inputRef}
          multiple // 画像を複数選択できるようにする
        />

        <div
          className="bg-slate-700 p-2"
          // onDrop={handleDrop}
          // onDragOver={handleDragOver}
          // onDragLeave={handleDragLeave}
        >
          <p>{base64Images.length}/4</p>
          <div className="flex space-x-4 overflow-x-auto py-4 h-40">
            {base64Images.length !== 0 &&
              base64Images.map((image, i) => (
                <div key={`${i}_${image}`} className="">
                  <div className="relative">
                    <Image
                      alt=""
                      height={100}
                      width={100}
                      src={image}
                      className="w-32 h-32 border-2 border-gray-600"
                    />
                    <div
                      className="absolute right-1 top-1 border-2 border-gray-600 bg-white text-slate-800 rounded-full h-4 w-4 flex justify-start items-center cursor-pointer"
                      onClick={() => deleteImage(i)}
                    >
                      ×
                    </div>
                  </div>
                </div>
              ))}
            {base64Images.length < 4 && (
              <div className="w-32 h-32 flex justify-center items-center">
                <label
                  htmlFor="file"
                  className="h-20 w-24  flex justify-center items-center cursor-pointer hover:underline bg-slate-800 rounded-md"
                >
                  画像を追加 <br />
                  (drop 可)
                </label>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ImageComponent;
