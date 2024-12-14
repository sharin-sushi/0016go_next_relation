package database

import (
	"fmt"

	"github.com/sharin-sushi/0016go_next_relation/domain"
)

type FavoriteRepository struct {
	SqlHandler
}

func (db *FavoriteRepository) CountMovieFavorites() ([]domain.TransmitMovie, error) {
	fmt.Print("interfaces/database/favorite.go\n")
	var fav domain.Favorite
	var favCnt []domain.TransmitMovie
	err := db.Model(&fav).Select("movie_url").Where("karaoke_id = 0").Group("movie_url").Find(&favCnt).Error
	if err != nil {
		return favCnt, err
	}
	return favCnt, err
}

func (db *FavoriteRepository) CountKaraokeFavorites() ([]domain.TransmitKaraoke, error) {
	fmt.Print("interfaces/database/favorite.go \n")
	var fav domain.Favorite
	var favCnt []domain.TransmitKaraoke
	err := db.Model(&fav).Select("karaoke_id").Where("where karaoke_id != 0").Group("karoke_list_id").Find(&favCnt).Error
	if err != nil {
		return nil, err
	}
	return favCnt, err
}

func (db *FavoriteRepository) DeleteMovieFavorite(fav domain.Favorite) error {
	fmt.Print("interfaces/database/favorite.go\n")
	whereQu := fmt.Sprintf("listener_id = %v AND movie_url = '%v' AND karaoke_id = 0", fav.ListenerId, fav.MovieUrl)
	err := db.Where(whereQu).Delete(&fav).Error
	fmt.Print("check\n")
	if err != nil {
		return err
	}
	fmt.Print("check2 \n")

	return err
}

func (db *FavoriteRepository) DeleteKaraokeFavorite(fav domain.Favorite) error {
	fmt.Print("interfaces/database/favorite.go\n")
	whereQu := fmt.Sprintf("listener_id = %v AND movie_url = '%v' AND karaoke_id = %v", fav.ListenerId, fav.MovieUrl, fav.KaraokeId)
	err := db.Where(whereQu).Delete(&fav).Error
	if err != nil {
		return err
	}
	return err
}

func (db *FavoriteRepository) GetVtubersMoviesWithFavCnts() ([]domain.TransmitMovie, error) {
	fmt.Print("interfaces/database/favorite.go \n")
	var TmMos []domain.TransmitMovie
	var err error

	var vt domain.Vtuber
	selectQu1 := "vtubers.vtuber_id, vtubers.vtuber_name, vtubers.vtuber_kana, vtubers.intro_movie_url, vtubers.vtuber_inputter_id"
	selectQu2 := "m.movie_url, m.movie_title, m.movie_inputter_id"
	selectQu3 := "COUNT(f.movie_url) AS count "
	joinQu1 := "LEFT JOIN movies as m USING(vtuber_id)"
	joinQu2 := "LEFT JOIN favorites as f ON m.movie_url = f.movie_url AND f.karaoke_id = 0  AND f.deleted_at IS NULL"
	joinQu := fmt.Sprint(joinQu1, joinQu2)
	whereQu := "m.movie_url IS NOT NULL "
	groupQu := "m.movie_url, vtubers.vtuber_id"
	err = db.Model(vt).Select(selectQu1, selectQu2, selectQu3).
		Joins(joinQu).Where(whereQu).Group(groupQu).
		Scan(&TmMos).Error
	if err != nil {
		return nil, err
	}
	return TmMos, nil
}

