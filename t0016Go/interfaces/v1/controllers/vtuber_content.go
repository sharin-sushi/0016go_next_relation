package controllers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sharin-sushi/0016go_next_relation/domain"
	"github.com/sharin-sushi/0016go_next_relation/interfaces/v1/controllers/common"
)

func (controller *Controller) GetJoinVtubersMoviesKaraokes(c *gin.Context) {
	// transmitKaraoke, err := controller.VtuberContentInteractor.GetVtubersMoviesKaraokes()
	VtsMosKasWithFav, err := controller.FavoriteInteractor.GetVtubersMoviesKaraokesWithFavCnts()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"resultStsのerror": err.Error()})
		return
	}
	listenerId, err := common.TakeListenerIdFromJWT(c)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"vtubers_movies_karaokes": VtsMosKasWithFav,
		})
		return
	}
	myFav, err := controller.FavoriteInteractor.FindFavoritesCreatedByListenerId(listenerId)
	if err != nil {
		fmt.Print("err in FindFavoritesCreatedByListenerId	:", err)
	}
	transmitKaraokes := common.AddIsFavToKaraokeWithFav(VtsMosKasWithFav, myFav)

	c.JSON(http.StatusOK, gin.H{
		"vtubers_movies_karaokes": transmitKaraokes,
	})
}

func (c *Controller) ReturnVtuberPageData(cont *gin.Context) {
	kana := cont.Param("kana")
	fmt.Println("kana", kana)
	var errs []error

	VtsMosKasWithFavofVtu, err := c.FavoriteInteractor.GetVtubersMoviesKaraokesByVtuerKanaWithFavCnts(kana)
	if err != nil {
		fmt.Print("err:", err)
		errs = append(errs, err)
	}
	vtuberId := VtsMosKasWithFavofVtu[0].VtuberId
	MosOfVtu, err := c.VtuberContentInteractor.GetMoviesUrlTitlebyVtuber(vtuberId)
	if err != nil {
		fmt.Print("err:", err)
		errs = append(errs, err)
	}

	listenerId, err := common.TakeListenerIdFromJWT(cont) //非ログイン時でもデータは送付する
	if err != nil || listenerId == 0 {
		errs = append(errs, err)
		cont.JSON(http.StatusOK, gin.H{
			"vtubers_movies":          MosOfVtu,
			"vtubers_movies_karaokes": VtsMosKasWithFavofVtu,
			"error":                   errs,
			"message":                 "dont you Loged in ?",
		})
		return
	}
	myFav, err := c.FavoriteInteractor.FindFavoritesCreatedByListenerId(listenerId)
	if err != nil {
		fmt.Print("err in FindFavoritesCreatedByListenerId	:", err)
	}

	TransmitKaraokes := common.AddIsFavToKaraokeWithFav(VtsMosKasWithFavofVtu, myFav)

	cont.JSON(http.StatusOK, gin.H{
		"vtubers_movies":          MosOfVtu,
		"vtubers_movies_karaokes": TransmitKaraokes,
		"error":                   errs,
	})
}

func (controller *Controller) CreateVtuber(c *gin.Context) {
	listenerId, err := common.TakeListenerIdFromJWT(c)
	if err != nil {
		fmt.Println("err:", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Error fetching listener info",
		})
		return
	}
	var vtuber domain.Vtuber
	if err := c.ShouldBind(&vtuber); err != nil {
		fmt.Println("err:", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
		})
		return
	}
	vtuber.VtuberInputterId = listenerId

	if err := controller.VtuberContentInteractor.CreateVtuber(vtuber); err != nil {
		fmt.Println("err:", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invailed Registered the New Vtuber",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully Registered the New Vtuber",
	})
}

func (controller *Controller) CreateMovie(c *gin.Context) {
	listenerId, err := common.TakeListenerIdFromJWT(c)
	if err != nil {
		fmt.Println("err: jwt,", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Error fetching listener info",
		})
		return
	}
	var movie domain.Movie
	if err := c.ShouldBind(&movie); err != nil {
		fmt.Println("err: ShouldBind,", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
		})
		return
	}

	movie.MovieInputterId = listenerId
	if err := controller.VtuberContentInteractor.CreateMovie(movie); err != nil {
		fmt.Println("err: create movie,", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invailed Registered the New Movie",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully Registered the New Movie",
	})
}

