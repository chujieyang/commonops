.DEFAULT_GOAL := display
.PHONY = all clean

ImageVersion = 0.5
ImageName = registry.cn-hangzhou.aliyuncs.com/kevin_yang/ops_system

display:
	@echo "请选择你想要构建的阶段: all、clean、buildWeb、buildSvr、buildImage"

all: clean buildWeb buildSvr buildImage clean

clean:
	@rm -rf ./web/build/*
	@rm -rf ./build/ops.go
	@rm -rf ./build/web.tar
	echo "编译后的文件已清理完成"

buildWeb:
	@echo "开始构建前端项目"
	@cd ./web && yarn build
	@tar -cvf ./build/web.tar ./web/build/*
	@echo "前端项目构建完成"

buildSvr:
	@echo "开始编译后端项目"
	@cd ./ops && CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o ../build/ops.go .
	@echo "后端项目编译完成"

buildImage: ./build/Dockerfile
	@echo "开始根据Dockerfile生成镜像: ${ImageName}:${ImageVersion}"
	@cd build && docker build -t ${ImageName}:${ImageVersion} .
	@echo "镜像生成成功"