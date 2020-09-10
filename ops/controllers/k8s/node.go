package k8s

import (
	"net/http"
	"time"

	k8s_structs "github.com/chujieyang/commonops/ops/forms/k8s"
	"github.com/gin-gonic/gin"
	"github.com/labstack/gommon/log"
)

func GetNodes(c *gin.Context) {
	cluster, err := getContextCluster(c)
	if err != nil {
		log.Error(err.Error())
		c.JSON(http.StatusOK, k8s_structs.RespError(-1, err.Error()))
		return
	}
	data, err := cluster.GetNodes()
	if err != nil {
		log.Error(err.Error())
		c.JSON(http.StatusOK, k8s_structs.RespError(-1, err.Error()))
		return
	}
	c.JSON(http.StatusOK, k8s_structs.RespSuccess(data))
}

func GetNodesMetrics(c *gin.Context) {
	cluster, err := getContextCluster(c)
	if err != nil {
		log.Error(err.Error())
		c.JSON(http.StatusOK, k8s_structs.RespError(-1, err.Error()))
		return
	}
	query := c.Query("query")
	end := time.Now().Unix()
	start := end - 300
	data, err := cluster.GetNodesMetrics(query, int(start), int(end), "10s")
	if err != nil {
		log.Error(err.Error())
		c.JSON(http.StatusOK, k8s_structs.RespError(-1, err.Error()))
		return
	}
	c.JSON(http.StatusOK, k8s_structs.RespSuccess(data))
}
