import React, { useContext, useEffect, useState, createContext } from "react";
import Link from "next/link";
import YouTube from "react-youtube";

type YouTubePlayerProps = {
  videoId: string;
  time: number;
};

interface YouTubePlayerState {
  player: any;
}

class YouTubePlayer extends React.Component<
  YouTubePlayerProps,
  YouTubePlayerState
> {
  private playerRef: React.RefObject<YouTube>;
  // time = this.props.time
  constructor(props: YouTubePlayerProps) {
    console.log("props(super前)", props); // 0
    console.log("props.time", props.time);
    console.log("props.videoId", props.videoId);

    // 親クラスのコンストラクタを呼び出せる。
    // 結果として、propsを初期化するので、Reactコンポーネントのthis.propsプロパティを使える。
    // といいつつ、console.logした結果、前後で変化見られず。
    super(props);

    console.log("props (super後)", props);

    this.state = {
      player: null,
    };

    this.playerRef = React.createRef();
  }

  // renderメソッドよりも後で呼び出される
  componentDidMount() {
    if (this.state.player && this.props.time) {
      this.state.player.playVideo();
      // ↓(動画指定と同時になるので)効果なし
      // this.state.player.seekTo(0);

      // ↓これ機能しないの意味わからん
      // this.state.player.seekTo(this.props.time);
    }
    // this.state.player.event.onReady()
  }

  // renderメソッドよりも後で呼び出される
  // 機能してない？？？？
  componentDidUpdate(prevProps: YouTubePlayerProps) {
    // 機能するどころか(なんの挙動も示さないくせに)、
    // ２つの動画を瞬時に1→2→1のように遷移させるとエラーとなる
    // if (prevProps.videoId !== this.props.videoId) {
    // this.state.player.playVideo();
    // this.state.player.seekTo(this.props.time);

    // ↓(動画指定と同時では)効果なし(両方)
    // this.changeTime(0);
    // this.state.player.seekTo(0);
    // }
    if (prevProps.time !== this.props.time) {
      this.changeTime(this.props.time); //必須
    }
  }

  // どこかで使えると思うんだけど…
  // this.state.player.loadVideoById({
  //     vudeoId: this.props.videoId,
  //     startSeconds: this.props.time
  // })

  // この状態で、onRaedyそのものをコメントアウトすると時間セットできなくなる謎
  onReady = (event: { target: any }) => {
    this.setState({
      player: event.target,
    });
    // event.target.playVideo();
    event.target.seekTo(this.props.time);

    // (動画指定と同時では)↓効果なし
    // ↓効果なし
    // event.target.seekTo(0);
  };

  changeTime = (time: number) => {
    console.log("seeking to: " + time);
    if (this.state.player) {
      this.state.player.playVideo();
      this.state.player.seekTo(time); //必須

      // ↓(動画指定と同時では)効果なし(動画指定と同時では)
      // this.state.player.seekTo(0);
    }
  };

  render() {
    const { videoId } = this.props;
    const { time } = this.props;
    console.log("this.props", this.props);
    const opts: any = {
      width: "560",
      height: "315",
      playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay: 1, //自動再生に必須だが、これだけだとダメな時もある様子…。
        // start: time, //これがあると時間が上書きされる(seekToが機能しない)
        controls: 1,
      },
      // startSeconds:time, //これも効果なし
    };

    return (
      <div>
        <YouTube
          videoId={videoId}
          opts={opts}
          onReady={this.onReady}
          ref={this.playerRef}
        />
      </div>
    );
  }
}
