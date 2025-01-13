////////////////////////////// crud data //////////////////////////////

const vtuberNamePattern = /^.{2,100}$/;
const vtuberKanaPattern = /^[a-z]+(_[a-z]*)?$/;
const introMovieUrlPattern =
  /^www\.youtube\.com\/watch\?v=[a-zA-Z0-9_\-]{11}(&t=[0-9]+[s]?)?$/;
const movieTitlePattern = /^.{2,100}$/;
export const MovieUrlPattern =
  /(^(https:\/\/)??(www\.youtube\.com\/watch\?v=|www\.youtube\.com\/live\/|youtu\.be\/)[a-zA-Z0-9_\-]{11}(&t=\d+)??$)|(^[a-zA-Z0-9_\-]{11}$)/;
// TODO: testコードを書く
// NOTE: 想定している入力値
// https://youtu.be/SHF-EJiC9qk
// youtu.be/JXEyM8oZyhg
// https://www.youtube.com/watch?v=gwgo01UVPvY&t=1342
// www.youtube.com/watch?v=77lB1lMNOvY&t=1342
// R6w92OanMD8
// https://www.youtube.com/live/4OnkujqOMx4
// www.youtube.com/live/CsOHuZLRQOs

const songNamePattern = /^.{1,100}$/;
const singStartPattern = /^[0-9]{2}:[0-9]{2}:[0-9]{2}$/;

export const ValidateCreate = {
  VtuberName: {
    required: true,
    pattern: {
      value: new RegExp(`(${vtuberNamePattern.source})`),
      message:
        "2文字以上必要です。1文字のVTueber様がいる場合はサイト運営へご連絡ください。",
    },
  },
  VtuberKana: {
    required: true,
    pattern: {
      value: new RegExp(`(${vtuberKanaPattern.source})`),
      message:
        "半角アルファベット小文字および _ １回のみ使用してください。 例: chumu_note, sumeshi",
    },
    minLength: {
      value: 2,
      message:
        "2文字以上必要です。1文字のVTueber様がいる場合はサイト運営へご連絡ください。",
    },
    maxLength: {
      value: 100,
      message: "文字数が超過しています。",
    },
  },
  IntroMovieUrl: {
    required: false,
    pattern: {
      value: new RegExp(`(${introMovieUrlPattern.source})`),
      // value: new RegExp(`(${YouTubeUrlPattern.source})|(${VideoIdPattern.source})`),
      message:
        "www.youtube.com/watch?v=xxx の形式で入力してください。(xxx部は任意の11文字)",
      // message: "https://www.youtube.com/watch?v=OB8pMKU3uxo \n www.youtube.com/watch?v=OB8pMKU3uxo \n v=OB8pMKU3uxo \n のいずれかの形式で入力してください。",
    },
  },
  MovieTitle: {
    required: true,
    pattern: {
      value: new RegExp(`(${movieTitlePattern.source})`),
      message: "動画タイトルを修正してください。(文字数エラー)",
    },
  },
  MovieUrl: {
    required: true,
    pattern: {
      value: new RegExp(`(${MovieUrlPattern.source})`),
      // value: new RegExp(`(${YouTubeUrlPattern.source})|(${VideoIdPattern.source})`),
      message: "入力値エラー",
      // message: "https://www.youtube.com/watch?v=OB8pMKU3uxo \n www.youtube.com/watch?v=OB8pMKU3uxo \n v=OB8pMKU3uxo \n のいずれかの形式で入力してください。",
    },
  },
  SongName: {
    required: true,
    pattern: {
      value: new RegExp(`(${songNamePattern.source})`),
      message: "必須項目です",
    },
  },
  SingStart: {
    required: true,
    pattern: {
      value: singStartPattern,
      // message: "hh:mm:ss, mm:ss, ss,のいずれかで入力してください。\n 例: 01:23:45, 25:01, 49 等",
      message: "hh:mm:ssの形式で入力してください。\n 例: 01:23:45, 00:00:59",
    },
  },
};

// 変換方法不明のため機能休止中
const AdjustIntroMovieUrl = (input: string) => {
  const match = input.match(
    /(?:https:\/\/www\.youtube\.com\/watch\?v=)?([a-zA-Z0-9\-]{11})(&t=[0-9]+)?/
  ); //使うなら要修正
  return match ? `www.youtube.com/watch?v=${match[1]}` : input;
};

// 変換方法不明のため機能休止中
const AdjustMovieUrl = (input: string) => {
  const match = input.match(
    /(?:https:\/\/www\.youtube\.com\/watch\?v=)?([a-zA-Z0-9\-]{11})/
  );
  return match ? `www.youtube.com/watch?v=${match[1]}` : input;
};

