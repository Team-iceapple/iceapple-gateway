import type { NextFunction, Request, RequestHandler, Response } from 'express';
import proxy from 'express-http-proxy';
import { getEnv } from '@/common/env';

const {
    HOME_BASE_URL,
    NOTICE_BASE_URL,
    PLACE_BASE_URL,
    PROJECT_BASE_URL,
    AUTH_BASE_URL,
} = getEnv();

const proxyErrorHandler = (err: Error, res: Response, next: NextFunction) => {
    console.error('[ERROR] 프록시 에러 발생');
    console.error(`스택 트레이스: ${err.stack}`);
    next(err);
};

const createProxyReqPathResolver = (baseUrl: string) => {
    return (req: Request) => {
        console.log('req.url', req.url);
        console.log(`Proxying request to: ${baseUrl + req.url}`);
        return req.url;

        // const newPath = req.url.replace(/^\/[^/]+/, '');
        // const finalPath = newPath || '/';
        //
        // console.log(`Proxying request to: ${baseUrl + finalPath}`);
        //
        // return finalPath;
    };
};

const createAdminProxyReqPathResolver = (baseUrl: string) => {
    return (req: Request) => {
        const newPath = req.url.replace(/^\/[^/]+/, '');
        const finalPath = newPath || '/';

        const longPath = `/admin/${finalPath}`;
        console.log(`Proxying request to: ${baseUrl + longPath}`);

        return longPath;
    };
};

const createProxy = (baseUrl: string): RequestHandler => {
    return (req, res, next) => {
        const isMultipart = req.headers['content-type']?.includes(
            'multipart/form-data',
        );

        proxy(baseUrl, {
            parseReqBody: !isMultipart,
            proxyReqPathResolver: createProxyReqPathResolver(baseUrl),
            proxyErrorHandler,
        })(req, res, next);
    };
};

const createAdminProxy = (baseUrl: string): RequestHandler => {
    return (req, res, next) => {
        const isMultipart = req.headers['content-type']?.includes(
            'multipart/form-data',
        );

        proxy(baseUrl, {
            parseReqBody: !isMultipart,
            proxyReqPathResolver: createAdminProxyReqPathResolver(baseUrl),
            proxyErrorHandler,
        })(req, res, next);
    };
};

export const homeProxy = createProxy(HOME_BASE_URL);
export const projectProxy = createProxy(PROJECT_BASE_URL);
export const placeProxy = createProxy(PLACE_BASE_URL);
export const noticeProxy = createProxy(NOTICE_BASE_URL);
export const authProxy = createProxy(AUTH_BASE_URL);

export const adminHomeProxy = createAdminProxy(HOME_BASE_URL);
export const adminPlaceProxy = createAdminProxy(PLACE_BASE_URL);
export const adminNoticeProxy = createAdminProxy(NOTICE_BASE_URL);
export const adminProjectProxy = createAdminProxy(PROJECT_BASE_URL);
