#!/bin/bash
set -m

echo "启动 Couchbase 服务..."
/entrypoint.sh couchbase-server &

echo "等待服务初始化..."
for i in {1..30}; do
  if curl -s http://localhost:8091/ui/index.html >/dev/null; then
    echo "服务已启动"
    break
  fi
  echo "尝试 $i - 等待中..."
  sleep 5
done

# 打印环境变量，便于调试
echo "使用以下配置："
echo "用户名: $COUCHBASE_USERNAME"
echo "桶名称: $COUCHBASE_BUCKET_NAME"

# 初始化集群
couchbase-cli cluster-init -c localhost:8091 \
  --cluster-username "$COUCHBASE_USERNAME" \
  --cluster-password "$COUCHBASE_PASSWORD" \
  --services data,index,query \
  --cluster-ramsize 512

# 创建桶
couchbase-cli bucket-create -c localhost \
  -u "$COUCHBASE_USERNAME" -p "$COUCHBASE_PASSWORD" \
  --bucket="$COUCHBASE_BUCKET_NAME" --bucket-type=couchbase \
  --bucket-ramsize=256

# 等待桶服务就绪
sleep 5

echo "配置完成"

fg %1
