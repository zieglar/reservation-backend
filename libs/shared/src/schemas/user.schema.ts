import { Schema } from 'ottoman';
import { BaseSchema } from '@libs/shared/schemas/base.schema';
import { ROLE_USER } from '@libs/shared/constants';

interface IUser extends BaseSchema {
	username: string;
	password: string;
	enabled: boolean;
	verifyCode: string;
	role: string;
}

const User = new Schema(
	{
		username: String,
		password: String,
		enabled: { type: Boolean, default: false },
		verifyCode: String,
		role: { type: String, default: ROLE_USER },
	},
	{ timestamps: true },
);

// const User = {
// 	name: 'User',
// 	schema: UserSchema,
// 	modelOptions: {
// 		scopeName: '_default',
// 		collectionName: 'User',
// 	},
// };

export { type IUser, User };
