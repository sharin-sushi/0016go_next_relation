package common

import (
	"strings"

	validation "github.com/go-ozzo/ozzo-validation"
	"github.com/sharin-sushi/0016go_next_relation/domain"
)

func NormalizeVtuber(v domain.Vtuber) domain.Vtuber {
	// v.VtuberId = strings.TrimSpace(v.VtuberId)
	v.VtuberName = strings.TrimSpace(v.VtuberName)
	v.IntroMovieUrl = strings.TrimSpace(v.IntroMovieUrl)
	v.VtuberKana = strings.TrimSpace(v.VtuberKana)
	// v.VtuberInputterId = strings.TrimSpace(v.VtuberInputterId)
	return v
}

func ValidateVtuber(k domain.Vtuber) error {
	err := validation.ValidateStruct(k)
	return err
}

func NomalizeMovie(m domain.Movie) domain.Movie {
	// m.VtuberId = strings.TrimSpace(m.SingStart)
	m.MovieTitle = strings.TrimSpace(m.MovieTitle)
	m.MovieUrl = strings.TrimSpace(m.MovieUrl)
	// m.MovieInputterId = strings.TrimSpace(m.MovieInputterId)
	return m
}

func ValidateMovie(k domain.Movie) error {
	err := validation.ValidateStruct(k)
	return err
}

func NormalizeKaraoke(k domain.Karaoke) domain.Karaoke {
	// k.VtuberId = strings.TrimSpace(k.VtuberId)
	k.MovieUrl = strings.TrimSpace(k.MovieUrl)
	k.SingStart = strings.TrimSpace(k.SingStart)
	k.SongName = strings.TrimSpace(k.SongName)
	// k.KaraokeInputterId = strings.TrimSpace(k.KaraokeInputterId)
	return k
}

func ValidateKaraoke(k domain.Karaoke) error {
	err := validation.ValidateStruct(k,
		validation.Field(k.KaraokeInputterId,
			validation.Required.Error("karaoke inputter id is required"),
		),
		validation.Field(k.MovieUrl,
			validation.Required.Error("movie url is required"),
			validation.Length(4, 20).Error("Password needs 4 ~ 20 chars"),
		),
		validation.Field(k.SingStart,
			validation.Required.Error("sing start is required"),
			validation.Length(4, 20).Error("sing start needs 8"),
		),
		validation.Field(k.SongName,
			validation.Required.Error("song name is required"),
		),
	)
	return err
}
