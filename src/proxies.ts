import type { Request, Response } from 'express';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import { getEnv } from '@/common/env';

const {
    HOME_BASE_URL,
    NOTICE_BASE_URL,
    PLACE_BASE_URL,
    PROJECT_BASE_URL,
    AUTH_BASE_URL,
} = getEnv();

const proxyErrorHandler = (err: Error, req: Request) => {
    console.error('[ERROR] 프록시 에러 발생');
    console.error(`요청 정보: ${req.method} ${req.url}`);
    console.error(`스택 트레이스: ${err.stack}`);
};

export const homeProxy = createProxyMiddleware<Request, Response>({
    target: HOME_BASE_URL,
    logger: console,
    on: {
        proxyRes: (proxyRes) => {
            delete proxyRes.headers['transfer-encoding'];
        },
        error: proxyErrorHandler,
    },
});

export const projectProxy = createProxyMiddleware<Request, Response>({
    target: PROJECT_BASE_URL,
    logger: console,
    on: {
        error: proxyErrorHandler,
    },
});

export const placeProxy = createProxyMiddleware<Request, Response>({
    target: PLACE_BASE_URL,
    logger: console,
    on: {
        proxyRes: (proxyRes) => {
            delete proxyRes.headers['transfer-encoding'];
        },
        error: proxyErrorHandler,
    },
});

export const noticeProxy = createProxyMiddleware<Request, Response>({
    target: NOTICE_BASE_URL,
    logger: console,
    on: {
        error: proxyErrorHandler,
    },
});

export const authProxy = createProxyMiddleware<Request, Response>({
    target: AUTH_BASE_URL,
    logger: console,
    on: {
        error: proxyErrorHandler,
        proxyRes: (proxyRes) => {
            delete proxyRes.headers['transfer-encoding'];
        },
    },
});

export const adminHomeProxy = createProxyMiddleware<Request, Response>({
    target: HOME_BASE_URL,
    pathRewrite: {
        '^': '/admin',
    },
    on: {
        error: proxyErrorHandler,
        proxyReq: fixRequestBody,
        proxyRes: (proxyRes) => {
            delete proxyRes.headers['transfer-encoding'];
        },
    },
});

export const adminPlaceProxy = createProxyMiddleware<Request, Response>({
    target: PLACE_BASE_URL,
    pathRewrite: {
        '^': '/admin',
    },
    on: {
        error: proxyErrorHandler,
        proxyReq: fixRequestBody,
        proxyRes: (proxyRes) => {
            delete proxyRes.headers['transfer-encoding'];
        },
    },
});

export const adminNoticeProxy = createProxyMiddleware<Request, Response>({
    target: NOTICE_BASE_URL,
    pathRewrite: {
        '^': '/admin',
    },
    on: {
        error: proxyErrorHandler,
        proxyReq: fixRequestBody,
    },
});

export const adminProjectProxy = createProxyMiddleware<Request, Response>({
    target: PROJECT_BASE_URL,
    pathRewrite: {
        '^': '/admin',
    },
    on: {
        error: proxyErrorHandler,
        proxyReq: fixRequestBody,
    },
});
