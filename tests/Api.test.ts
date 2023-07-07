import { Api } from '../src/index';
import ApiError from '../src/utils/ApiError';
import { BOT, BOT_STATS, USER, VOTES } from './mocks/data';

const is_owner = new Api('owner_token');
const not_owner = new Api('not_owner_token');
const no_token = new Api('');

describe('API postStats test', () => {
    it('postStats should return 401 when no token is provided', async() => {
        await expect(no_token.postStats({serverCount: 1, shardCount: 0})).rejects.toThrowError(ApiError);
    })
    it('postStats without server count should throw error', async () => {
        await expect(is_owner.postStats({shardCount: 0})).rejects.toThrowError(Error);
    })
    it('postStats should return 401 when no token is provided', async () => {
        await expect(no_token.postStats({serverCount: 1, shardCount: 0})).rejects.toThrowError(ApiError);
    })

    /* 
    TODO: Check for this is not added in code and api returns 400
    it('postStats with invalid negative server count should throw error',  () => {
        expect(is_owner.postStats({serverCount: -1, shardCount: 0})).rejects.toThrowError(Error);
    })

    TODO: Check for negative shardId is not added
    it('postStats with invalid negative shardId should throw error', () => {
        expect(is_owner.postStats({serverCount: 1, shardCount: 0, shardId: -1})).rejects.toThrowError(Error);
    })

    TODO: ShardId cannot be greater or equal to shardCount
    it('postStats with shardId greater than shardCount should throw error', () => {
        expect(is_owner.postStats({serverCount: 1, shardCount: 0, shardId: 1})).rejects.toThrowError(Error);
    })

    TODO: Check for negative shardCount is not added
    it('postStats with invalid negative shardCount should throw error', () => {
        expect(is_owner.postStats({serverCount: 1, shardCount: -1})).rejects.toThrowError(Error);
    })

    TODO: Check if shardCount is greater than 10000
    it('postStats with invalid shardCount should throw error', () => {
        expect(is_owner.postStats({serverCount: 1, shardCount: 10001})).rejects.toThrowError(Error);
    })
    */
    
   it('postStats should return 403 when token is not owner of bot', async () => {
       await expect(not_owner.postStats({serverCount: 1, shardCount: 0})).rejects.toThrowError(ApiError);
    })

    it('postStats should return 200 when token is owner of bot', async () => {
        await expect(is_owner.postStats({serverCount: 1, shardCount: 1})).resolves.toBeInstanceOf(Object);
    })
})

describe('API getStats test', () => {
    it('getStats should return 401 when no token is provided', () => {
        expect(no_token.getStats('1')).rejects.toThrowError(ApiError);
    })

    it('getStats should return 404 when bot is not found', async() => {
        await expect(is_owner.getStats('0')).rejects.toThrowError(ApiError);    
    })

    it('getStats should return 200 when bot is found', async () => {
        expect(is_owner.getStats('1')).resolves.toStrictEqual({ 
            serverCount: BOT_STATS.server_count,
             shardCount: BOT_STATS.shard_count, 
             shards: BOT_STATS.shards
            });
    })

    it('getStats should throw when no id is provided', () => {
        expect(is_owner.getStats('')).rejects.toThrowError(Error);
    })
})


describe('API getBot test', () => {
    it('getBot should return 401 when no token is provided', () => {
        expect(no_token.getBot('1')).rejects.toThrowError(ApiError);
    })
    it('getBot should return 404 when bot is not found', () => {
        expect(is_owner.getBot('0')).rejects.toThrowError(ApiError);
    })
    
    it('getBot should return 200 when bot is found', async () => {
        expect(is_owner.getBot('1')).resolves.toStrictEqual(BOT);
    })
    
    it('getBot should throw when no id is provided', () => {
        expect(is_owner.getBot('')).rejects.toThrowError(Error);
    })
    
})
describe('API getUser test', () => {
    it('getUser should return 401 when no token is provided', () => {
        expect(no_token.getUser('1')).rejects.toThrowError(ApiError);
    })

    it('getUser should return 404 when user is not found', () => {
        expect(is_owner.getUser('0')).rejects.toThrowError(ApiError);
    })
    
    it('getUser should return 200 when user is found', async () => {
        expect(is_owner.getUser('1')).resolves.toStrictEqual(USER);
    })
    
    it('getUser should throw when no id is provided', () => {
        expect(is_owner.getUser('')).rejects.toThrowError(Error);
    })
})


describe('API getVotes test', () => {
    it('getVotes should return throw error when no token is provided', () => {
        expect(no_token.getVotes()).rejects.toThrowError(Error);
    })
    
    it('getVotes should return 200 when token is provided', () => {
        expect(is_owner.getVotes()).resolves.toEqual(VOTES);
    })
});

describe('API hasVoted test', () => {
    it('hasVoted should throw error when no token is provided', () => {
        expect(no_token.hasVoted('1')).rejects.toThrowError(Error);
    })

    it('hasVoted should return 200 when token is provided', () => {
        expect(is_owner.hasVoted('1')).resolves.toBe(true);
    })

    it('hasVoted should throw error when no id is provided', () => {
        expect(is_owner.hasVoted('')).rejects.toThrowError(Error);
    })
})

describe('API isWeekend tests', () => {
    it('isWeekend should return true', async () => {
        expect(is_owner.isWeekend()).resolves.toBe(true)
    })
});