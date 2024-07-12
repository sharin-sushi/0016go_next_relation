package common

import (
	"reflect"
	"testing"

	"github.com/sharin-sushi/0016go_next_relation/domain"
)

func TestAddIsFavToMovieWithFav(t *testing.T) {
	cases := map[string]struct {
		mosWithFavCnts []domain.TransmitMovie
		myFavs         []domain.ReceivedFavorite
		want           []domain.TransmitMovie
	}{
		"成功IsFav:true, false": {
			mosWithFavCnts: []domain.TransmitMovie{
				{Vtuber: domain.Vtuber{VtuberName: "Vtuber1"}, MovieUrl: "url1", Count: 1},
				{Vtuber: domain.Vtuber{VtuberName: "Vtuber2"}, MovieUrl: "url2", Count: 2},
				{Vtuber: domain.Vtuber{VtuberName: "Vtuber3"}, MovieUrl: "url3", Count: 3},
			},
			myFavs: []domain.ReceivedFavorite{
				{MovieUrl: "url1"},
				{MovieUrl: "url3"},
			},
			want: []domain.TransmitMovie{
				{Vtuber: domain.Vtuber{VtuberName: "Vtuber1"}, MovieUrl: "url1", Count: 1, IsFav: true},
				{Vtuber: domain.Vtuber{VtuberName: "Vtuber2"}, MovieUrl: "url2", Count: 2, IsFav: false},
				{Vtuber: domain.Vtuber{VtuberName: "Vtuber3"}, MovieUrl: "url3", Count: 3, IsFav: true},
			},
		},
	}
	for name, tt := range cases {
		t.Run(name, func(t *testing.T) {
			if got := AddIsFavToMovieWithFav(tt.mosWithFavCnts, tt.myFavs); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("\ngot = %v,\nwant %v", got, tt.want)
			}
		})
	}
}

func TestAddIsFavToKaraokeWithFav(t *testing.T) {

	cases := map[string]struct {
		kasWithFavCnts []domain.TransmitKaraoke
		myFavs         []domain.ReceivedFavorite
		want           []domain.TransmitKaraoke
	}{
		"成功IsFav:true, false": {
			kasWithFavCnts: []domain.TransmitKaraoke{
				{Vtuber: domain.Vtuber{VtuberName: "Vtuber1"}, MovieUrl: "url1", KaraokeId: 10, Count: 1},
				{Vtuber: domain.Vtuber{VtuberName: "Vtuber1"}, MovieUrl: "url1", KaraokeId: 11, Count: 11},
				{Vtuber: domain.Vtuber{VtuberName: "Vtuber2"}, MovieUrl: "url2", KaraokeId: 20, Count: 2},
				{Vtuber: domain.Vtuber{VtuberName: "Vtuber3"}, MovieUrl: "url3", KaraokeId: 30, Count: 3},
			},
			myFavs: []domain.ReceivedFavorite{
				{KaraokeId: 10},
				{KaraokeId: 30},
			},
			want: []domain.TransmitKaraoke{
				{Vtuber: domain.Vtuber{VtuberName: "Vtuber1"}, MovieUrl: "url1", KaraokeId: 10, Count: 1, IsFav: true},
				{Vtuber: domain.Vtuber{VtuberName: "Vtuber1"}, MovieUrl: "url1", KaraokeId: 11, Count: 11, IsFav: false},
				{Vtuber: domain.Vtuber{VtuberName: "Vtuber2"}, MovieUrl: "url2", KaraokeId: 20, Count: 2, IsFav: false},
				{Vtuber: domain.Vtuber{VtuberName: "Vtuber3"}, MovieUrl: "url3", KaraokeId: 30, Count: 3, IsFav: true},
			},
		},
	}
	for name, tt := range cases {
		t.Run(name, func(t *testing.T) {
			if got := AddIsFavToKaraokeWithFav(tt.kasWithFavCnts, tt.myFavs); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("\ngot = %v,\nwant %v", got, tt.want)
			}
		})
	}
}
