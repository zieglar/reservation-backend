import { Injectable, OnModuleInit } from '@nestjs/common';
import { Ottoman } from 'ottoman';
import {
	ContactInfoEntity,
	ReservationInfoEntity,
	TableInfoEntity,
	UserEntity,
} from '@libs/shared/entities';
import { ContactInfo, ReservationInfo, TableInfo, User } from '@libs/shared';
import { IDataService } from '@libs/core/base/data.service';
import { envSchema } from '@libs/core/config';
import { OttomanGenericRepository } from '@libs/core/ottoman/ottoman.repository';

@Injectable()
export class OttomanService implements IDataService, OnModuleInit {
	connection: Ottoman;
	tables: OttomanGenericRepository<TableInfoEntity>;
	reservations: OttomanGenericRepository<ReservationInfoEntity>;
	contacts: OttomanGenericRepository<ContactInfoEntity>;
	users: OttomanGenericRepository<UserEntity>;

	async onModuleInit() {
		// set('DEBUG', true);

		const ottoman = new Ottoman({
			collectionName: '_default',
		});

		const connectionString = envSchema.COUCHBASE_CONNECTION_STRING;
		const bucketName = envSchema.COUCHBASE_BUCKET_NAME;
		const username = envSchema.COUCHBASE_USERNAME;
		const password = envSchema.COUCHBASE_PASSWORD;

		this.connection = await ottoman.connect({
			connectionString,
			bucketName,
			username,
			password,
		});

		const tableInfoModel = ottoman.model<TableInfoEntity>('TableInfo', TableInfo, {
			scopeName: '_default',
			collectionName: 'TableInfo',
		});
		this.tables = new OttomanGenericRepository<TableInfoEntity>(tableInfoModel, this.connection);

		const contactInfoModel = ottoman.model<ContactInfoEntity>('ContactInfo', ContactInfo, {
			scopeName: '_default',
			collectionName: 'ContactInfo',
		});
		this.contacts = new OttomanGenericRepository<ContactInfoEntity>(
			contactInfoModel,
			this.connection,
		);

		const reservationInfoModel = ottoman.model<ReservationInfoEntity>(
			'ReservationInfo',
			ReservationInfo,
			{
				scopeName: '_default',
				collectionName: 'ReservationInfo',
			},
		);
		this.reservations = new OttomanGenericRepository<ReservationInfoEntity>(
			reservationInfoModel,
			this.connection,
		);

		const userModel = ottoman.model<UserEntity>('User', User, {
			scopeName: '_default',
			collectionName: 'User',
		});
		this.users = new OttomanGenericRepository<UserEntity>(userModel, this.connection);

		await ottoman.start();
	}
}
