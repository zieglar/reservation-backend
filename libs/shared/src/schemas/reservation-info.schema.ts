import { Schema } from 'ottoman';
import { BaseSchema } from '@libs/shared/schemas/base.schema';
import { ContactInfo } from '@libs/shared/schemas/contact-info.schema';

enum ReservationStatus {
	Requested = 1,
	Approved = 2,
	Cancelled = 3,
	Completed = 4,
}

// const ReservationStatusEnum = z.nativeEnum(ReservationStatus);

interface IReservationInfo extends BaseSchema {
	contactId: string;
	tableId: string;
	userId: string;
	date: string;
	numberOfPeople: number;
	status: ReservationStatus;

	contact?: { name: string; phone: string };
	table?: { seats: number };

	lastOperatorId?: string;
}

const ReservationInfo = new Schema(
	{
		contactId: String,
		tableId: String,
		userId: String,
		date: String,
		numberOfPeople: Number,
		status: Number,

		lastOperatorId: String,

		contact: ContactInfo,
		table: { seats: Number },
	},
	{ timestamps: true },
);

ReservationInfo.index.findByDate = { by: 'date' };
ReservationInfo.index.findByContactId = { by: 'contactId' };
ReservationInfo.index.findByStatus = { by: 'status' };

// const ReservationInfo = {
// 	name: 'ReservationInfo',
// 	schema: ReservationInfoSchema,
// 	modelOptions: {
// 		scopeName: '_default',
// 		collectionName: 'ReservationInfo',
// 	},
// };

export { type IReservationInfo, ReservationInfo, ReservationStatus };