func (db *FavoriteRepository) GetVtubersMoviesKaraokesWithFavCnts() ([]domain.TransmitKaraoke, error) {
	fmt.Print("interfaces/database/favorite.go \n")
	var TmKas []domain.TransmitKaraoke
	var err error

	var vt domain.Vtuber
	selectQu1 := "vtubers.vtuber_id, vtubers.vtuber_name, vtubers.vtuber_kana, vtubers.intro_movie_url, vtubers.vtuber_inputter_id "
	selectQu2 := "m.movie_url, m.movie_title, m.movie_inputter_id "
	selectQu3 := "k.karaoke_id, k.sing_start, k.song_name, k.karaoke_inputter_id "
	selectQu4 := "COUNT(f.karaoke_id) AS count"
	joinQu1 := "LEFT JOIN movies as m USING(vtuber_id) "
	joinQu2 := "LEFT JOIN karaokes as k ON m.movie_url = k.movie_url "
	joinQu3 := "LEFT JOIN favorites as f ON k.karaoke_id = f.karaoke_id AND f.karaoke_id != 0  AND f.deleted_at IS NULL"
	joinQu := fmt.Sprint(joinQu1, joinQu2, joinQu3)
	whereQu := "m.movie_url IS NOT NULL AND k.karaoke_id != 0 "
	groupQu := "k.karaoke_id"
	err = db.Model(vt).Select(selectQu1, selectQu2, selectQu3, selectQu4).
		Joins(joinQu).Where(whereQu).Group(groupQu).
		Scan(&TmKas).Error
	if err != nil {
		return nil, err
	}
	return TmKas, nil
}

func (db *FavoriteRepository) GetVtubersMoviesKaraokesByVtuerKanaWithFavCnts(kana string) ([]domain.TransmitKaraoke, error) {
	fmt.Print("interfaces/database/favorite.go \n")
	var TmKas []domain.TransmitKaraoke
	var err error

	var vt domain.Vtuber
	selectQu1 := "vtubers.vtuber_id, vtubers.vtuber_name, vtubers.vtuber_kana, vtubers.intro_movie_url, vtubers.vtuber_inputter_id "
	selectQu2 := "m.movie_url, m.movie_title, m.movie_inputter_id "
	selectQu3 := "k.karaoke_id, k.sing_start, k.song_name, k.karaoke_inputter_id "
	selectQu4 := "COUNT(f.karaoke_id) AS count"
	joinQu1 := "LEFT JOIN movies as m USING(vtuber_id) "
	joinQu2 := "LEFT JOIN karaokes as k ON m.movie_url = k.movie_url "
	joinQu3 := "LEFT JOIN favorites as f ON k.karaoke_id = f.karaoke_id AND f.karaoke_id != 0  AND f.deleted_at IS NULL"
	joinQu := fmt.Sprint(joinQu1, joinQu2, joinQu3)
	whereQu := fmt.Sprintf("vtubers.vtuber_kana = \"%v\" AND m.movie_url IS NOT NULL AND k.karaoke_id != 0 ", kana)
	groupQu := "k.karaoke_id"
	err = db.Model(vt).Select(selectQu1, selectQu2, selectQu3, selectQu4).
		Joins(joinQu).Where(whereQu).Group(groupQu).
		Scan(&TmKas).Error
	if err != nil {
		return nil, err
	}
	return TmKas, nil
}

func (db *FavoriteRepository) GetLatest50VtubersMoviesKaraokesWithFavCnts(guestId domain.ListenerId) ([]domain.TransmitKaraoke, error) {
	fmt.Print("interfaces/database/favorite.go \n")
	var TmKas []domain.TransmitKaraoke
	var err error

	var vt domain.Vtuber
	selectQu1 := "vtubers.vtuber_id, vtubers.vtuber_name, vtubers.vtuber_kana, vtubers.intro_movie_url, vtubers.vtuber_inputter_id "
	selectQu2 := "m.movie_url, m.movie_title, m.movie_inputter_id "
	selectQu3 := "k.karaoke_id, k.sing_start, k.song_name, k.karaoke_inputter_id "
	selectQu4 := "COUNT(f.karaoke_id) AS count"
	joinQuA := "LEFT JOIN movies as m USING(vtuber_id) "
	joinQuB := "LEFT JOIN karaokes as k ON m.movie_url = k.movie_url "
	joinQuC := "LEFT JOIN favorites as f ON k.karaoke_id = f.karaoke_id AND f.karaoke_id != 0  AND f.deleted_at IS NULL"
	joinQu1 := fmt.Sprint(joinQuA, joinQuB)
	joinQu2 := fmt.Sprint(joinQuC)
	whereQu1 := fmt.Sprint("k.karaoke_inputter_id != ", guestId)
	whereQu2 := "m.movie_url IS NOT NULL AND k.karaoke_id != 0 "
	groupQu := "k.karaoke_id"
	orderQu := "`k`.`karaoke_id` DESC"
	limitQu := 50
	err = db.Model(vt).Select(selectQu1, selectQu2, selectQu3, selectQu4).
		Joins(joinQu1).Where(whereQu1).Joins(joinQu2).Where(whereQu2).Group(groupQu).Order(orderQu).Limit(limitQu).
		Scan(&TmKas).Error
	if err != nil {
		return nil, err
	}
	return TmKas, nil
}

