
interface AngularRouting {
    component: any;
    routes?: AngularRouting[];
    path?: string;
}

interface RoutingDuplicate {
    path: string;
    parentPath?: string;
}

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
        path: 'tasks',
        component: {} as any,
        title: 'Home page',
        routes: [
            {
                path: 'details/:id',
                component: {} as any,
                title: 'Home details'
            },
            {
                path: 'details/:anotherIdName',
                component: {} as any,
                title: 'Home details',
                routes: [
                    {
                        path: 'details/:id',
                        component: {} as any,
                        title: 'Home details'
                    },
                ]
            }
        ]
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

console.log(findDuplicates(routesWithCollisionAtFirstLevel))

type ReursiveRoutingDuplicateArray = (RoutingDuplicate | ReursiveRoutingDuplicateArray)[];

function findDuplicates(routingEntries: AngularRouting[], parentPath?: string): ReursiveRoutingDuplicateArray {
    const routeElements = routingEntries
        .map(entry => entry.path)
        // replacing falsy with default (check TS-Doc)
        .map(path => path ?? "/")
        .map(path => ({ originalPath: path, normalizedPath: normalizePath(path) }));


    const cache: { [key: string]: boolean } = {};
    const duplicateRoutes: RoutingDuplicate[] = [];
    for (var i = 0, len = routeElements.length; i < len; i++) {
        const normalizedPath = routeElements[i].normalizedPath;
        const originalPath = routeElements[i].originalPath;
        if (cache[normalizedPath] === true) {
            duplicateRoutes.push({ path: originalPath, ...(parentPath && { parentPath }) });
        } else {    
            cache[normalizedPath] = true;
        }
    }

    return [...duplicateRoutes, ...routingEntries
        .filter(a => a.routes?.length)
        .flatMap(a => ({parentPath: a.path ?? '/', routes: a.routes ?? []}))
        .map(a => findDuplicates(a.routes, a.parentPath))]
        .filter(a => !Array.isArray(a) || a.length);
}


function normalizePath(path: string): string {
    const pathParts = path.split("/");

    return pathParts
        .map(path => path.replace(/\:.*/, ":PLACEHOLDER"))
        .join("/")
}



