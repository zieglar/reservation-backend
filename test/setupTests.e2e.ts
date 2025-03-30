import {
	BucketDefinition,
	CouchbaseContainer,
	StartedCouchbaseContainer,
} from '@testcontainers/couchbase';
import { Bucket, Cluster } from 'couchbase';

let couchbaseContainer: StartedCouchbaseContainer;
let cluster: Cluster;
let bucket: Bucket;

beforeAll(async () => {
	const COUCHBASE_IMAGE_COMMUNITY = 'couchbase/server:community';
	const bucketDefinition = new BucketDefinition('testBucket').withQuota(100);
	// 启动 Couchbase 容器
	couchbaseContainer = await new CouchbaseContainer(COUCHBASE_IMAGE_COMMUNITY)
		.withBucket(bucketDefinition)
		.start();

	cluster = await Cluster.connect(couchbaseContainer.getConnectionString(), {
		username: couchbaseContainer.getUsername(),
		password: couchbaseContainer.getPassword(),
	});
	bucket = cluster.bucket(bucketDefinition.getName());

	// 验证连接是否成功
	const pingResult = await cluster.ping();
	expect(pingResult).toBeDefined();
	expect(pingResult.services).toBeDefined();
	expect(pingResult.services.kv).toBeDefined();
	expect(pingResult.services.kv.length).toBeGreaterThan(0);
});

afterAll(async () => {
	await cluster.close();
	await couchbaseContainer.stop();
});

export { cluster, couchbaseContainer, bucket };