func (db *FavoriteRepository) FindFavoritesCreatedByListenerId(lId domain.ListenerId) ([]domain.ReceivedFavorite, error) {
	fmt.Print("interfaces/database/favorite_db.go \n")
	var favs []domain.Favorite
	var receivedfavs []domain.ReceivedFavorite

	result := db.Select("id, listener_id, movie_url, karaoke_id").Where("listener_id=?", lId).Model(&favs).Scan(&receivedfavs)
	fmt.Printf("recfavs:\n %+v\n", receivedfavs)
	fmt.Printf("&recfavs:\n%+v\n", &receivedfavs)
	return receivedfavs, result.Error
}

func (db *FavoriteRepository) FindFavoriteUnscopedByFavOrUnfavRegistry(fav domain.Favorite) domain.Favorite {
	fmt.Print("interfaces/database/favorite.go\n")
	whereQu := fmt.Sprintf("listener_id = '%v' AND movie_url = '%v' AND karaoke_id = '%v'", fav.ListenerId, fav.MovieUrl, fav.KaraokeId)
	err := db.Unscoped().Where(whereQu).First(&fav).Error
	fmt.Printf("FindFavoriteUnscopedByFavOrUnfavRegistry got err=%v\n", err)
	return fav
}

func (db *FavoriteRepository) CreateMovieFavorite(fav domain.Favorite) error {
	fmt.Print("interfaces/database/favorite.go\n")
	err := db.Create(&fav).Error
	if err != nil {
		return err
	}
	return err
}

func (db *FavoriteRepository) CreateKaraokeFavorite(fav domain.Favorite) error {
	fmt.Print("interfaces/database/favorite.go\n")
	err := db.Create(&fav).Error
	if err != nil {
		return err
	}
	return err
}

func (db *FavoriteRepository) UpdateMovieFavorite(fav domain.Favorite) error {
	fmt.Print("interfaces/database/favorite.go\n")
	err := db.Unscoped().Model(fav).Update("deleted_at", nil).Error
	if err != nil {
		return err
	}
	return err
}

func (db *FavoriteRepository) UpdateKaraokeFavorite(fav domain.Favorite) error {
	fmt.Print("interfaces/database/favorite.go\n")
	whereQu := fmt.Sprintf("listener_id = '%v' AND movie_url = '%v' AND karaoke_id = %v", fav.ListenerId, fav.MovieUrl, fav.KaraokeId)
	err := db.Unscoped().Model(fav).Where(whereQu).Update("deleted_at", nil).Error
	if err != nil {
		return err
	}
	return err
}

// 使ってない？
func (db *FavoriteRepository) FindVtubersCreatedByListenerId(lId domain.ListenerId) ([]domain.Vtuber, error) {
	fmt.Print("interfaces/database/favorite.go \n")
	var vts []domain.Vtuber
	err := db.Where("vtuber_inputter_id = ?", lId).Find(&vts).Error
	if err != nil {
		return vts, err
	}
	return vts, nil
}

