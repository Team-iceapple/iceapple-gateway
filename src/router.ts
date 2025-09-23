import type { Request, Response } from 'express';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { getEnv } from '@/common/env';
import { getServerBaseUrlFromServiceName } from '@/common/server';
import { authMiddleware } from '@/middleware/auth.middleware.ts';
import { routeValidateMiddleware } from '@/middleware/route-validate.middleware.ts';

const {
    HOME_BASE_URL,
    NOTICE_BASE_URL,
    PLACE_BASE_URL,
    PROJECT_BASE_URL,
    AUTH_BASE_URL,
} = getEnv();
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
    '/auth',
    createProxyMiddleware<Request, Response>({
        target: AUTH_BASE_URL,
        logger: console,
        on: {
            error: (err, req, res) => {
                console.error('[ERROR] 프록시 에러 발생');
                console.error(`요청 정보: ${req.method} ${req.url}`);
                console.error(`스택 트레이스: ${err.stack}`);
            },
            proxyReq: (proxyReq, req, res) => {
                console.log('--- 프록시 -> 인증 서버 요청 ---');
                console.log('요청 URL:', proxyReq.path);
                console.log('요청 헤더:', proxyReq.getHeaders());
                if (req.body) {
                    console.log('전처리 전 바디', req.body);
                    const bodyData = JSON.stringify(req.body);
                    proxyReq.setHeader('Content-Type', 'application/json');
                    proxyReq.setHeader(
                        'Content-Length',
                        Buffer.byteLength(bodyData),
                    );
                    proxyReq.write(bodyData);
                    console.log('요청 바디:', bodyData);
                } else {
                    console.log('요청 바디: 없음 (req.body is empty)');
                }
            },
            proxyRes: (proxyRes, req, res) => {
                console.log('--- 인증 서버 -> 프록시 서버 응답 ---');
                console.log('응답 상태 코드:', proxyRes.statusCode);
                console.log('응답 헤더:', proxyRes.headers);
                let responseBody = '';
                proxyRes.on('data', (chunk) => {
                    responseBody += chunk.toString();
                });
                proxyRes.on('end', () => {
                    console.log('응답 바디:', responseBody);
                    console.log('------------------------------------');
                });
            },
        },
        changeOrigin: true,
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
