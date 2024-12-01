import { ToClickTW } from "@/styles/tailwiind";

export const SelectCrudContent = ({
  crudContentType,
  setCrudContentType,
}: any) => {
  return (
    <div className="w-full">
      <span className={`flex justify-center`}>データ種類の選択</span>
      <div id="select_data_type" className="flex justify-center">
        <button
          onClick={() => setCrudContentType("vtuber")}
          className={`${ToClickTW.choice}  mx-2 
                    ${
                      crudContentType === "vtuber"
                        ? "bg-[#66a962]"
                        : "bg-[#776D5C]"
                    } 
                    `}
        >
          VTuber
        </button>
        <button
          onClick={() => setCrudContentType("movie")}
          className={`${ToClickTW.choice} mx-2
                    ${
                      crudContentType === "movie"
                        ? "bg-[#66a962]"
                        : "bg-[#776D5C]"
                    }
                    `}
        >
          動画(歌枠)
        </button>
        <button
          onClick={() => setCrudContentType("karaoke")}
          className={`${ToClickTW.choice} mx-2
                    ${
                      crudContentType === "karaoke"
                        ? "bg-[#66a962]"
                        : "bg-[#776D5C]"
                    }
                    `}
        >
          歌(karaoke)
        </button>
      </div>
    </div>
  );
};
