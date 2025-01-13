package infra

import (
	"github.com/gin-gonic/gin"
	controllers1 "github.com/sharin-sushi/0016go_next_relation/interfaces/v1/controllers"
)

// 命名規則
// https://github.com/sharin-sushi/0016go_next_relation/issues/71#issuecomment-1843543763

func Routing(r *gin.Engine) {
	routingV1(r)
	// 1つでもhandlerを実装したら開放する
	// routingV2(r)
}

// フロントで移行でき次第、１つずつも呼び出してるメソッドと共に削除していく。
func routingV1(r *gin.Engine) {
	controller := controllers1.NewController(dbInit())

	ver := r.Group("/v1")
	{
		users := ver.Group("/users")
		{
			users.POST("/signup", controller.CreateUser)
			users.PUT("/login", controller.LogIn)
			users.PUT("/logout", controllers1.Logout) // dbアクセスしないから sqlHandlerのメソッドにしてないぽいそんな設計で良いのか
			users.DELETE("/withdraw", controller.LogicalDeleteUser)
			users.GET("/gestlogin", controllers1.GuestLogIn) // dbアクセスしないから gin.sqlHandlerのメソッドにしてないぽいそんな設計で良いのか
			users.GET("/profile", controller.GetListenerProfile)
			users.GET("/mypage", controller.ListenerPage)
		}
		vcontents := ver.Group("/vcontents")
		{
			vcontents.GET("/", controller.ReturnTopPageData)
			vcontents.GET("/vtuber/:kana", controller.ReturnVtuberPageData)
			vcontents.GET("/sings", controller.GetJoinVtubersMoviesKaraokes)
			vcontents.GET("/original-song", controller.ReturnOriginalSongPage)

			// /vtuber, /movie, /karaokeの文字列はフロント側で比較演算に使われてる
			// データ新規登録
			vcontents.POST("/create/vtuber", controller.CreateVtuber)
			vcontents.POST("/create/movie", controller.CreateMovie)
			vcontents.POST("/create/karaoke", controller.CreateKaraoke)
			vcontents.POST("/create/karaoke-multi", controller.CreateKaraokes)

			//データ編集
			vcontents.POST("/edit/vtuber", controller.EditVtuber)
			vcontents.POST("/edit/movie", controller.EditMovie)
			vcontents.POST("/edit/karaoke", controller.EditKaraoke)

			// // データ削除(物理)
			vcontents.GET("/delete/deletePage", controller.DeleteOfPage)
			vcontents.DELETE("/delete/vtuber", controller.DeleteVtuber)
			vcontents.DELETE("/delete/movie", controller.DeleteMovie)
			vcontents.DELETE("/delete/karaoke", controller.DeleteKaraoke)

			//ドロップダウン用
			vcontents.GET("/getalldata", controller.GetVtuverMovieKaraoke)

			// テスト用
			vcontents.GET("/dummy-top-page", controller.ReturnDummyTopPage)
		}
		fav := ver.Group("/fav")
		{
			fav.POST("/favorite/movie", controller.SaveMovieFavorite)
			fav.DELETE("/unfavorite/movie", controller.DeleteMovieFavorite)
			fav.POST("/favorite/karaoke", controller.SaveKaraokeFavorite)
			fav.DELETE("/unfavorite/karaoke", controller.DeleteKaraokeFavorite)
		}
	}
}

//lint:ignore U1000 (何かしら実装したら使う予定)
func routingV2(r *gin.Engine) {

	var v2 = r.Group("/v2")
	{
		users := v2.Group("/users")
		{
			users.GET("/", func(c *gin.Context) {})       //　GETに変えた注意
			users.GET("/logout", func(c *gin.Context) {}) // フロントに任せて良くない？→微妙
			users.POST("/signup", func(c *gin.Context) {})
			users.DELETE("/withdraw", func(c *gin.Context) {})
			users.GET("/guest", func(c *gin.Context) {})
			users.GET("/profile", func(c *gin.Context) {})
			users.GET("/like-karaoke", func(c *gin.Context) {})
			users.GET("/like-movie", func(c *gin.Context) {})
			users.GET("/resitored-vtubers", func(c *gin.Context) {})
			users.GET("/resitored-movies", func(c *gin.Context) {})
			users.GET("/resitored-songs", func(c *gin.Context) {})
		}

		streamContents := v2.Group("/stream-contents")
		{
			vtubers := streamContents.Group("/vtubers")
			{
				vtubers.GET("/", func(c *gin.Context) {})
				vtubers.POST("/create", func(c *gin.Context) {})
				vtubers.PUT("/update", func(c *gin.Context) {})
				vtubers.DELETE("/delete", func(c *gin.Context) {})
				vtubers.POST("/like", func(c *gin.Context) {})
				vtubers.DELETE("/unlike", func(c *gin.Context) {})
			}
			videos := streamContents.Group("/videos")
			{
				videos.GET("/", func(c *gin.Context) {})
				videos.POST("/create", func(c *gin.Context) {})
				videos.PUT("/update", func(c *gin.Context) {})
				videos.DELETE("/delete", func(c *gin.Context) {})
				videos.POST("/like", func(c *gin.Context) {})
				videos.DELETE("/unlike", func(c *gin.Context) {})
			}

			// 従来のカラオケソング＝歌ではなく、カラオケ配信＝歌枠(動画)の意
			// songsController := v2Songs.NewController(dbInit())
			songs := streamContents.Group("/songs")
			{
				songs.GET("/", func(c *gin.Context) {})
				// songs.POST("/create", songsController.Create)
				songs.PUT("/update", func(c *gin.Context) {})
				songs.DELETE("/delete", func(c *gin.Context) {})
				songs.POST("/like", func(c *gin.Context) {})
				songs.DELETE("/unlike", func(c *gin.Context) {})
			}
		}
	}
}

// //開発者用　パスワード照会（ リポジトリ0019で作り直した）
// r.GET("/envpass", postrequest.EnvPass)
