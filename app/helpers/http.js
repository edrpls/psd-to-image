import * as cli from 'http-client';

const apiBase = cli.base('/api');

const request = _method => (endpoint, data = {}) => {
    const params = data instanceof FormData ? cli.body : cli.params;
    return cli.createFetch(
        apiBase,
        cli.auth('Bearer ' + localStorage.jwt),
        cli.method(_method),
        params(data),
        cli.parseJSON(),
        cli.onResponse(r => r.jsonData)
    )(endpoint);
}

const requestAsJSON = _method => (endpoint, data = {}) => {
    return cli.createFetch(
        apiBase,
        cli.auth('Bearer ' + localStorage.jwt),
        cli.method(_method),
        cli.json(data),
        cli.parseJSON(),
        cli.onResponse(r => r.jsonData)
    )(endpoint);
};

export const del   = request('DELETE');
export const get   = request('GET');
export const post  = request('POST');
export const postAsJSON  = requestAsJSON('POST');
export const put   = request('PUT');
export const putAsJSON  = requestAsJSON('PUT');
export const login = user => {
    const basicAuth = new Buffer(user.email + ':' + user.password).toString('base64');
    return cli.createFetch(
        apiBase,
        cli.auth('Basic ' + basicAuth),
        cli.parseJSON(),
        cli.onResponse(r => r.jsonData)
    )('/user/login');
}
