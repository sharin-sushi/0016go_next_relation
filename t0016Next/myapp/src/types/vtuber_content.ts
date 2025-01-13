import { ListenerId } from './user'

export type BasicDataProps = {
	vtubers: ReceivedVtuber[];
	vtubers_movies: ReceivedMovie[];
	vtubers_movies_karaokes: ReceivedKaraoke[];
};
export type CrudContentType = "none" | "vtuber" | "movie" | "karaoke";

export type CrudDate = {
	VtuberId: number;
	VtuberName: string;
	VtuberKana: string;
	IntroMovieUrl: string | null;
	MovieUrl: string;
	MovieTitle: string;
	KaraokeId: number;
	SingStart: string;
	SongName: string;
}
//以下、基礎の型３つ

export type VtuberId = number;
export type KaraokeId = number
export type SongId = number

export type PrimitiveVtuber = {
	VtuberId: VtuberId;
	VtuberName: string;
	VtuberKana: string;
	IntroMovieUrl: string | null;
	VtuberInputterId: string;
};

export type PrimitiveMovie = {
	MovieUrl: string;
	MovieTitle: string | null;
	VtuberId: number;
	MovieInputterId: number | null;
};

export type PrimitiveKaraoke = {
	KaraokeId: number;
	MovieUrl: string | null;
	SingStart: string;
	SongName: string | null;
	KaraokeInputterId: number | null;
};

export type PrimitiveOriginalSong = {
	SongID: SongId
	ArtistId: number
	SongName: string
	MovieUrl: string
	ReleseData: string
	SongInputterId: ListenerId;
}


//　画面表示に使う型

export type ReceivedVtuber = {
	VtuberId: VtuberId;
	VtuberName: string;
	VtuberKana: string;
	IntroMovieUrl: string | null;
	VtuberInputterId: string;

	Count: number;
	IsFav: boolean;
}

export type ReceivedMovie = {
	VtuberId: VtuberId;
	VtuberName: string;
	VtuberKana: string;
	IntroMovieUrl: string | null;
	VtuberInputterId: ListenerId;

	MovieUrl: string;
	MovieTitle: string;
	MovieInputterId: number;

	Count: number;
	IsFav: boolean;

}

export type ReceivedKaraoke = {
	VtuberId: VtuberId;
	VtuberName: string;
	VtuberKana: string;
	IntroMovieUrl: string | null;
	VtuberInputterId: ListenerId;

	MovieUrl: string;
	MovieTitle: string;
	MovieInputterId: number;

	KaraokeId: number;
	SingStart: string;
	SongName: string;
	KaraokeInputterId: number;

	Count: number;
	IsFav: boolean;
}
export type FavoriteKaraoke = {
	MovieUrl: string;
	KaraokeId: number;
}

export type FavoriteMovie = {
	MovieUrl: string;
}

