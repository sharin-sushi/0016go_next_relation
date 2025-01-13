import React, { useEffect, useState } from "react";
import YouTube from "react-youtube";

import { YouTubeTW } from "@/styles/tailwiind";
import { getWindowSize } from "@/features/layout/Layout";
import useWindowSize from "@/hooks/useSetWindowSize";
import useHasWindow from "@/hooks/useHasWindow";

export const YouTubePlayer = ({
  videoId,
  start,
}: {
  videoId: string;
  start: number;
}) => {
  const [hasWindow, setHasWindow] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasWindow(true);
    }
  }, []);

  const { height: preHeight, width: preWidth } = getWindowSize();
  // const { width: preWidth, height: preHeight } = useWindowSize()
  // const hasWindow = useHasWindow()
  // const preWidth = windowSize.width
  // const preHeight = windowSize.height
  const aspectRatio = 9 / 16;
  const isHorizontally = preWidth > preHeight;

  if (isHorizontally) {
    if (preWidth > 950) {
      const height = 255;
      const width = Math.round(height / aspectRatio);
      return (
        <div>
          {hasWindow && (
            <div>
              <PreYouTubePlayer
                videoId={videoId}
                start={start}
                windowSize={{ height, width }}
              />
            </div>
          )}
        </div>
      );
    } else {
      const width = Math.round(preWidth / 2);
      const height = Math.round((preWidth / 2) * aspectRatio);
      return (
        <div>
          {hasWindow && (
            <div>
              <PreYouTubePlayer
                videoId={videoId}
                start={start}
                windowSize={{ height, width }}
              />
            </div>
          )}
        </div>
      );
    }
  }

  if (!isHorizontally) {
    if (preWidth >= 950) {
      const height = 255;
      const width = Math.round(height / aspectRatio);
      return (
        <div>
          {hasWindow && (
            <div>
              <PreYouTubePlayer
                videoId={videoId}
                start={start}
                windowSize={{ height, width }}
              />
            </div>
          )}
        </div>
      );
    } else if (preWidth > 500) {
      const width = Math.round(0.48 * preWidth);
      const height = Math.round(0.48 * preWidth * aspectRatio);
      return (
        <div>
          {hasWindow && (
            <div>
              <PreYouTubePlayer
                videoId={videoId}
                start={start}
                windowSize={{ height, width }}
              />
            </div>
          )}
        </div>
      );
    } else {
      const width = Math.round(preHeight * 0.48);
      const height = Math.round(preHeight * 0.48 * aspectRatio);
      return (
        <div>
          {hasWindow && (
            <div>
              <PreYouTubePlayer
                videoId={videoId}
                start={start}
                windowSize={{ height, width }}
              />
            </div>
          )}
        </div>
      );
    }
  }
};

///////////// 本来あるべき姿(バグなのか動かない…nocookieでなら動く) ///////////////
type Options = React.ComponentProps<typeof YouTube>["opts"];

type YoutubePlayerProps = {
  videoId: string;
  start?: number;
  opts?: Options;
  onReady?: (event: { target: YT.Player }) => void;
  windowSize: { width: number; height: number };
};

// const onPlayerReady = (event: { target: YT.Player }) => {
// access to player in all event handlers via event.target
// event.target.pauseVideo();
// }
// onReady = onPlayerReady,

// 単一再生
export const PreYouTubePlayer: React.FC<YoutubePlayerProps> = ({
  videoId,
  start,
  windowSize,
  opts = {
    width: windowSize.width,
    height: windowSize.height,
    // width: 640, height: 360,
    playerVars: {
      autoplay: 1,
      // playing: 1,
      start: start,
      // end:,
      playsinline: 1,
      // mute: 1,
      // loop: 1,
    },
    host: "https://www.youtube-nocookie.com",
  },
}) => {
  return (
    <YouTube
      videoId={videoId}
      opts={opts}
      //  onReady={onReady}
    />
  );
};

// ///////////////////////////////////
// // // コードではどうにもならないバグが再発生したときにすぐ戻せるように保存
// type PreYouTubePlayerProps = {
//   videoId: string;
//   start: number;
//   windowSize: { width: number; height: number; }
// }

// interface YouTubePlayerState {
//   player: any;
// }

// export class PreYouTubePlayer extends React.Component<PreYouTubePlayerProps, YouTubePlayerState> {
//   private playerRef: React.RefObject<YouTube>;
//   constructor(props: PreYouTubePlayerProps) {
//     super(props);
//     this.state = {
//       player: null,
//     };
//     this.playerRef = React.createRef();
//   }

//   // renderメソッドよりも後で呼び出される
//   componentDidMount() {
//     if (this.state.player && this.props.start) {
//       this.state.player.playVideo();
//       // ↓(動画指定と同時になるので)効果なし。機能しないの意味わからん
//       this.state.player.seekTo(this.props.start);
//     }

//     // this.state.player.event.onReady()
//   }

//   // renderメソッドよりも後で呼び出される
//   componentDidUpdate(prevProps: PreYouTubePlayerProps) {
//     console.log("prevProps", prevProps)
//     if (prevProps.start !== this.props.start) {
//       this.changeTime(this.props.start); //必須
//     }
//     // ↓エラーなるのなんで… // changeTime の中身でエラー
//     //
//     // else {
//     // this.changeTime(this.props.start + 1);
//     // this.changeTime(this.props.start);
//     // }

//     // 機能するどころか(なんの挙動も示さないくせに)、
//     // ２つの動画を瞬時に1→2→1のように遷移させるとエラーとなる
//     // if (prevProps.videoId !== this.props.videoId) {
//     // this.state.player.playVideo();
//     // this.state.player.seekTo(this.props.start);

//     // ↓(動画指定と同時では)効果なし(両方)
//     // this.changeTime(0);
//     // this.state.player.seekTo(0);
//     // }
//   }

//   // この状態で、onRaedyそのものをコメントアウトすると時間セットできなくなる謎
//   onReady = (event: { target: any }) => {
//     this.setState({
//       player: event.target,
//     });
//     // event.target.playVideo();
//     event.target.seekTo(this.props.start);

//     // (動画指定と同時では)↓効果なし
//     // ↓効果なし
//     // event.target.seekTo(0);
//   };

//   changeTime = (start: number) => {
//     console.log('seeking to: ' + start);
//     if (this.state.player) {
//       this.state.player.playVideo();
//       this.state.player.seekTo(start); //必須

//       // ↓(動画指定と同時では)効果なし
//       // this.state.player.seekTo(0);
//     }
//   };

//   render() {
//     const { videoId } = this.props;
//     const { start: start } = this.props;
//     // console.log("this.props", this.props)
//     const opts: any = {
//       height: `${this.props.windowSize.height}`,
//       // height: '198',
//       width: `${this.props.windowSize.width}`,
//       // width: '320',
//       playerVars: {
//         // https://developers.google.com/youtube/player_parameters
//         autoplay: 1, //自動再生に必須だが、これだけだとダメな時もある様子…。
//         // start: start, //これがあると時間が上書きされる(seekToが機能しない)
//         controls: 1,
//       },
//       // startSeconds:start, //これも効果なし
//       host: 'https://www.youtube-nocookie.com'
//     };

//     return (
//       <YouTube
//         videoId={videoId}
//         opts={opts}
//         onReady={this.onReady}
//         ref={this.playerRef}
//         className={`${YouTubeTW} w-[100%]`}
//       />
//     );
//   }
// }
