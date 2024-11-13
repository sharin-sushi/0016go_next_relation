package controllers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sharin-sushi/0016go_next_relation/domain"
	"github.com/sharin-sushi/0016go_next_relation/interfaces/v1/controllers/common"
	"gorm.io/gorm"
)

func (controller *Controller) SaveMovieFavorite(c *gin.Context) {
	applicantListenerId, err := common.TakeListenerIdFromJWT(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Error fetching listener info",
		})
		return
	}
	var fav domain.Favorite

	if err := c.ShouldBind(&fav); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
		})
		return
	} else if fav.KaraokeId != 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "/favrite/movie Get Fav Karaoke",
		})
		return
	} else if fav.MovieUrl == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Send Data(movie_url) is NULL",
		})
		return
	}

	fav.ListenerId = applicantListenerId
	foundFav := controller.FavoriteInteractor.FindFavoriteUnscopedByFavOrUnfavRegistry(fav)
	zeroValue := gorm.DeletedAt{}
	if foundFav.ID == 0 {
		err := controller.FavoriteInteractor.CreateMovieFavorite(foundFav)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"message": "Invailed Favorite it",
			})
			return
		}
	} else if foundFav.DeletedAt != zeroValue {
		err := controller.FavoriteInteractor.UpdateMovieFavorite(foundFav)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"message": "Invailed Favorite it",
			})
			return
		}
	} else {
		c.JSON(http.StatusOK, gin.H{
			"message": "Already Favorite it",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully Favorite it",
	})
}
func (controller *Controller) DeleteMovieFavorite(c *gin.Context) {
	applicantListenerId, err := common.TakeListenerIdFromJWT(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Error fetching listener info",
		})
	}
	var fav domain.Favorite
	if err := c.ShouldBind(&fav); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
		})
		return
	} else if fav.KaraokeId != 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "/favrite/movie Get Fav Karaoke",
		})
		return
	} else if fav.MovieUrl == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Send Data(movie_url) is NULL",
		})
		return
	}
	fav.ListenerId = applicantListenerId

	if err := controller.FavoriteInteractor.DeleteMovieFavorite(fav); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invailed UnFavorite it",
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully UnFavorite it",
	})
	return
}

func (controller *Controller) SaveKaraokeFavorite(c *gin.Context) {
	applicantListenerId, err := common.TakeListenerIdFromJWT(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Error fetching listener info",
		})
		return
	}
	var fav domain.Favorite
	if err := c.ShouldBind(&fav); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
		})
		return
	} else if fav.MovieUrl == "" || fav.KaraokeId == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Send Data has \"\" or 0",
		})
		return
	}
	fav.ListenerId = applicantListenerId
	foundFav := controller.FavoriteInteractor.FindFavoriteUnscopedByFavOrUnfavRegistry(fav)
	zeroValue := gorm.DeletedAt{}
	fmt.Println("fav", foundFav)
	fmt.Printf("foundFav:%v", foundFav)
	if foundFav.ID == 0 {
		err := controller.FavoriteInteractor.CreateKaraokeFavorite(foundFav)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"message": "Invailed Favorite it",
			})
			return
		}
	} else if foundFav.DeletedAt != zeroValue {
		err := controller.FavoriteInteractor.UpdateKaraokeFavorite(foundFav)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"message": "Invailed Favorite it",
			})
			return
		}
	} else {
		c.JSON(http.StatusOK, gin.H{
			"message": "Already Favorite it",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully Favorite it",
	})
}

func (controller *Controller) DeleteKaraokeFavorite(c *gin.Context) {
	applicantListenerId, err := common.TakeListenerIdFromJWT(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Error fetching listener info",
		})
		return
	}
	var fav domain.Favorite
	if err := c.ShouldBind(&fav); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
		})
		return
	} else if fav.MovieUrl == "" || fav.KaraokeId == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Send Data has \"\" or 0",
		})
		return
	}
	fav.ListenerId = applicantListenerId
	if err := controller.FavoriteInteractor.DeleteKaraokeFavorite(fav); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invailed UnFavorite it",
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully UnFavorite it",
	})
}
