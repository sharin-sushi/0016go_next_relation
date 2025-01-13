package database

import (
	"fmt"

	"github.com/sharin-sushi/0016go_next_relation/domain"
)

type VtuberContentRepository struct {
	SqlHandler
}

func (db *VtuberContentRepository) GetVtubers() ([]domain.Vtuber, error) {
	fmt.Print("interfaces/database/vtuber_content_db.go \n")
	var vts []domain.Vtuber
	err := db.Find(&vts).Error
	if err != nil {
		return nil, err
	}
	return vts, nil
}

func (db *VtuberContentRepository) GetMovies() ([]domain.Movie, error) {
	fmt.Print("interfaces/database/vtuber_content_db.go \n")
	var mos []domain.Movie
	err := db.Find(&mos).Error
	if err != nil {
		return nil, err
	}
	return mos, nil
}

func (db *VtuberContentRepository) GetKaraokes() ([]domain.Karaoke, error) {
	fmt.Print("interfaces/database/vtuber_content_db.go \n")
	var Kas []domain.Karaoke
	err := db.Find(&Kas).Error
	if err != nil {
		return nil, err
	}
	return Kas, nil
}

func (db *VtuberContentRepository) GetMoviesUrlTitleByVtuber(id domain.VtuberId) ([]domain.Movie, error) {
	fmt.Print("interfaces/database/vtuber_content_db.go \n")
	var mos []domain.Movie
	selectQ := "movie_url, movie_title"
	whereQ := fmt.Sprint("vtuber_id = ", id)
	err := db.Select(selectQ).Where(whereQ).Find(&mos).Error
	if err != nil {
		return nil, err
	}
	return mos, nil
}

func (db *VtuberContentRepository) GetVtubersMovies() ([]domain.VtuberMovie, error) {
	fmt.Print("interfaces/database/vtuber_content_db.go \n")
	var mos []domain.Movie
	var VtsMos []domain.VtuberMovie
	selectQ := "vtuber_id, vtuber_name,  movie_url, movie_title"
	joinsQ := "LEFT JOIN vtubers USING(vtuber_id)"
	err := db.Model(mos).Select(selectQ).Joins(joinsQ).Scan(&VtsMos).Error
	if err != nil {
		return nil, err
	}
	return VtsMos, nil
}

func (db *VtuberContentRepository) GetVtubersMoviesKaraokes() ([]domain.TransmitKaraoke, error) {
	fmt.Print("interfaces/database/vtuber_content_db.go \n")
	var kas []domain.Karaoke
	var vtsMosKas []domain.TransmitKaraoke
	joinsQ := "LEFT JOIN movies USING(movie_url) LEFT JOIN vtubers USING(vtuber_id)"
	err := db.Model(kas).Joins(joinsQ).Scan(&vtsMosKas).Error
	if err != nil {
		return nil, err
	}
	return vtsMosKas, nil
}

func (db *VtuberContentRepository) CreateVtuber(V domain.Vtuber) error {
	fmt.Print("interfaces/database/vtuber_content_db.go \n")
	result := db.Omit("vtuber_id").Create(&V) //vtuber_idのみAUTO INCREMENT
	return result.Error
}

func (db *VtuberContentRepository) CreateMovie(M domain.Movie) error {
	fmt.Print("interfaces/database/vtuber_content_db.go \n")
	var v domain.Vtuber
	v.VtuberId = M.VtuberId
	fmt.Printf("2-1:%v \n", v.VtuberId)
	if result := db.First(&v); result.Error != nil {
		fmt.Printf("V:%v", v)
		return result.Error
	}
	result := db.Create(&M)
	fmt.Printf("2-2:%v \n", M)
	return result.Error
}

func (db *VtuberContentRepository) CreateKaraoke(K domain.Karaoke) error {
	fmt.Print("interfaces/database/vtuber_content_db.go \n")
	var mo domain.Movie
	mo.MovieUrl = K.MovieUrl
	if result := db.First(&mo); result.Error != nil {
		return result.Error
	}
	result := db.Create(&K)
	return result.Error
}

func (db *VtuberContentRepository) UpdateVtuber(V domain.Vtuber) error {
	fmt.Print("interfaces/database/vtuber_content_db.go \n")
	result := db.Model(&V).Where("vtuber_id = ?", V.VtuberId).Updates(&V)
	return result.Error
}

func (db *VtuberContentRepository) UpdateMovie(M domain.Movie) error {
	fmt.Print("interfaces/database/vtuber_content_db.go \n")
	var Mo domain.Vtuber
	result := db.Model(&Mo).Where("Movie_url = ?", M.MovieUrl).Updates(&M)

	return result.Error
}

func (db *VtuberContentRepository) UpdateKaraoke(K domain.Karaoke) error {
	fmt.Print("interfaces/database/vtuber_content_db.go \n")
	var Ka domain.Karaoke
	result := db.Model(&Ka).Where("karaoke_id = ?", K.KaraokeId).Updates(&K)

	return result.Error
}

func (db *VtuberContentRepository) DeleteVtuber(V domain.Vtuber) error {
	fmt.Print("interfaces/database/vtuber_content_db.go \n")
	var Mo domain.Movie
	db.Where("vtuber_id = ? ", V.VtuberId).First(&Mo)
	fmt.Print("Mo", Mo, "\n")
	if Mo.MovieUrl != "" {
		return fmt.Errorf("delete Vtuber after its Movie ")
	}
	result := db.Where("vtuber_name = ?", V.VtuberName).Delete(V) //フロント側の表示バグ対策でPK+αで絞込み
	return result.Error
}

func (db *VtuberContentRepository) DeleteMovie(M domain.Movie) error {
	fmt.Print("interfaces/database/vtuber_content_db.go \n")
	var Ka domain.Karaoke
	Ka.MovieUrl = M.MovieUrl
	db.First(&Ka)
	if Ka.KaraokeId != 0 {
		return fmt.Errorf("delete Vtuber after its Movie ")
	}
	result := db.Where("movie_title = ?", M.MovieTitle).Delete(M) //フロント側の表示バグ対策でPK+αで絞込み
	return result.Error
}

func (db *VtuberContentRepository) DeleteKaraoke(K domain.Karaoke) error {
	fmt.Print("interfaces/database/vtuber_content_db.go \n")
	result := db.Where("song_name = ?", K.SongName).Delete(K) //フロント側の表示バグ対策でPK+αで絞込み
	return result.Error
}

func (db *VtuberContentRepository) VerifyUserModifyVtuber(id domain.ListenerId, V domain.Vtuber) (bool, error) {
	fmt.Print("interfaces/database/vtuber_content_db.go \n")
	result := db.Where("vtuber_Inputter_id=?", id).First(&V)
	return V.VtuberInputterId == id, result.Error
}

func (db *VtuberContentRepository) VerifyUserModifyMovie(id domain.ListenerId, M domain.Movie) (bool, error) {
	fmt.Print("interfaces/database/vtuber_content_db.go \n")
	result := db.Where("movie_Inputter_id=?", id).First(&M, M.MovieUrl)
	return M.MovieInputterId == id, result.Error
}

func (db *VtuberContentRepository) VerifyUserModifyKaraoke(id domain.ListenerId, K domain.Karaoke) (bool, error) {
	fmt.Print("interfaces/database/vtuber_content_db.go \n")
	fmt.Printf("k: %v\n", K)
	result := db.Where("karaoke_Inputter_id=?", id).First(&K)
	fmt.Printf("k: %v", K)

	return K.KaraokeInputterId == id, result.Error
}