func (db *FavoriteRepository) FindMoviesCreatedByListenerId(lId domain.ListenerId) ([]domain.TransmitMovie, error) {
	fmt.Print("interfaces/database/favorite.go \n")
	var TmMos []domain.TransmitMovie
	var err error

	var vt domain.Vtuber
	selectQu1 := "vtubers.vtuber_id, vtubers.vtuber_name, vtubers.vtuber_kana, vtubers.intro_movie_url, vtubers.vtuber_inputter_id"
	selectQu2 := "m.movie_url, m.movie_title, m.movie_inputter_id"
	selectQu3 := "COUNT(f.movie_url) AS count "
	joinQu1 := "LEFT JOIN movies as m USING(vtuber_id)"
	joinQu2 := "LEFT JOIN favorites as f ON m.movie_url = f.movie_url AND f.karaoke_id = 0  AND f.deleted_at IS NULL"
	joinQu := fmt.Sprint(joinQu1, joinQu2)
	whereQu := fmt.Sprintf("m.movie_url IS NOT NULL AND m.movie_inputter_id = %v", lId)
	groupQu := "m.movie_url, vtubers.vtuber_id"
	err = db.Model(vt).Select(selectQu1, selectQu2, selectQu3).
		Joins(joinQu).Where(whereQu).Group(groupQu).
		Scan(&TmMos).Error
	if err != nil {
		return nil, err
	}
	return TmMos, nil
}

func (db *FavoriteRepository) FindKaraokesCreatedByListenerId(lId domain.ListenerId) ([]domain.TransmitKaraoke, error) {
	fmt.Print("interfaces/database/favorite.go \n")
	var TmKas []domain.TransmitKaraoke
	var err error

	var vt domain.Vtuber
	selectQu1 := "vtubers.vtuber_id, vtubers.vtuber_name, vtubers.vtuber_kana, vtubers.intro_movie_url, vtubers.vtuber_inputter_id "
	selectQu2 := "m.movie_url, m.movie_title, m.movie_inputter_id "
	selectQu3 := "k.karaoke_id, k.sing_start, k.song_name, k.karaoke_inputter_id "
	selectQu4 := "COUNT(f.karaoke_id) AS count"
	joinQu1 := "LEFT JOIN movies as m USING(vtuber_id) "
	joinQu2 := "LEFT JOIN karaokes as k ON m.movie_url = k.movie_url "
	joinQu3 := "LEFT JOIN favorites as f ON k.karaoke_id = f.karaoke_id AND f.karaoke_id != 0  AND f.deleted_at IS NULL"
	joinQu := fmt.Sprint(joinQu1, joinQu2, joinQu3)
	whereQu := fmt.Sprintf("m.movie_url IS NOT NULL AND k.karaoke_id != 0 AND k.karaoke_inputter_id = %v", lId)
	groupQu := "k.karaoke_id"
	err = db.Model(vt).Select(selectQu1, selectQu2, selectQu3, selectQu4).
		Joins(joinQu).Where(whereQu).Group(groupQu).
		Scan(&TmKas).Error
	if err != nil {
		return nil, err
	}
	return TmKas, nil
}
func (db *FavoriteRepository) FindMoviesFavoritedByListenerId(lId domain.ListenerId) ([]domain.TransmitMovie, error) {
	fmt.Print("interfaces/database/favorite.go\n")
	var Mos []domain.Movie
	var tmMos []domain.TransmitMovie
	var err error
	joinsQOfVtsMos := "LEFT JOIN vtubers USING(vtuber_id)"
	whereOfVtsMos := fmt.Sprintf("where movies.inputter_listener_id = %v", lId)
	err = db.Model(Mos).Where(whereOfVtsMos).Joins(joinsQOfVtsMos).Scan(&tmMos).Error
	if err != nil {
		return nil, err
	}
	return tmMos, err
}
func (db *FavoriteRepository) FindKaraokesFavoritedByListenerId(lId domain.ListenerId) ([]domain.TransmitKaraoke, error) {
	fmt.Print("interfaces/database/favorite.go\n")
	var err error
	var tmKas []domain.TransmitKaraoke
	var Kas []domain.Karaoke
	var VtsMosKas []domain.VtuberMovieKaraoke
	joinsQOfVtsMosKas := "LEFT JOIN movies USING(movie_url) LEFT JOIN vtubers USING(vtuber_id)"
	whereOfVtsMosKas := fmt.Sprintf("where karaoke_lists.inputter_listener_id = %v", lId)
	err = db.Model(Kas).Where(whereOfVtsMosKas).Joins(joinsQOfVtsMosKas).Scan(&VtsMosKas).Error
	if err != nil {
		return nil, err
	}
	return tmKas, err
}
