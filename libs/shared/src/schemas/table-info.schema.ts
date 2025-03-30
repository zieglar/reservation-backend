import { Schema } from 'ottoman';

interface ITableInfo {
	id: string;
	seats: number;
}

const TableInfo = new Schema({
	id: String,
	seats: Number,
});

// const TableInfo = {
// 	name: 'TableInfo',
// 	schema: TableInfoSchema,
// 	modelOptions: {
// 		scopeName: '_default',
// 		collectionName: 'TableInfo',
// 	},
// };

export { TableInfo, type ITableInfo };
