import { Api } from '../src/index';
import ApiError from '../src/utils/ApiError';
import { BOT, BOT_STATS, VOTE, VOTES } from './mocks/data';

/* mock token */
const client = new Api('.eyJfdCI6IiIsImlkIjoiMzY0ODA2MDI5ODc2NTU1Nzc2In0=.');

describe('API postBotCommands test', () => {
    it('postBotCommands should work', () => {
        expect(client.postBotCommands([{
            id: '1',
            type: 1,
            application_id: '1',
            name: 'test',
            description: 'command description',
            default_member_permissions: '',
            version: '1'
        }])).resolves.toBeUndefined();
    });
});

describe('API postBotServerCount test', () => {
    it('postBotServerCount with invalid negative server count should throw error', () => {
        expect(client.postBotServerCount(-1)).rejects.toThrow(Error);
    });

    it('postBotServerCount should return 200', async () => {
        await expect(client.postBotServerCount(1)).resolves.toBeUndefined();
    });
});

describe('API getBotServerCount test', () => {
    it('getBotServerCount should return 200 when bot is found', async () => {
        expect(client.getBotServerCount()).resolves.toStrictEqual(BOT_STATS.server_count);
    });
});

describe('API getBot test', () => {
    it('getBot should return 404 when bot is not found', () => {
        expect(client.getBot('0')).rejects.toThrow(ApiError);
    });

    it('getBot should return 200 when bot is found', async () => {
        expect(client.getBot('1')).resolves.toStrictEqual(BOT);
    });

    it('getBot should throw when no id is provided', () => {
        expect(client.getBot('')).rejects.toThrow(Error);
    });
});

describe('API getVoters test', () => {
    it('getVoters should return 200 when token is provided', () => {
        expect(client.getVoters()).resolves.toStrictEqual(VOTES);
    });
});

describe('API getVote test', () => {
    it('getVote should return 200 when token is provided', () => {
        expect(client.getVote('1')).resolves.toStrictEqual(VOTE);
    });

    it('getVote should throw error when no id is provided', () => {
        expect(client.getVote('')).rejects.toThrow(Error);
    });
});

describe('API isWeekend tests', () => {
    it('isWeekend should return true', async () => {
        expect(client.isWeekend()).resolves.toBe(true);
    });
});
