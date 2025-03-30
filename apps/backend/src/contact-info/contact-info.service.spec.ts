import { ContactInfoService } from './contact-info.service';
import { IDataService } from '@libs/core';

describe('ContactInfoService', () => {
	let service: ContactInfoService;
	let dataService: IDataService;

	beforeEach(() => {
		dataService = {
			contacts: {
				find: jest.fn(),
			},
		} as unknown as IDataService;
		service = new ContactInfoService(dataService);
	});

	it('应该返回按 createdAt 降序排列的联系人列表', async () => {
		const contacts = [
			{ id: '1', name: 'John Doe', createdAt: new Date('2023-01-01') },
			{ id: '2', name: 'Jane Doe', createdAt: new Date('2023-02-01') },
		];
		(dataService.contacts.find as jest.Mock).mockResolvedValue(contacts);

		const result = await service.listContacts();

		expect(result).toEqual(contacts);
		expect(dataService.contacts.find).toHaveBeenCalledWith({}, { sort: { createdAt: 'DESC' } });
	});

	it('当没有联系人时应该返回空列表', async () => {
		(dataService.contacts.find as jest.Mock).mockResolvedValue([]);

		const result = await service.listContacts();

		expect(result).toEqual([]);
		expect(dataService.contacts.find).toHaveBeenCalledWith({}, { sort: { createdAt: 'DESC' } });
	});

	it('当数据服务抛出错误时应该抛出错误', async () => {
		(dataService.contacts.find as jest.Mock).mockRejectedValue(new Error('Database error'));

		await expect(service.listContacts()).rejects.toThrow('Database error');
	});
});
