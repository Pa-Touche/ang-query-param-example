

/* 
Route check works so far but: 

- Not recursive (must be checked against 'children routes' also)

*/

const routesWithCollisionAtFirstLevel = [
    {
        component: {} as any,
        title: 'Home page'
    },
    {
        component: {} as any,
        title: 'Home page'
    },
    {
        path: '',
        component: {} as any,
        title: 'Home page'
    },
    {
        path: '',
        component: {} as any,
        title: 'Home page'
    },
    {
        path: 'sameEntry',
        component: {} as any,
        title: 'Home page'
    },
    {
        path: 'sameEntry',
        component: {} as any,
        title: 'Home page'
    },
    {
        path: 'details/:id',
        component: {} as any,
        title: 'Home details'
    },
    {
        path: 'details/:anotherIdName',
        component: {} as any,
        title: 'Home details'
    }
];
/* 
describe('checkRouting', () => {
    it('No collisions (same variable paths, different variable names)', () => { */

const routeElements = routesWithCollisionAtFirstLevel
    .map(entry => entry.path)
    // replacing falsy with default (check TS-Doc)
    .map(path => path ?? "/")
    .map(path => ({ originalPath: path, normalizedPath: normalizePath(path as any) }));

console.log(routeElements)

const cache: { [key: string]: boolean } = {};
const duplicateRoutes = [];
for (var i = 0, len = routeElements.length; i < len; i++) {
    const normalizedPath = routeElements[i].normalizedPath;
    const originalPath = routeElements[i].originalPath;
    if (cache[normalizedPath] === true) {
        duplicateRoutes.push(originalPath);
    } else {
        cache[normalizedPath] = true;
    }
}

/* }); */


function normalizePath(path: string): string {
    const pathParts = path.split("/");

    return pathParts
        .map(path => path.replace(/\:.*/, ":PLACEHOLDER"))
        .join("/")
}



