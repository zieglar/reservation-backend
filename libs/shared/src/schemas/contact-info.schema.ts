import { Schema } from 'ottoman';
import { BaseSchema } from '@libs/shared/schemas/base.schema';

interface IContactInfo extends BaseSchema {
	name: string;
	phone: string;
	userId: string;
}

const ContactInfo = new Schema(
	{
		name: String,
		phone: String,
		userId: String,
	},
	{ timestamps: true },
);
ContactInfo.index.findByName = { by: 'name' };
ContactInfo.index.findByPhone = { by: 'phone' };

// const ContactInfo = {
// 	name: 'ContactInfo',
// 	schema: ContactInfoSchema,
// 	modelOptions: {
// 		scopeName: '_default',
// 		collectionName: 'ContactInfo',
// 	},
// };

export { type IContactInfo, ContactInfo };
