package common

import (
	"database/sql"
	"testing"
	"time"

	"github.com/sharin-sushi/0016go_next_relation/domain"
	"gorm.io/gorm"
)

var tim time.Time
var nTi sql.NullTime
var gDe gorm.DeletedAt

func TestValidateSignup(t *testing.T) {
	type args struct {
		m *domain.Listener
	}
	tests := map[string]struct {
		args    args
		wantErr bool
	}{
		"成功test":      {args{&domain.Listener{ListenerName: "shari", Email: "shari@gmail.com", Password: "0000"}}, false},
		"失敗name_min":  {args{&domain.Listener{ListenerName: "a", Email: "shari@gmail.com", Password: "0000"}}, true},
		"失敗name_max":  {args{&domain.Listener{ListenerName: "0123456789abcdefghijk", Email: "shari@gmail.com", Password: "0000"}}, true},
		"失敗email_min": {args{&domain.Listener{ListenerName: "shari", Email: "abc@a.com", Password: "0000"}}, true},
		"失敗pass_min":  {args{&domain.Listener{ListenerName: "shari", Email: "shari@gmail.com", Password: "0"}}, true},
		"失敗pass_max":  {args{&domain.Listener{ListenerName: "shari", Email: "shari@gmail.com", Password: "0123456789abcdefghijk"}}, true},
	}

	for name, tt := range tests {
		t.Run(name, func(t *testing.T) {
			if err := ValidateSignup(tt.args.m); (err != nil) != tt.wantErr {
				t.Errorf("ValidateSignup() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}
