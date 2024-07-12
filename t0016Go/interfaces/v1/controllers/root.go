package controllers

import (
	"github.com/sharin-sushi/0016go_next_relation/interfaces/database"
	"github.com/sharin-sushi/0016go_next_relation/useCase"
)

type Controller struct {
	UserInteractor          useCase.UserInteractor
	VtuberContentInteractor useCase.VtuberContentInteractor
	FavoriteInteractor      useCase.FavoriteInteractor
	OtherInteractor         useCase.OtherInteractor
}

func NewController(sqlHandler database.SqlHandler) *Controller {
	return &Controller{
		VtuberContentInteractor: useCase.VtuberContentInteractor{
			VtuberContentRepository: &database.VtuberContentRepository{
				SqlHandler: sqlHandler,
			},
		},
		UserInteractor: useCase.UserInteractor{
			UserRepository: &database.UserRepository{
				SqlHandler: sqlHandler,
			},
		},
		FavoriteInteractor: useCase.FavoriteInteractor{
			FavoriteRepository: &database.FavoriteRepository{
				SqlHandler: sqlHandler,
			},
		},
		OtherInteractor: useCase.OtherInteractor{
			OtherRepository: &database.OtherRepository{
				SqlHandler: sqlHandler,
			},
		},
	}
}
