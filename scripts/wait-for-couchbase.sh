#!/bin/bash

set -e

host="$1"
shift
cmd="$@"

# 从环境变量获取认证信息
USERNAME="${COUCHBASE_USERNAME}"
PASSWORD="${COUCHBASE_PASSWORD}"
BUCKET="${COUCHBASE_BUCKET_NAME}"

# 打印环境变量，便于调试
echo "使用以下配置："
echo "host: $host"
echo "用户名: $COUCHBASE_USERNAME"
echo "桶名称: $COUCHBASE_BUCKET_NAME"

until curl -s http://$host:8091/pools > /dev/null;   do
  >&2 echo "等待 Couchbase 服务启动..."
  sleep 3
done

# 检查桶是否可用
until curl -s -u "$USERNAME:$PASSWORD" http://$host:8091/pools/default/buckets/$BUCKET > /dev/null; do
  >&2 echo "等待桶 $BUCKET 就绪..."
  sleep 3
done

>&2 echo "Couchbase 完全就绪 - 开始执行"
exec $cmd