func (controller *Controller) CreateKaraoke(c *gin.Context) {
	listenerId, err := common.TakeListenerIdFromJWT(c)
	if err != nil {
		fmt.Println("err: jwt,", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Error fetching listener info",
		})
		return
	}
	var karaoke domain.Karaoke
	if err := c.ShouldBind(&karaoke); err != nil {
		fmt.Println("err: ShoulBind karaoke,", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
		})
		return
	}
	karaoke.KaraokeInputterId = listenerId
	if err := controller.VtuberContentInteractor.CreateKaraoke(karaoke); err != nil {
		fmt.Println("err: create karaoke,", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invailed Registered the New Karaoke",
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully Registered the New Karaoke",
	})

}

func (controller *Controller) EditVtuber(c *gin.Context) {
	listenerId, err := common.TakeListenerIdFromJWT(c)
	if err != nil {
		fmt.Println("err:", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Error fetching listener info",
		})
		return
	}
	var vtuber domain.Vtuber
	if err := c.ShouldBind(&vtuber); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
		})
		return
	}
	vtuber.VtuberInputterId = listenerId
	if isAuth, err := controller.VtuberContentInteractor.VerifyUserModifyVtuber(listenerId, vtuber); err != nil {
		fmt.Println("err:", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Auth Check is failed.(we could not Verify)",
		})
		return
	} else if !isAuth {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Only The Inputter can modify each data",
		})
		return
	}
	if err := controller.VtuberContentInteractor.UpdateVtuber(vtuber); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Inputter can modify each data",
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully Update",
	})
}

func (controller *Controller) EditMovie(c *gin.Context) {
	listenerId, err := common.TakeListenerIdFromJWT(c)
	if err != nil {
		fmt.Println("err:", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Error fetching listener info",
		})
		return
	}
	var Movie domain.Movie
	if err := c.ShouldBind(&Movie); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
		})
		return
	}
	fmt.Printf("shouldBind Movie:%v \n ", Movie)
	Movie.MovieInputterId = listenerId
	if isAuth, err := controller.VtuberContentInteractor.VerifyUserModifyMovie(listenerId, Movie); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Auth Check is failed.(we could not Verify)",
		})
		return
	} else if !isAuth {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Only The Inputter can modify each data",
		})
		return
	}
	if err := controller.VtuberContentInteractor.UpdateMovie(Movie); err != nil {
		fmt.Println("err:", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Inputter can modify each data",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully Update",
	})
}

func (controller *Controller) EditKaraoke(c *gin.Context) {
	listenerId, err := common.TakeListenerIdFromJWT(c)
	if err != nil {
		fmt.Println("err:", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Error fetching listener info",
		})
		return
	}
	var Karaoke domain.Karaoke
	if err := c.ShouldBind(&Karaoke); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
		})
		return
	}
	Karaoke.KaraokeInputterId = listenerId
	if isAuth, err := controller.VtuberContentInteractor.VerifyUserModifyKaraoke(listenerId, Karaoke); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Auth Check is failed.(we could not Verify)",
		})
		return
	} else if !isAuth {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Only The Inputter can modify each data",
		})
		return
	} else {
		fmt.Printf("isAuth%v :\n", isAuth)
		if err := controller.VtuberContentInteractor.UpdateKaraoke(Karaoke); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"message": "Inputter can modify each data",
			})
			return
		}
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully Update",
	})

}

func (controller *Controller) DeleteOfPage(c *gin.Context) {
	var errs []error

	allVts, err := controller.VtuberContentInteractor.GetVtubers()
	if err != nil {
		errs = append(errs, err)
	}
	VtsMosWithFav, err := controller.FavoriteInteractor.GetVtubersMoviesWithFavCnts()
	if err != nil {
		fmt.Print("err:", err)
		errs = append(errs, err)
	}

	listenerId, err := common.TakeListenerIdFromJWT(c)
	if err != nil {
		fmt.Println("err:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Need Login"})
		return
	}
	createdVts, createdVtsMos, createdVtsMosKas, errs := controller.FavoriteInteractor.FindEachRecordsCreatedByListenerId(listenerId)
	myFav, err := controller.FavoriteInteractor.FindFavoritesCreatedByListenerId(listenerId)
	if err != nil {
		fmt.Println("err:", err)
		errs = append(errs, err)
	}

	TransmitMovies := common.AddIsFavToMovieWithFav(createdVtsMos, myFav)
	TransmitKaraokes := common.AddIsFavToKaraokeWithFav(createdVtsMosKas, myFav)
	c.JSON(http.StatusOK, gin.H{
		"vtubers_u_created":                 createdVts,
		"vtubers_movies_u_created":          TransmitMovies,
		"vtubers_movies_karaokes_u_created": TransmitKaraokes,
		"all_vtubers":                       allVts,
		"all_vtubers_movies":                VtsMosWithFav,
		"error":                             errs,
	})

}

