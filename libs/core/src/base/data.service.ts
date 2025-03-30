import { IGenericRepository } from './generic.repository';
import {
	ContactInfoEntity,
	ReservationInfoEntity,
	TableInfoEntity,
	UserEntity,
} from '@libs/shared/entities';

export abstract class IDataService {
	abstract connection: any;
	abstract tables: IGenericRepository<TableInfoEntity, TableInfoEntity>;
	abstract reservations: IGenericRepository<ReservationInfoEntity, ReservationInfoEntity>;
	abstract contacts: IGenericRepository<ContactInfoEntity, ContactInfoEntity>;
	abstract users: IGenericRepository<UserEntity, UserEntity>;
}
