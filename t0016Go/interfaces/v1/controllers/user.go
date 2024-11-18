package controllers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sharin-sushi/0016go_next_relation/domain"
	"github.com/sharin-sushi/0016go_next_relation/interfaces/v1/controllers/common"
)

var guestId = common.GetGuestListenerId()

func (controller *Controller) CreateUser(c *gin.Context) {
	fmt.Printf("start `CreateUser` at interfaces/controllers/users.go \n")
	var user domain.Listener
	if err := c.ShouldBind(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invailed request body",
			"error":   err.Error(),
		})
		return
	}
	if err := common.ValidateSignup(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invailed validation",
			"error":   err.Error(),
		})
		return
	}
	fmt.Println("user:", user)
	emailAES, err := common.EncryptByAES(user.Email)
	if err != nil {
		fmt.Println("err.Error:", err.Error())
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "failed encrypt email by AES",
			"error":   err.Error(),
		})
		return
	}

	if _, err := controller.UserInteractor.FindUserByEmail(emailAES); err == nil {
		fmt.Println("メアドが重複のため会員登録却下")
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "the E-mail address already in use",
		})
		return
	}
	hashPW, err := common.EncryptPassword(user.Password)
	if err != nil {
		fmt.Println("err.Error:", err.Error())
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "failed generate hassed Password",
			"error":   err.Error(),
		})
		return
	}

	user.Password = hashPW
	user.Email = emailAES
	newUser, err := controller.UserInteractor.CreateUser(user)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "failed Singed Up",
			"error":   err.Error(),
		})
		return
	}

	if err := common.SetListenerIdintoCookie(c, newUser.ListenerId); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "the E-mail address already in use",
			"error":   err.Error(),
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully created user, and logined",
	})

}

func (controller *Controller) LogicalDeleteUser(c *gin.Context) {
	fmt.Printf("start `LogicalDeleteUser` at interfaces/controllers/users.go \n")

	tokenLId, err := common.TakeListenerIdFromJWT(c)
	fmt.Printf("tokenLId = %v \n", tokenLId)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid ListenerId of token",
			"err":     err,
		})
		return
	} else if tokenLId == guestId {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Guest Acc. must NOT Withdrawal",
		})
		return
	}
	var dummyLi domain.Listener
	dummyLi.ListenerId = tokenLId
	if err := controller.UserInteractor.LogicalDeleteUser(dummyLi); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid Withdrawn",
			"err":     err,
		})
		return
	}
	c.SetCookie("auth-token", "none", -1, "/", "localhost", false, true)
	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully Withdrawn. You can restore ur acc. within 60 days.",
	})
}

func (controller *Controller) LogIn(c *gin.Context) {
	fmt.Printf("start `LogIn` at interfaces/controllers/users.go \n")

	var user domain.Listener
	if err := c.ShouldBind(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
			"error":   err.Error(),
		})
		return
	}
	fmt.Printf("user:%v\n", user)

	emailAES, err := common.EncryptByAES(user.Email)
	if err != nil {
		fmt.Printf("err:%v\n", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "failed encrypt email by AES",
			"error":   err.Error(),
		})
		return
	}
	fmt.Printf("emailAES:%v\n", emailAES)

	foundListener, err := controller.UserInteractor.FindUserByEmail(emailAES)
	fmt.Printf("foundListener=%v\n", foundListener)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Error fetching listener info",
			"error":   err.Error(),
		})
		return
	}

	if err := common.CompareHashAndPassword(foundListener.Password, string(user.Password)); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "failed Login: Please confirm the Email&Password you entered",
			"error":   err.Error(),
		})
		return
	}

	if err := common.SetListenerIdintoCookie(c, foundListener.ListenerId); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "failed Login: failed set cookie. bad system.",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully Logged In",
	})
}

func Logout(c *gin.Context) {
	common.UnsetAuthCookie(c)
	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully Withdrawn",
	})
}

func GuestLogIn(c *gin.Context) {
	common.SetListenerIdintoCookie(c, guestId)
	c.JSON(http.StatusOK, gin.H{
		"message":      "Successfully Guest Logged In",
		"listenerName": "guest",
	})
}

func (controller *Controller) GetListenerProfile(c *gin.Context) {
	ListenerId, err := common.TakeListenerIdFromJWT(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Need Login"})
		return
	}

	ListenerInfo, err := controller.UserInteractor.FindUserByListenerId(ListenerId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching listener info"})
		return
	}

	fmt.Printf("ListenerInfo = %v \n", ListenerInfo)

	c.JSON(http.StatusOK, gin.H{
		"ListenerId":   ListenerInfo.ListenerId,
		"ListenerName": ListenerInfo.ListenerName,
		"CreatedAt":    ListenerInfo.CreatedAt,
		"UpdatedAt":    ListenerInfo.UpdatedAt,
		"Email":        "secret",
		"Password":     "secret",
		"message":      "got urself infomation",
	})
}

func (controller *Controller) ListenerPage(c *gin.Context) {
	// listenerId取得
	listenerId, err := common.TakeListenerIdFromJWT(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Need Login"})
		return
	}
	var errs []error
	createdVts, createdVtsMos, createdVtsMosKas, errs := controller.FavoriteInteractor.FindEachRecordsCreatedByListenerId(listenerId)
	myFav, err := controller.FavoriteInteractor.FindFavoritesCreatedByListenerId(listenerId)
	if err != nil {
		errs = append(errs, err)
	}
	fmt.Printf("myFav= \n %v\n", myFav)
	TransmitMovies := common.AddIsFavToMovieWithFav(createdVtsMos, myFav)
	TransmitKaraokes := common.AddIsFavToKaraokeWithFav(createdVtsMosKas, myFav)
	c.JSON(http.StatusOK, gin.H{
		"vtubers_u_created":                 createdVts,
		"vtubers_movies_u_created":          TransmitMovies,
		"vtubers_movies_karaokes_u_created": TransmitKaraokes,
		"error":                             errs,
	})
}
