import { Api } from '../src/index';
import ApiError from '../src/utils/ApiError';

describe('API isWeekend tests', () => {
    it('isWeekend should return true', async () => {
        const api = new Api('owner_token')

        const isWeekend = await api.isWeekend();

        expect(isWeekend).toBe(true)
    })
})