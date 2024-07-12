package common

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"github.com/sharin-sushi/0016go_next_relation/domain"

	validation "github.com/go-ozzo/ozzo-validation"
)

func SetListenerIdintoCookie(c *gin.Context, ListenerId domain.ListenerId) (err error) {
	var token string
	token, err = GenerateToken(int(ListenerId))
	if err != nil {
		return
	}
	// TODO time使う
	cookieMaxAge := 60 * 60 * 24 * 7
	hostDomain := GetEnvHostDomain()
	cookie := &http.Cookie{
		Name:     "auth-token",
		Value:    token,
		Path:     "/",
		Domain:   hostDomain,
		MaxAge:   cookieMaxAge,
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
	}

	http.SetCookie(c.Writer, cookie)
	fmt.Printf("発行したcookie= %v \n", cookie)
	return
}

func UnsetAuthCookie(c *gin.Context) (err error) {
	hostDomain := GetEnvHostDomain()
	cookie := &http.Cookie{
		Name:     "auth-token",
		Value:    "",
		Path:     "/",
		Domain:   hostDomain,
		MaxAge:   -1,
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
	}

	http.SetCookie(c.Writer, cookie)
	fmt.Printf("発行したcookie= %v \n", cookie)
	return
}

func TakeListenerIdFromJWT(c *gin.Context) (domain.ListenerId, error) {
	// TODO err処理
	tokenString, _ := c.Cookie("auth-token")
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("SECRET_KEY")), nil
	})
	if err != nil {
		return 0, err
	}
	fmt.Printf("token= %v \n", token)

	var listenerId int
	if claims, ok := token.Claims.(jwt.MapClaims); ok {
		if val, exists := claims["listener_id"]; exists {
			listenerIdFloat, ok := val.(float64) // JSON numbers are float64
			if !ok {
				return 0, fmt.Errorf("Invalid listener_id format in token")
			}
			listenerId = int(listenerIdFloat)
		} else {
			return 0, fmt.Errorf("token has no Listener Id")
		}
	}
	// TODO err分岐処理する

	// TODO 早期リターンさせる
	return domain.ListenerId(listenerId), err
}

func GenerateToken(ListenerId int) (string, error) {
	secretKey := os.Getenv("SECRET_KEY")
	// TODO
	tokenLifeTime := 60 * 60 * 24 * 7

	claims := jwt.MapClaims{
		"listener_id": ListenerId,
		"exp":         time.Now().Add(time.Hour * time.Duration(tokenLifeTime)).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(secretKey))
	if err != nil {
		return "", err
	}
	return tokenString, nil
}

func ParseToken(tokenString string) (*jwt.Token, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(os.Getenv("SECRET_KEY")), nil
	})
	if err != nil {
		return nil, err
	}
	return token, nil
}

func ValidateSignup(m *domain.Listener) error {
	fmt.Println()
	err := validation.ValidateStruct(m,
		validation.Field(&m.ListenerName,
			validation.Required.Error("Name is required"),
			validation.Length(2, 20).Error("Name needs 2 ~ 20 chars"),
		),
		validation.Field(&m.Email,
			validation.Required.Error("Email is required"),
			validation.Length(10, 100).Error("Email needs 10 ~ 100 chars"), //メアドは現状、これ以外の制限はしてない
		),
		validation.Field(&m.Password,
			validation.Required.Error("Password is required"),
			validation.Length(4, 20).Error("Password needs 4 ~ 20 chars"),
		),
	)
	return err
}
