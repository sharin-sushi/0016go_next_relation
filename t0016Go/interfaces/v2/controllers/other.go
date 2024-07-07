package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func (controller *Controller) ExecRawQuery(c *gin.Context) {
	query := "テスト時にここに直接書き込む"
	err := controller.OtherInteractor.OtherRepository.ExecRawQuery(query)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Error at ExecRawQuery",
		})
		return
	}
}
