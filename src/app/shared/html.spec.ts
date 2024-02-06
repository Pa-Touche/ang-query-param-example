// load using import
import { glob } from 'glob';

describe('fetching all files', () => {
    it('all js files', async () => {
        console.log("blabla")
// all js files, but don't look in node_modules
const jsfiles = await glob('**/*.js', { ignore: 'node_modules/**' })

console.log(jsfiles)
expect(jsfiles).toBeFalsy()
    }
    );
});