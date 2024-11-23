package infra

import (
	"fmt"
	"os"

	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"

	domain "github.com/sharin-sushi/0016go_next_relation/domain"
	"github.com/sharin-sushi/0016go_next_relation/interfaces/database"
	"github.com/sharin-sushi/0016go_next_relation/interfaces/v1/controllers/common"
)

var isDidDBMigration bool

type SqlHandler struct {
	Conn *gorm.DB
}

// 似たような処理がSetListenerIdintoCookie()にもあるので、envを変更するときは注意
func GetEnvVar() {
	if common.IsOnCloud {
		//クラウド環境
		fmt.Println("クラウド環境で起動")
	} else if common.IsOnLoclaWithDockerCompose {
		// ローカルのdocker上(compose使用)
		fmt.Println("ローカルのdockerコンテナ内で起動")
	} else if common.IsOnLoclaWithOutDockerCompose {
		//VSCodeで起動
		fmt.Println("VSCodeで起動。godotenv.Load使用")
		err := godotenv.Load("../.env")
		if err == nil {
			fmt.Println("got .env file sucussesly. retry os.Getenv")
		} else {
			fmt.Println("godotenvで.envファイル取得失敗")
		}
	}

	guest := os.Getenv("GUEST_USER_NAME")
	fmt.Printf("「%v」の中身が空でなければ環境変数を読み込めてるはず。 \n", guest)
}

func dbInit() database.SqlHandler {
	user := os.Getenv("MYSQL_USER")
	pw := os.Getenv("MYSQL_PASSWORD")
	dbName := ""
	port := "3306"
	dbUrl := ""

	if common.IsOnCloud {
		fmt.Println("common.IsOnCloud : true")
		//クラウド環境
		dbUrl = os.Getenv("RDS_END_PIONT")
		dbName = os.Getenv("AWS_DATABASE")
		fmt.Printf("環境変数より取得: dbUrl=%v, dbName=%v, \n", dbUrl, dbName)

		// クラウド環境で、環境変数使ってなくて、
		// MySQLとGoがlocal接続するよ(１つのインスタンス内で両方立ててるとか)みたいな状況用
		if dbName == "" && dbUrl == "" {
			dbName = "v_kara_db"
			dbUrl = "localhost"
			// mysqlでユーザー作って、// 権限も付与すること
			user = "shari"
			pw = "shari_sushi"
		}
	} else if common.IsOnLoclaWithDockerCompose {
		fmt.Println("common.IsOnLoclaWithDockerCompose : true")
		// Golangはローカルのdocker-compose or  VSCodeで起動
		// MySQLはローカルのdocker上(compose使用) で起動
		if user == "" {
			user = "root"
		}
		dbUrl = "v_kara_db"
		dbName = os.Getenv("MYSQL_DATABASE")
	} else if common.IsOnLoclaWithOutDockerCompose {
		fmt.Println("develop env. is unknown")
		// Golangはローカルのdocker-compose or  VSCodeで起動
		// MySQLはローカルでdockerを使用せずに起動
		if user == "" {
			user = "root"
		}
		dbUrl = "localhost"
		dbName = os.Getenv("MYSQL_DATABASE")
	} else {
		fmt.Println("common.hoge : false ")

		dbUrl = "localhost"
		dbName = "db"
		user = "user"
		pw = "password"
	}

	path := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=true", user, pw, dbUrl, port, dbName)

	fmt.Printf("path=%v \n", path)
	var err error
	var sqlHandler *SqlHandler
	gormDB, err := gorm.Open(mysql.Open(path), &gorm.Config{})
	gormDB = gormDB.Debug()
	if err == nil {
		sqlHandler = new(SqlHandler)
		sqlHandler.Conn = gormDB
		sqlHandler.migration()
	} else {
		panic("failed to connect database")
	}

	return sqlHandler
}

func (Db *SqlHandler) migration() {
	// NOTE: v1, v2でなぜか２回migrationが走るので、それを防ぐためのフラグ
	if !isDidDBMigration {
		fmt.Print("migratoin開始")
		Db.Conn.Set("gorm:table_options", "ENGINE=InnoDB").AutoMigrate(
			// User
			domain.Listener{},
			// Like Relatoin
			domain.Favorite{}, domain.Follow{},
			// Vtuber Contents
			domain.Karaoke{}, domain.Movie{}, domain.Vtuber{}, domain.OriginalSong{},
		)
		isDidDBMigration = true
	}
}

func (handler *SqlHandler) Count(column *int64) *gorm.DB {
	return handler.Conn.Count(column)
}
func (handler *SqlHandler) Create(value interface{}) *gorm.DB {
	return handler.Conn.Create(value)
}
func (handler *SqlHandler) Delete(value interface{}, conds ...interface{}) *gorm.DB {
	return handler.Conn.Delete(value, conds...)
}
func (handler *SqlHandler) Find(value interface{}, conds ...interface{}) *gorm.DB {
	return handler.Conn.Find(value, conds...)
}
func (handler *SqlHandler) First(value interface{}, conds ...interface{}) *gorm.DB {
	return handler.Conn.First(value, conds...)
}
func (handler *SqlHandler) Group(column string) *gorm.DB {
	return handler.Conn.Group(column)
}
func (handler *SqlHandler) Joins(query string, value ...interface{}) *gorm.DB {
	return handler.Conn.Joins(query, value...)
}
func (handler *SqlHandler) Limit(limit int) *gorm.DB {
	return handler.Conn.Limit(limit)
}
func (handler *SqlHandler) Model(value interface{}) *gorm.DB {
	return handler.Conn.Model(value)
}
func (handler *SqlHandler) Omit(columns ...string) *gorm.DB {
	return handler.Conn.Omit(columns...)
}
func (handler *SqlHandler) Order(value interface{}) *gorm.DB {
	return handler.Conn.Order(value)
}
func (handler *SqlHandler) Raw(sql string) *gorm.DB {
	return handler.Conn.Raw(sql)
}
func (handler *SqlHandler) Save(value interface{}) *gorm.DB {
	return handler.Conn.Save(value)
}
func (handler *SqlHandler) Select(value interface{}, conds ...interface{}) *gorm.DB {
	return handler.Conn.Select(value, conds...)
}
func (handler *SqlHandler) Unscoped() *gorm.DB {
	return handler.Conn.Unscoped()
}
func (handler *SqlHandler) Update(column string, value interface{}) *gorm.DB {
	return handler.Conn.Update(column, value)
}
func (handler *SqlHandler) Updates(values interface{}) *gorm.DB {
	return handler.Conn.Updates(values)
}
func (handler *SqlHandler) Where(value interface{}, conds ...interface{}) *gorm.DB {
	return handler.Conn.Where(value, conds...)
}
