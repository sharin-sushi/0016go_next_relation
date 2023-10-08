package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"

	"github.com/sharin-sushi/0016go_next_relation/internal/crud"

	"github.com/sharin-sushi/0016go_next_relation/internal/utility"
)

func main() {
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		// アクセス許可するオリジン
		AllowOrigins: []string{"https://localhost:3000"},
		// AllowOrigins: []string{"*"}, //ワイルドカードだが、クライアント側がcredenrials incliudeでは許されてない。

		// アクセス許可するHTTPメソッド
		AllowMethods: []string{"POST", "GET", "PUT", "DELETE"},
		// 許可するHTTPリクエストヘッダ
		// AllowHeaders: []string{"Content-Type"},
		AllowHeaders: []string{"Origin", "Content-Length", "Content-Type", "Cookie"},
		// cookieなどの情報を許可するかどうか
		AllowCredentials: true,
		// // preflightリクエストの結果をキャッシュする時間
		// MaxAge: 24 * time.Hour,
	}))

	// いらんくね
	//https://qiita.com/koshi_an/items/12da955a1823b7f3e178より
	store := cookie.NewStore([]byte("OimoMochiMochIimoMochiOimo20000530"), []byte("sora4mama1997087")) //byteのスライスに変換することで値を変更できるらしい
	//Sesion()の第１引数がCookie名としてセットされ、以後自動で使用され、ブラウザに送信される）らしい
	r.Use(sessions.Sessions("mainCookieSession", store))
	//↑どうなってるのか謎。

	//topページ
	r.GET("/", crud.ReadAllVtubers)                   //動作ok
	r.GET("/vtuber=[id]", crud.ReadAllVtubers)        //未 ver. 1.0の最後
	r.GET("/vtuber=[id]/movies", crud.ReadAllVtubers) //未 ver. 1.0の最後
	r.GET("/sings", crud.ReadAllSings)                //動作ok

	// データ新規登録
	r.POST("/create/vtuber", crud.CreateVtuber)    //動作ok
	r.POST("/create/movie", crud.CreateMovie)      //動作ok
	r.POST("/create/sing", crud.CreateKaraokeSing) //動作ok
	r.POST("/create/song", crud.CreateSong)        //未　ver1.5かな

	//データ編集
	r.POST("/edit/vtuber", crud.EditVtuber)    //動作ok
	r.POST("/edit/movie", crud.EditMovie)      //未
	r.POST("/edit/sing", crud.EditKaraokeSing) //未
	r.POST("/edit/song", crud.EditSong)        //未　ver1.5かな

	// データ削除(論理)
	r.DELETE("/delete/vtruber", crud.DeleteVtuber)   //未
	r.DELETE("/delete/movie", crud.DeleteMovie)      //未
	r.DELETE("/delete/sing", crud.DeleteKaraokeSing) //未
	r.DELETE("/delete/song", crud.DeleteSong)        //未　ver1.5かな

	//ユーザー認証 ※ブラウザでは"/"にリンク有り
	r.POST("/signup2", utility.CalltoSignUpHandler) //動作ほぼok　登録済みのメアドの時に、処理は止めてくれるけど、エラー内容を返してくれない…。
	r.POST("/login2", utility.CalltoLogInHandler)   //動作ok
	r.GET("/logout2", utility.LogoutHandler)        //動作ok

	// /cud/~, /users/~にアクセスした際にmiddlewareでアクセスに認証制限
	utility.CallGetMemberProfile(r) //未

	// //開発者用　パスワード照会（ リポジトリ0019で作り直した）
	// r.GET("/envpass", postrequest.EnvPass)

	r.RunTLS(":8080", "../../key/server.pem", "../../key/server.key")
}

// 多分消して良い

// 		// セッションがない場合、ログインフォームをだす
// 		if LoginInfo.MemberId == nil {
// 			log.Println("ログインしていません")
// 			c.Redirect(http.StatusMovedPermanently, "/login")
// 			c.Abort() // これがないと続けて処理されてしまう
// 		} else {
// 			c.Set("UserId", LoginInfo.MemberId) // ユーザidをセット
// 			c.Next()
// 		}
// 		log.Println("ログインチェック終わり")
// 	}
// }