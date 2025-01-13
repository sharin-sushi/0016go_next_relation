import { ToClickTW } from "@/styles/tailwiind";
import { CrudContentType } from "@/types/vtuber_content";

interface SelectCrudContentProps {
  contentType: string;
  setContentType: (type: CrudContentType) => void;
}

export const CrudContentSelector = ({
  contentType,
  setContentType,
}: SelectCrudContentProps) => {
  return (
    <div className="w-full">
      <span className={`flex justify-center`}>データ種類の選択</span>
      <div id="select_data_type" className="flex justify-center">
        <button
          onClick={() => setContentType("vtuber")}
          className={`${ToClickTW.choice}  mx-2 
                    ${
                      contentType === "vtuber" ? "bg-[#66a962]" : "bg-[#776D5C]"
                    } 
                    `}
        >
          VTuber
        </button>
        <button
          onClick={() => setContentType("movie")}
          className={`${ToClickTW.choice} mx-2
                    ${contentType === "movie" ? "bg-[#66a962]" : "bg-[#776D5C]"}
                    `}
        >
          動画(歌枠)
        </button>
        <button
          onClick={() => setContentType("karaoke")}
          className={`${ToClickTW.choice} mx-2
                    ${
                      contentType === "karaoke"
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

type getYoutubeVideoProps = {
  movieId: string;
  isSnippet?: boolean;
  isContentDetails?: boolean;
  isStatus?: boolean;
  isStatistics?: boolean;
  isPlayer?: boolean;
  isTopicDetails?: boolean;
  isRecordingDetails?: boolean;
  isFileDetails?: boolean;
  isProcessingDetails?: boolean;
  isSuggestions?: boolean;
  isLiveStreamingDetails?: boolean;
  isLocalizations?: boolean;
  fullOption?: boolean;
};

// NEMO: GitHub上で悪意ある者にサーチされないような命名にしてる
const SHARI = process.env.NEXT_PUBLIC_SHARI;

export const getYoutubeVideo = async ({
  movieId,
  isSnippet,
  isStatistics,
  isContentDetails,
  isStatus,
  isPlayer,
  isTopicDetails,
  isRecordingDetails,
  isFileDetails,
  isProcessingDetails,
  isSuggestions,
  isLiveStreamingDetails,
  isLocalizations,
  fullOption,
}: getYoutubeVideoProps): Promise<any> => {
  // TODO: fullだとエラーになり取得できない。要修正。
  const url = fullOption
    ? `https://www.googleapis.com/youtube/v3/videos?id=${movieId}&key=${SHARI}
     "&part=snippet&part=contentDetails&part=statistics"&part=statistics&part=player&part=topicDetails&part=recordingDetails&part=fileDetails&part=processingDetails&part=suggestions&part=liveStreamingDetails&part=localizations"`
    : `https://www.googleapis.com/youtube/v3/` +
      `videos?id=${movieId}` +
      `&key=${SHARI}` +
      `${isSnippet ? "&part=snippet" : ""}` +
      `${isContentDetails ? "&part=contentDetails" : ""}` +
      `${isStatus ? "&part=statistics" : ""}` +
      `${isStatistics ? "&part=statistics" : ""}` +
      `${isPlayer ? "&part=player" : ""}` +
      `${isTopicDetails ? "&part=topicDetails" : ""}` +
      `${isRecordingDetails ? "&part=recordingDetails" : ""}` +
      `${isFileDetails ? "&part=fileDetails" : ""}` +
      `${isProcessingDetails ? "&part=processingDetails" : ""}` +
      `${isSuggestions ? "&part=suggestions" : ""}` +
      `${isLiveStreamingDetails ? "&part=liveStreamingDetails" : ""}` +
      `${isLocalizations ? "&part=localizations" : ""}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("error in getYoutubeMovie");
    }
    return await res.json();
  } catch (error) {
    console.error("error in getYoutubeMovie:", error);
    return null;
  }
};
