import { IDocument, ModelTypes, Ottoman } from 'ottoman';
import { IGenericRepository } from '@libs/core/base/generic.repository';
import { LogicalWhereExpr } from 'ottoman/lib/types/query';
import { FindOptions } from 'ottoman/lib/types/handler';
import { CountOptions } from 'ottoman/lib/types/model/model.types';

export type Document<T> = IDocument<T> & T & { id: string; createdAt?: Date; updatedAt?: Date };

export class OttomanGenericRepository<T> implements IGenericRepository<T, Document<T>> {
	constructor(
		private _model: ModelTypes<T, Document<T>>,
		private connection: Ottoman,
	) {}
	async create(options: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
		return await this._model.create(options);
	}

	async find(filter?: LogicalWhereExpr<T>, options?: FindOptions): Promise<Document<T>[]> {
		try {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			const result: { rows: any } = await this._model.find(filter, { ...options, lean: true });
			// eslint-disable-next-line @typescript-eslint/no-unsafe-return
			return result?.rows ?? [];
		} catch (error) {
			console.error(error);
			return [];
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-misused-promises
	async updateOneById(id: string, item: Partial<Document<T>>): Promise<Document<T>> {
		return await this._model.findOneAndUpdate({ id: id }, item, { lean: true, new: true });
	}

	async findById(id: string): Promise<Document<T> | undefined> {
		let result = undefined;

		try {
			result = await this._model.findOne({ id: id }, { lean: true });
		} catch (error) {
			console.error(error);
		}

		return result;
	}

	async deleteOneById(id: string): Promise<any> {
		return await this._model.removeById(id);
	}

	async getAll(options?: FindOptions): Promise<Document<T>[]> {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const result = await this._model.find({}, { ...options, lean: true });
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
		return result.rows;
	}

	async findOne(
		filter: LogicalWhereExpr<T>,
		options?: FindOptions,
	): Promise<Document<T> | undefined> {
		let result = undefined;

		try {
			result = await this._model.findOne(filter, { ...options, lean: true });
		} catch (error) {
			console.error(error);
		}

		return result;
	}

	async count(filter?: LogicalWhereExpr<T>, options?: CountOptions): Promise<number> {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return await this._model.count(filter, options);
	}

	async createMany(docs: Partial<T> | Partial<T>[]) {
		return await this._model.createMany(docs);
	}
}