/////////////// edit //////////////
//  createのrequiredをfalseにしただけ

export const ValidateEdit = {
  VtuberName: {
    required: false,
    pattern: {
      value: new RegExp(`(${vtuberNamePattern.source})`),
      message:
        "2文字以上必要です。1文字のVTueber様がいる場合はサイト運営へご連絡ください。",
    },
  },
  VtuberKana: {
    required: false,
    pattern: {
      value: new RegExp(`(${vtuberKanaPattern.source})`),
      message:
        "半角アルファベット小文字および _ １回のみ使用してください。 例: chumu_note, sumeshi",
    },
    minLength: {
      value: 2,
      message:
        "2文字以上必要です。1文字のVTueber様がいる場合はサイト運営へご連絡ください。",
    },
    maxLength: {
      value: 100,
      message: "文字数が超過しています。",
    },
  },
  IntroMovieUrl: {
    required: false,
    pattern: {
      value: new RegExp(`(${introMovieUrlPattern.source})`),
      // value: new RegExp(`(${YouTubeUrlPattern.source})|(${VideoIdPattern.source})`),
      message: "www.youtube.com/watch?v=XxxXxxXxxXx の形式で入力してください。",
      // message: "https://www.youtube.com/watch?v=OB8pMKU3uxo \n www.youtube.com/watch?v=OB8pMKU3uxo \n v=OB8pMKU3uxo \n のいずれかの形式で入力してください。",
    },
  },
  MovieTitle: {
    required: false,
    pattern: {
      value: new RegExp(`(${movieTitlePattern.source})`),
      message: "動画タイトルを修正してください。(文字数エラー)",
    },
  },
  MovieUrl: {
    required: false,
    pattern: {
      value: new RegExp(`(${MovieUrlPattern.source})`),
      // value: new RegExp(`(${YouTubeUrlPattern.source})|(${VideoIdPattern.source})`),
      message: "www.youtube.com/watch?v=XxxXxxXxxXx の形式で入力してください。",
      // message: "https://www.youtube.com/watch?v=OB8pMKU3uxo \n www.youtube.com/watch?v=OB8pMKU3uxo \n v=OB8pMKU3uxo \n のいずれかの形式で入力してください。",
    },
  },
  SongName: {
    required: false,
    pattern: {
      value: new RegExp(`(${songNamePattern.source})`),
      message: "必須項目です。",
    },
  },
  SingStart: {
    required: false,
    pattern: {
      value: singStartPattern,
      // message: "hh:mm:ss, mm:ss, ss,のいずれかで入力してください。\n 例: 01:23:45, 25:01, 49 等",
      message: "hh:mm:ssの形式で入力してください。\n 例: 01:23:45, 00:00:59",
    },
  },
};

export const ValidateEditVtuberName = {
  required: false,
  pattern: {
    value: new RegExp(`(${vtuberNamePattern.source})`),
    message:
      "2文字以上必要です。1文字のVTueber様がいる場合はサイト運営へご連絡ください。",
  },
};

//////// VtuberKana
export const ValidateEditVtuberKana = {
  required: false,
  pattern: {
    value: new RegExp(`(${vtuberKanaPattern.source})`),
    message:
      "半角アルファベット小文字および _ １回のみ使用してください。 例: chumu_note, sumeshi",
  },
  minLength: {
    value: 2,
    message:
      "2文字以上必要です。1文字のVTueber様がいる場合はサイト運営へご連絡ください。",
  },
  maxLength: {
    value: 100,
    message: "文字数が超過しています。",
  },
};

//////// IntroMovieUrl
export const ValidateEditIntroMovieUrl = {
  required: false,
  pattern: {
    value: new RegExp(`(${introMovieUrlPattern.source})`),
    message: "www.youtube.com/watch?v=XxxXxxXxxXx の形式で入力してください。",
  },
};

//////// MovieTitle
export const ValidateEditMovieTitle = {
  required: false,
  pattern: {
    value: new RegExp(`(${movieTitlePattern.source})`),
    message: "動画タイトルを修正してください。(文字数エラー)",
  },
};

//////// MovieUrl
// 編集不可

//////// SongName
export const ValidateEditSongName = {
  required: false,
  pattern: {
    value: new RegExp(`(${songNamePattern.source})`),
    message: "必須項目です。",
  },
};

//////// SingStart
export const ValidateEditSingStart = {
  required: false,
  pattern: {
    value: new RegExp(`(${singStartPattern})`),
    message:
      "hh:mm:ss, mm:ss, ss,のいずれかで入力してください。\n 例: 01:23:45, 25:01, 49 等",
  },
};
