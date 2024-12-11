import { ToClickTW } from "@/styles/tailwiind";

interface SelectCrudContentProps {
  contentType: string;
  setContentType: (type: string) => void;
}

export const SelectCrudContent = ({
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
};

export const getYoutubeMovieTitle = async ({
  movieId,
}: getYoutubeVideoProps): Promise<any> => {
  // `&key=${process.env.YOUTUBE_API_KEY}`
  const url =
    `https://www.googleapis.com/youtube/v3/` +
    `videos?id=${movieId}` +
    `&key=${"AIzaSyBPH1X5ShgFOIzGWijZqrgnegkC6lT6_Fw"}` +
    `&part=snippet`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("error in getYoutubeMovie");
    }
    // @ts-ignore
    return await res.json().items[0].snippet.title;
  } catch (error) {
    console.log("error in getYoutubeMovie:", error);
    return null;
  }
};

export const getYoutubeMovie = async ({
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
}: getYoutubeVideoProps): Promise<any> => {
  const url = `https://www.googleapis.com/youtube/v3/videos?id=${movieId}&key=${"AIzaSyBPH1X5ShgFOIzGWijZqrgnegkC6lT6_Fw"}${
    isSnippet && "&part=snippet"
  }`;

  try {
    const res2 = await fetch(
      // `&key=${process.env.YOUTUBE_API_KEY}`
      `https://www.googleapis.com/youtube/v3/` +
        `videos?id=${movieId}` +
        `&key=${"AIzaSyBPH1X5ShgFOIzGWijZqrgnegkC6lT6_Fw"}` +
        `${isSnippet && "&part=snippet"}` +
        `${isContentDetails && "&part=contentDetails"}` +
        `${isStatus && "&part=statistics"}` +
        `${isStatistics && "&part=statistics"}` +
        `${isPlayer && "&part=player"}` +
        `${isTopicDetails && "&part=topicDetails"}` +
        `${isRecordingDetails && "&part=recordingDetails"}` +
        `${isFileDetails && "&part=fileDetails"}` +
        `${isProcessingDetails && "&part=processingDetails"}` +
        `${isSuggestions && "&part=suggestions"}` +
        `${isLiveStreamingDetails && "&part=liveStreamingDetails"}` +
        `${isLocalizations && "&part=localizations"}`
    );
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("error in getYoutubeMovie");
    }
    return await res.json();
  } catch (error) {
    console.log("error in getYoutubeMovie:", error);
    return null;
  }
};
