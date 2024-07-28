package domain

// VTuber Contents
type VtuberId int
type Vtuber struct {
	VtuberId         VtuberId   `gorm:"primaryKey;type:int(11)"`          //`json:"vtuber_id"`
	VtuberName       string     `gorm:"type:varchar(50);not null;unique"` //`json:"vtuver_name"`
	VtuberKana       string     `gorm:"type:varchar(50);not null;unique"` //`json:"vtuber_kana"`
	IntroMovieUrl    string     `gorm:"type:varchar(100)"`                //`json:"vtuber_intro_movie_url"`
	VtuberInputterId ListenerId `gorm:"type:int(11);not null"`            //`json:"vtuber_inputter_id"`
}

// v2にてVideoへ変更予定
type Movie struct {
	MovieUrl        string     `gorm:"primaryKey;type:varchar(100)"` //`json:"movie_url"`
	MovieTitle      string     `gorm:"type:varchar(200);not null"`   //`json:"movie_title"`
	VtuberId        VtuberId   `gorm:"type:int(11);not null"`        //`json:"vtuber_id"`
	MovieInputterId ListenerId `gorm:"type:int(11);not null"`        //`json:"movie_inputter_id"` /new
}

type KaraokeId int

// v2にてSongへ変更予定
type Karaoke struct {
	KaraokeId         KaraokeId  `gorm:"primaryKey;type:int(11)"`                           //`json:"id"`
	MovieUrl          string     `gorm:"type:varchar(100);uniqueIndex:karaoke_uq;not null"` //`json:"movie_url"`
	SingStart         string     `gorm:"type:time(0);uniqueIndex:karaoke_uq"`               //`json:"sing_start"`
	SongName          string     `gorm:"type:varchar(100)"`                                 //`json:"song_name"`
	KaraokeInputterId ListenerId `gorm:"type:int(11)"`                                      //`json:"inputter_id"`
}

type VtuberMovie struct {
	Vtuber
	Movie
}

type VtuberMovieKaraoke struct {
	Movie
	Karaoke
}

// 以下、v2用
type VideoCategory int8
type VideoId int
type SongId int

// TODO : 実装後回し
type KaraokeVideo struct {
	VideoId         VideoId       `gorm:"primaryKey;type:int(11)"`
	Category        VideoCategory `gorm:"type:tinyint";not null`
	Url             string        `gorm:"primaryKey;type:varchar(100)"`
	name            string        `gorm:"type:varchar(200);not null"`
	VtuberId        VtuberId      `gorm:"type:int(11);not null"`
	InputListenerId ListenerId    `gorm:"type:int(11);not null"`
}

// TODO : 実装後回し
type LiveVideo struct {
	VideoId         VideoId       `gorm:"primaryKey;type:int(11)"`
	Category        VideoCategory `gorm:"type:tinyint";not null`
	MovieUrl        string        `gorm:"primaryKey;type:varchar(100)"`
	MovieTitle      string        `gorm:"type:varchar(200);not null"`
	VtuberId        VtuberId      `gorm:"type:int(11);not null"`
	InputListenerId ListenerId    `gorm:"type:int(11);not null"`
}

// 収録数１曲の動画
type SingleSongsVideo struct {
	VideoId         VideoId       `gorm:"primaryKey;type:int(11)"`
	Category        VideoCategory `gorm:"type:tinyint";not null`
	Url             string        `gorm:"primaryKey;type:varchar(100)"`
	Name            string        `gorm:"type:varchar(200);not null"`
	VtuberId        VtuberId      `gorm:"type:int(11);not null"`
	InputListenerId ListenerId    `gorm:"type:int(11);not null"`
}

// frontと共通にすること
const (
	// 使用しない
	VIDEO_CATEGORY_UNSPECIFIED VideoCategory = 0

	//// SINGLE_SONG_VIDEO
	// 使用予定は無い
	VIDEO_CATEGORY_SINGLE_SONG_VIDEO_UNSPECIFIED VideoCategory = 10
	//　オリ曲動画用
	VIDEO_CATEGORY_SINGLE_SONG_VIDEO_ORIGINAL_SONG VideoCategory = 11
	// 歌ってみた動画用
	VIDEO_CATEGORY_SINGLE_SONG_VIDEO_COVERD_SONG VideoCategory = 12

	//// MULTIPLE_SONGS_VIDEO
	// 使用予定は無い
	VIDEO_CATEGORY_MULTIPLE_SONGS_VIDEO_UNSPECIFIED VideoCategory = 30
	// カラオケ動画用
	VIDEO_CATEGORY_MULTIPLE_SONGS_VIDEO_KARAOKE VideoCategory = 31
	// ライブ動画用
	VIDEO_CATEGORY_MULTIPLE_SONGS_VIDEO_LIVE VideoCategory = 32
)
