import type { Request, Response } from 'express';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { getEnv } from '@/common/env';
import { getServerBaseUrlFromServiceName } from '@/common/server';
import { authMiddleware } from '@/middleware/auth.middleware.ts';
import { routeValidateMiddleware } from '@/middleware/route-validate.middleware.ts';

const { HOME_BASE_URL, NOTICE_BASE_URL, PLACE_BASE_URL, PROJECT_BASE_URL } =
    getEnv();
const proxyRouter = express.Router();

proxyRouter.use(
    '/home',
    createProxyMiddleware<Request, Response>({
        target: HOME_BASE_URL,
        logger: console,
        on: {
            proxyRes: (proxyRes, req, res) => {
                delete proxyRes.headers['transfer-encoding'];
            },
            error: (err, req, res) => {
                console.error('[ERROR] 프록시 에러 발생');
                console.error(`요청 정보: ${req.method} ${req.url}`);
                console.error(`스택 트레이스: ${err.stack}`);
            },
        },
    }),
);

proxyRouter.use(
    '/project',
    createProxyMiddleware<Request, Response>({
        target: PROJECT_BASE_URL,
        logger: console,
        on: {
            error: (err, req, res) => {
                console.error('[ERROR] 프록시 에러 발생');
                console.error(`요청 정보: ${req.method} ${req.url}`);
                console.error(`스택 트레이스: ${err.stack}`);
            },
        },
    }),
);

proxyRouter.use(
    '/place',
    createProxyMiddleware<Request, Response>({
        target: PLACE_BASE_URL,
        logger: console,
        on: {
            proxyRes: (proxyRes, req, res) => {
                delete proxyRes.headers['transfer-encoding'];
            },
            error: (err, req, res) => {
                console.error('[ERROR] 프록시 에러 발생');
                console.error(`요청 정보: ${req.method} ${req.url}`);
                console.error(`스택 트레이스: ${err.stack}`);
            },
        },
    }),
);

proxyRouter.use(
    '/notice',
    createProxyMiddleware<Request, Response>({
        target: NOTICE_BASE_URL,
        logger: console,
        on: {
            error: (err, req, res) => {
                console.error('[ERROR] 프록시 에러 발생');
                console.error(`요청 정보: ${req.method} ${req.url}`);
                console.error(`스택 트레이스: ${err.stack}`);
            },
        },
    }),
);

proxyRouter.use(
    '/admin/:service',
    routeValidateMiddleware,
    authMiddleware,
    createProxyMiddleware<Request, Response>({
        router: (req) => getServerBaseUrlFromServiceName(req.params.service),
        pathRewrite: {
            '^/': '/admin/',
        },
        on: {
            error: (err, req, res) => {
                console.error('[ERROR] 프록시 에러 발생');
                console.error(`요청 정보: ${req.method} ${req.url}`);
                console.error(`스택 트레이스: ${err.stack}`);
            },
        },
    }),
);

export default proxyRouter;
