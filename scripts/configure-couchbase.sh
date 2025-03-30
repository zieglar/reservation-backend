#!/bin/bash

# 从环境变量中读取配置
BUCKET_NAME=${COUCHBASE_BUCKET_NAME}
USERNAME=${COUCHBASE_USERNAME}
PASSWORD=${COUCHBASE_PASSWORD}

# 初始化 Couchbase 节点
couchbase-cli cluster-init -c 127.0.0.1 --cluster-username=${USERNAME} --cluster-password=${PASSWORD} --services=data,index,query

# 创建 Bucket
couchbase-cli bucket-create -c 127.0.0.1 -u ${USERNAME} -p ${PASSWORD} --bucket=${BUCKET_NAME} --bucket-type=couchbase --bucket-ramsize=256