func (controller *Controller) DeleteVtuber(c *gin.Context) {
	listenerId, err := common.TakeListenerIdFromJWT(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Error fetching listener info",
		})
		return
	}
	var selectedVtuber domain.Vtuber
	if err := c.ShouldBind(&selectedVtuber); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
		})
		return
	}
	fmt.Print("Vtuber", selectedVtuber, "\n")
	if isAuth, err := controller.VtuberContentInteractor.VerifyUserModifyVtuber(listenerId, selectedVtuber); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Auth Check is failed.(we could not Verify)",
		})
		return
	} else if !isAuth {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Only The Inputter can modify each data",
		})
		return
	}

	if err := controller.VtuberContentInteractor.DeleteVtuber(selectedVtuber); err != nil {
		fmt.Println("err:", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Only Inputter can modify each data",
			"error":   err,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully Delete",
	})
}

func (controller *Controller) DeleteMovie(c *gin.Context) {
	listenerId, err := common.TakeListenerIdFromJWT(c)
	if err != nil {
		fmt.Println("err:", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Error fetching listener info",
		})
		return
	}
	var Movie domain.Movie
	if err := c.ShouldBind(&Movie); err != nil {
		fmt.Println("err:", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
		})
		return
	}
	if isAuth, err := controller.VtuberContentInteractor.VerifyUserModifyMovie(listenerId, Movie); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Auth Check is failed.(we could not Verify)",
		})
		return
	} else if !isAuth {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Only The Inputter can modify each data",
		})
		return
	}

	if err := controller.VtuberContentInteractor.DeleteMovie(Movie); err != nil {
		fmt.Println("err:", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Only Inputter can modify each data",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully Delete",
	})
}

func (controller *Controller) DeleteKaraoke(c *gin.Context) {
	listenerId, err := common.TakeListenerIdFromJWT(c)
	if err != nil {
		fmt.Println("err:", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Error fetching listener info",
		})
		return
	}

	var Karaoke domain.Karaoke
	if err := c.ShouldBind(&Karaoke); err != nil {
		fmt.Println("err:", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
		})
		return
	}

	if isAuth, err := controller.VtuberContentInteractor.VerifyUserModifyKaraoke(listenerId, Karaoke); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Auth Check is failed.(we could not Verify)",
		})
		return
	} else if !isAuth {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Only The Inputter can modify each data",
		})
		return
	}

	if err := controller.VtuberContentInteractor.DeleteKaraoke(Karaoke); err != nil {
		fmt.Println("err:", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Only Inputter can modify each data",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully Delete",
	})
}

func (controller *Controller) ReturnTopPageData(c *gin.Context) {
	var errs []error
	allVts, err := controller.VtuberContentInteractor.GetVtubers()
	if err != nil {
		errs = append(errs, err)
	}
	VtsMosWithFav, err := controller.FavoriteInteractor.GetVtubersMoviesWithFavCnts()
	if err != nil {
		fmt.Print("err:", err)
		errs = append(errs, err)
	}
	VtsMosKasWithFav, err := controller.FavoriteInteractor.GetVtubersMoviesKaraokesWithFavCnts()
	if err != nil {
		fmt.Print("err:", err)
		errs = append(errs, err)
	}

	LatestVtsMosKasWithFav, err := controller.FavoriteInteractor.GetLatest50VtubersMoviesKaraokesWithFavCnts(guestId)
	if err != nil {
		errs = append(errs, err)
	}

	listenerId, err := common.TakeListenerIdFromJWT(c) //非ログイン時でもデータは送付する
	fmt.Printf("listenerId=%v\n", listenerId)
	if err != nil || listenerId == 0 {
		fmt.Println("err:", err)
		errs = append(errs, err)
		c.JSON(http.StatusOK, gin.H{
			"vtubers":                 allVts,
			"vtubers_movies":          VtsMosWithFav,
			"vtubers_movies_karaokes": VtsMosKasWithFav,
			"latest_karaokes":         LatestVtsMosKasWithFav,
			"error":                   errs,
			"message":                 "dont you Loged in ?",
		})
		return
	}
	myFav, err := controller.FavoriteInteractor.FindFavoritesCreatedByListenerId(listenerId)
	if err != nil {
		fmt.Println("err:", err)
	}

	TransmitMovies := common.AddIsFavToMovieWithFav(VtsMosWithFav, myFav)
	TransmitKaraokes := common.AddIsFavToKaraokeWithFav(VtsMosKasWithFav, myFav)
	TransmitLatestKaraoes := common.AddIsFavToKaraokeWithFav(LatestVtsMosKasWithFav, myFav)

	c.JSON(http.StatusOK, gin.H{
		"vtubers":                 allVts,
		"vtubers_movies":          TransmitMovies,
		"vtubers_movies_karaokes": TransmitKaraokes,
		"latest_karaokes":         TransmitLatestKaraoes,
		"error":                   errs,
	})
}

