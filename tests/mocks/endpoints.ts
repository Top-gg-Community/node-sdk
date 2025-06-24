import { MockInterceptor } from 'undici/types/mock-interceptor';
import { BOT, BOTS, BOT_STATS, USER_VOTE, VOTES, WEEKEND } from './data';
import { getIdInPath } from '../jest.setup';

export const endpoints = [
    {
        pattern: '/api/v1/bots',
        method: 'GET',
        data: BOTS,
        requireAuth: true
    },
    {
        pattern: '/api/v1/bots/:bot_id',
        method: 'GET',
        data: BOT,
        requireAuth: true,
        validate: (request: MockInterceptor.MockResponseCallbackOptions) => {
            const bot_id = getIdInPath('/api/v1/bots/:bot_id', request.path);
            if (Number(bot_id) === 0) return { statusCode: 404 };
            return null;
        }
    },
    {
        pattern: '/api/v1/bots/:bot_id/votes',
        method: 'GET',
        data: VOTES,
        requireAuth: true,
        validate: (request: MockInterceptor.MockResponseCallbackOptions) => {
            const bot_id = getIdInPath('/api/v1/bots/:bot_id/votes', request.path);
            if (Number(bot_id) === 0) return { statusCode: 404 };
            return null;
        }
    },
    {
        pattern: '/api/v1/bots/check',
        method: 'GET',
        data: USER_VOTE,
        requireAuth: true
    },
    {
        pattern: '/api/v1/bots/stats',
        method: 'GET',
        data: BOT_STATS,
        requireAuth: true
    },
    {
        pattern: '/api/v1/bots/stats',
        method: 'POST',
        data: {},
        requireAuth: true
    },
    {
        pattern: '/api/v1/weekend',
        method: 'GET',
        data: WEEKEND,
        requireAuth: true
    }
]