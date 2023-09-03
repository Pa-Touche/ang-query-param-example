import * as fs from 'fs';
import * as path from 'path';

describe('HTML Template Files', () => {
  it('should read and assert content of HTML template files', () => {
    const templateFileNames = fs.readdirSync('.')
        .filter(fn => fn.endsWith('.html'));

    console.log(templateFileNames);

  });
});