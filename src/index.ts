import { IO } from 'fp-ts/lib/IO';
import { pipe } from 'fp-ts/lib/pipeable';
import { of, throwError } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { r, httpListener, createServer, use, HttpError, HttpStatus, combineRoutes } from '@marblejs/core';
import { logger$ } from '@marblejs/middleware-logger';
import { requestValidator$, t } from '@marblejs/middleware-io';

const user1 = { id: '1', name: 'Bob' };
const user2 = { id: '2', name: 'Alice' };

const getUsersHandler = () =>
    of([ user1, user2 ]);

const getUserHandler = (id: string) => {
    switch (id) {
        case '1':
            return of(user1);
        case '2':
            return of(user2);
        default:
            return throwError(new Error('user not found'));
    }
}

const getUsers$ = r.pipe(
    r.matchPath('/'),
    r.matchType('GET'),
    r.useEffect(req$ => req$.pipe(
        mergeMap(getUsersHandler),
        map(body => ({ body }))
    ))
);

const getUserRequestValidator$ = requestValidator$({
    params: t.type({
        id: t.string
    }),
});

const getUser$ = r.pipe(
    r.matchPath('/:id'),
    r.matchType('GET'),
    r.useEffect(req$ => req$.pipe(
        use(getUserRequestValidator$),
        mergeMap(req => pipe(
            getUserHandler(req.params.id),
            catchError(() => throwError(
                new HttpError('user does not exist', HttpStatus.NOT_FOUND)
            ))
        )),
        map(body => ({ body })),
    )),
);

const users$ = combineRoutes('/users', [
    getUser$,
    getUsers$
]);

const apiV1$ = combineRoutes('/api/v1', [
    users$
]);

const middlewares = [
    logger$()
];

const effects = [
    apiV1$
];

const server = createServer({
    port: 8080,
    hostname: '0.0.0.0',
    listener: httpListener({ middlewares, effects }),
});

const main: IO<void> = async () => await (await server)();

main();
