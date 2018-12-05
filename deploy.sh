#!/bin/sh

ENV=$1
VERSION=$2

if [[ $VERSION == '' ]]; then
  VERSION=$RANDOM
fi

echo $ENV
echo $VERSION

#清理上次由于部署卡住，手工取消job的后台残留的任务
docker ps -a|grep -Ev "heimaocha|unicscore|unictown|website|lhjc|download|registrator|consul|CONTAINER"|awk '{print $1}'|xargs docker stop > /dev/null 2>&1
docker ps -a|grep -Ev "heimaocha|unicscore|unictown|website|lhjc|download|registrator|consul|CONTAINER"|awk '{print $1}'|xargs docker rm   > /dev/null 2>&1
#清理上次部署失败后异常退出的容器
docker ps -a|grep Exited|awk '{print $1}'|xargs docker rm -f > /dev/null 2>&1

docker build -t heimaocha-backend:$VERSION -f DockerFile ./

if [[ $(docker ps -a | grep heimaocha-backend) != '' ]]; then
  docker rm -f $(docker ps -a | grep heimaocha-backend | awk '{print $1}')
fi


docker run  -d -P --name heimaocha-backend-$VERSION heimaocha-backend:$VERSION pm2-docker start ecosystem.config.js --env $ENV
