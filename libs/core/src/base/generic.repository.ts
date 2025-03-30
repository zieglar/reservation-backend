import { LogicalWhereExpr } from 'ottoman/lib/types/query';
import { FindOptions } from 'ottoman/lib/types/handler';
import { CountOptions } from 'ottoman/lib/types/model/model.types';

export interface IGenericRepository<T, R extends T> {
	find(filter?: LogicalWhereExpr<T>, options?: FindOptions): Promise<R[]>;
	updateOneById(id: string, item: Partial<R>): Promise<T>;
	create(options: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
	findOne(filter: LogicalWhereExpr<T>, options?: FindOptions): Promise<R | undefined>;
	findById(id: string): Promise<R | undefined>;
	deleteOneById(id: string): Promise<any>;
	count(filter?: LogicalWhereExpr<T>, options?: CountOptions): Promise<number>;
	createMany(docs: Partial<T> | Partial<T>[]): any;
}
