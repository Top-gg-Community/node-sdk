import { Api } from '../src/index';
import { VOTE } from './mocks/data';

/* mock token */
const client = new Api('.eyJfdCI6IiIsImlkIjoiMzY0ODA2MDI5ODc2NTU1Nzc2In0=.');

describe('API postCommands test', () => {
    it('postCommands should work', () => {
        expect(client.postCommands([{
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

describe('API getVote test', () => {
    it('getVote should return 200 when token is provided', () => {
        expect(client.getVote('1')).resolves.toStrictEqual(VOTE);
    });

    it('getVote should throw error when no id is provided', () => {
        expect(client.getVote('')).rejects.toThrow(Error);
    });
});
