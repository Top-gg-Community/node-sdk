import { MockInterceptor } from 'undici/types/mock-interceptor';
import { BOT, BOTS, BOT_STATS, USER, USER_VOTE, USER_VOTE_CHECK, VOTES, WEEKEND } from './data';
import { getIdInPath } from '../jest.setup';

export const endpoints = [
    {
        pattern: '/api/bots',
        method: 'GET',
        data: BOTS,
        requireAuth: true
    },
    {
        pattern: '/api/bots/:bot_id',
        method: 'GET',
        data: BOT,
        requireAuth: true,
        validate: (request: MockInterceptor.MockResponseCallbackOptions) => {
            const bot_id = getIdInPath('/api/bots/:bot_id', request.path);
            if (Number(bot_id) === 0) return { statusCode: 404 };
            return null
        },
    },
    {
        pattern: '/api/bots/:bot_id/votes',
        method: 'GET',
        data: VOTES,
        requireAuth: true
    },
    {
        pattern: '/api/bots/votes',
        method: 'GET',
        data: VOTES,
        requireAuth: true
    }, // Undocumented
    {
        pattern: '/api/bots/:bot_id/stats',
        method: 'GET',
        data: BOT_STATS,
        requireAuth: true,
        validate: (request: MockInterceptor.MockResponseCallbackOptions) => {
            const bot_id = getIdInPath('/api/bots/:bot_id/stats', request.path);
            if (Number(bot_id) === 0) return { statusCode: 404 };
            return null
        },
    },
    {
        pattern: '/api/bots/:bot_id/check',
        method: 'GET',
        data: USER_VOTE,
        requireAuth: true
    },
    {
        pattern: '/api/bots/:bot_id/stats',
        method: 'POST',
        requireAuth: true
    },
    {
        pattern: '/api/bots/stats',
        method: 'POST',
        data: {},
        requireAuth: true
    }, // Undocumented
    {
        pattern: '/api/users/:user_id',
        method: 'GET',
        data: USER,
        requireAuth: true,
        validate: (request: MockInterceptor.MockResponseCallbackOptions) => {
            const bot_id = getIdInPath('/api/users/:user_id', request.path);
            if (Number(bot_id) === 0) return { statusCode: 404 };
            return null
        },
    },
    {
        pattern: '/api/bots/check',
        method: 'GET',
        data: USER_VOTE_CHECK,
        requireAuth: true
    },
    { 
        pattern: '/api/weekend', 
        method: 'GET', 
        data: WEEKEND, 
        requireAuth: true 
    },
];