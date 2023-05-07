import { MockAgent, setGlobalDispatcher } from 'undici';
import { MockInterceptor } from 'undici/types/mock-interceptor';
import { endpoints } from './mocks/endpoints';

interface IOptions {
    pattern: string;
    requireAuth?: boolean;
    validate?: (request: MockInterceptor.MockResponseCallbackOptions) => void;
}

export const getIdInPath = (pattern: string, url: string) => {
    const regex = new RegExp(`^${pattern.replace(/:[^/]+/g, '([^/]+)')}$`);
    const match = url.match(regex);
    
    return match ? match[1] : null;
}

export const isMatchingPath = (pattern: string, url: string) => {
    // Remove query params
    url = url.split("?")[0]

    if (pattern === url) {
        return true;
    }

    // Check if there is an exact match
    if(endpoints.some(({ pattern }) => pattern === url)) {
        return false
    };

    return getIdInPath(pattern, url) !== null;
}

beforeEach(() => {
    const mockAgent = new MockAgent()
    mockAgent.disableNetConnect();
    const client = mockAgent.get('https://top.gg');
    
    
    const generateResponse = (request: MockInterceptor.MockResponseCallbackOptions, statusCode: number, data: any, headers = {}, options: IOptions) => {
        const requestHeaders = request.headers as any;
    
        // Check if token is avaliable
        if (options.requireAuth && (!requestHeaders['authorization'] || requestHeaders['authorization'] == '')) return { statusCode: 401 };
    
        // Check that user is owner of bot
        if (options.requireAuth && requestHeaders['authorization'] !== 'owner_token') return { statusCode: 403 }
        
        const error = options.validate?.(request);
        if (error) return error;
    
        return {
            statusCode,
            data: JSON.stringify(data),
            responseOptions: {
                headers: { 'content-type': 'application/json', ...headers },
            }
        }
    }
    
    endpoints.forEach(({ pattern, method, data, requireAuth, validate }) => {
        client.intercept({
            path: (path) => isMatchingPath(pattern, path),
            method,
        }).reply((request) => {return generateResponse(request, 200, data, {}, { pattern, requireAuth, validate: validate })});
    })
    
    client.intercept({
        path: (path) => !endpoints.some(({ pattern }) => isMatchingPath(pattern, path)),
        method: (_) => true,
    }).reply((request) => {
        throw Error(`No endpoint found for ${request.method} ${request.path}`)
    })
    
    setGlobalDispatcher(mockAgent);
})