func (controller *Controller) ReturnOriginalSongPage(c *gin.Context) {
	var errs []error
	allVts, err := controller.VtuberContentInteractor.GetVtubers()
	if err != nil {
		errs = append(errs, err)
	}
	var VtsMosWithFav []domain.TransmitMovie
	var VtsMosKasWithFav []domain.TransmitKaraoke

	c.JSON(http.StatusOK, gin.H{
		"vtubers":                 allVts,
		"vtubers_movies":          VtsMosWithFav,
		"vtubers_movies_karaokes": VtsMosKasWithFav,
		"error":                   errs,
		"message":                 "dont you Loged in ?",
	})
}

// dropdown用
func (controller *Controller) GetVtuverMovieKaraoke(c *gin.Context) {
	var errs []error
	allVts, err := controller.VtuberContentInteractor.GetVtubers()
	if err != nil {
		errs = append(errs, err)
	}
	allMos, err := controller.VtuberContentInteractor.GetMovies()
	if err != nil {
		errs = append(errs, err)
	}
	allKas, err := controller.VtuberContentInteractor.GetKaraokes()
	if err != nil {
		errs = append(errs, err)
	}
	if err != nil {
		fmt.Println("err:", err)
	}
	c.JSON(http.StatusOK, gin.H{
		"vtubers":                 allVts,
		"vtubers_movies":          allMos,
		"vtubers_movies_karaokes": allKas,
		"error":                   errs,
	})
}

func (controller *Controller) ReturnDummyTopPage(c *gin.Context) {
	controller.ReturnTestpage(c)
}

func (controller *Controller) ReturnTestpage(c *gin.Context) {
	var errs []error
	var allVts []domain.Vtuber
	var VtsMosWithFav []domain.TransmitMovie
	var VtsMosKasWithFav []domain.TransmitKaraoke

	allVts = []domain.Vtuber{
		{
			VtuberId:         530,
			VtuberName:       "api-app間の接続確認",
			VtuberKana:       "sucsessefuly_connect",
			IntroMovieUrl:    "",
			VtuberInputterId: 1,
		},
	}

	VtsMosWithFav = []domain.TransmitMovie{
		{
			VtuberId: 1,
			Vtuber: domain.Vtuber{
				VtuberName:       "サイト更新",
				VtuberKana:       "sucsessefuly_connect",
				IntroMovieUrl:    "",
				VtuberInputterId: 1,
			},
			MovieUrl: "www.youtube.com/watch?v=4p1pIYBU61c",
			Movie: domain.Movie{
				MovieTitle:      "牙アピールかわいいおいも[新人vTuber妹望おいも]",
				VtuberId:        530,
				MovieInputterId: 1,
			},
			Count: 530,
			IsFav: false,
		},
	}

	VtsMosKasWithFav = []domain.TransmitKaraoke{
		{
			VtuberId: 1,
			Vtuber: domain.Vtuber{
				VtuberName:       LastUpdateData,
				VtuberKana:       "",
				IntroMovieUrl:    "",
				VtuberInputterId: 1,
			},
			MovieUrl: "www.youtube.com/watch?v=4p1pIYBU61c",
			Movie: domain.Movie{
				MovieTitle:      "牙アピールかわいいおいも[新人vTuber妹望おいも]",
				VtuberId:        1,
				MovieInputterId: 1,
			},
			KaraokeId: 1,
			Karaoke: domain.Karaoke{
				SingStart:         "00:00:35",
				SongName:          "おいもの誕生日は0530(動画無関係)",
				KaraokeInputterId: 1,
			},
			Count: 100,
			IsFav: false,
		},
	}

	c.JSON(http.StatusOK, gin.H{
		"vtubers":                 allVts,
		"vtubers_movies":          VtsMosWithFav,
		"vtubers_movies_karaokes": VtsMosKasWithFav,
		"error":                   errs,
		"message":                 "did u make it?",
	})
}
