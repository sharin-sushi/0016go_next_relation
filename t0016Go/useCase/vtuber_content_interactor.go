package useCase

import (
	"github.com/sharin-sushi/0016go_next_relation/domain"
	"github.com/sharin-sushi/0016go_next_relation/interfaces/v1/controllers/common"
)

type VtuberContentInteractor struct {
	VtuberContentRepository VtuberContentRepository
	UserRepository          UserRepository
	FavoriteRepository      FavoriteRepository
	OtherRepository         OtherRepository
}

func (interactor *VtuberContentInteractor) GetVtubers() ([]domain.Vtuber, error) {
	allVts, err := interactor.VtuberContentRepository.GetVtubers()
	return allVts, err
}
func (interactor *VtuberContentInteractor) GetMoviesUrlTitlebyVtuber(id domain.VtuberId) ([]domain.Movie, error) {
	Mos, err := interactor.VtuberContentRepository.GetMoviesUrlTitleByVtuber(id)
	return Mos, err
}
func (interactor *VtuberContentInteractor) GetMovies() ([]domain.Movie, error) {
	allMos, err := interactor.VtuberContentRepository.GetMovies()
	return allMos, err
}
func (interactor *VtuberContentInteractor) GetKaraokes() ([]domain.Karaoke, error) {
	allKas, err := interactor.VtuberContentRepository.GetKaraokes()
	return allKas, err
}

func (interactor *VtuberContentInteractor) GetVtubersMovies() ([]domain.VtuberMovie, error) {
	VM, err := interactor.VtuberContentRepository.GetVtubersMovies()
	return VM, err
}

func (interactor *VtuberContentInteractor) GetVtubersMoviesKaraokes() ([]domain.TransmitKaraoke, error) {
	allVtsMosKas, err := interactor.VtuberContentRepository.GetVtubersMoviesKaraokes()
	return allVtsMosKas, err
}

func (interactor *VtuberContentInteractor) CreateVtuber(v domain.Vtuber) error {
	v = common.NormalizeVtuber(v)

	if err := common.ValidateVtuber(v); err != nil {
		return err
	}

	if err := interactor.VtuberContentRepository.CreateVtuber(v); err != nil {
		return err
	}
	return nil
}
func (interactor *VtuberContentInteractor) CreateMovie(m domain.Movie) error {
	m = common.NomalizeMovie(m)

	if err := common.ValidateMovie(m); err != nil {
		return err
	}

	if err := interactor.VtuberContentRepository.CreateMovie(m); err != nil {
		return err
	}
	return nil
}
func (interactor *VtuberContentInteractor) CreateKaraoke(k domain.Karaoke) error {
	k = common.NormalizeKaraoke(k)
	if err := common.ValidateKaraoke(k); err != nil {
		return err
	}

	if err := interactor.VtuberContentRepository.CreateKaraoke(k); err != nil {
		return err
	}

	return nil
}

func (interactor *VtuberContentInteractor) UpdateVtuber(v domain.Vtuber) error {
	v = common.NormalizeVtuber(v)

	if err := common.ValidateVtuber(v); err != nil {
		return err
	}

	if err := interactor.VtuberContentRepository.UpdateVtuber(v); err != nil {
		return err
	}
	return nil
}

func (interactor *VtuberContentInteractor) UpdateMovie(m domain.Movie) error {
	m = common.NomalizeMovie(m)

	if err := common.ValidateMovie(m); err != nil {
		return err
	}
	if err := interactor.VtuberContentRepository.UpdateMovie(m); err != nil {
		return err
	}
	return nil
}
func (interactor *VtuberContentInteractor) UpdateKaraoke(k domain.Karaoke) error {
	k = common.NormalizeKaraoke(k)

	if err := common.ValidateKaraoke(k); err != nil {
		return err
	}
	if err := interactor.VtuberContentRepository.UpdateKaraoke(k); err != nil {
		return err
	}
	return nil
}
func (interactor *VtuberContentInteractor) DeleteVtuber(v domain.Vtuber) error {
	err := interactor.VtuberContentRepository.DeleteVtuber(v)
	return err
}

func (interactor *VtuberContentInteractor) DeleteMovie(m domain.Movie) error {
	err := interactor.VtuberContentRepository.DeleteMovie(m)
	return err
}

func (interactor *VtuberContentInteractor) DeleteKaraoke(k domain.Karaoke) error {
	err := interactor.VtuberContentRepository.DeleteKaraoke(k)
	return err
}

func (interactor *VtuberContentInteractor) VerifyUserModifyVtuber(id domain.ListenerId, v domain.Vtuber) (bool, error) {
	isAuth, err := interactor.VtuberContentRepository.VerifyUserModifyVtuber(id, v)
	return isAuth, err
}
func (interactor *VtuberContentInteractor) VerifyUserModifyMovie(id domain.ListenerId, m domain.Movie) (bool, error) {
	isAuth, err := interactor.VtuberContentRepository.VerifyUserModifyMovie(id, m)
	return isAuth, err
}
func (interactor *VtuberContentInteractor) VerifyUserModifyKaraoke(id domain.ListenerId, k domain.Karaoke) (bool, error) {
	isAuth, err := interactor.VtuberContentRepository.VerifyUserModifyKaraoke(id, k)
	return isAuth, err
}
