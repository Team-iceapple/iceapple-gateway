import type { Request, Response } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { getEnv } from '@/common/env';
import { getServerBaseUrlFromServiceName } from '@/common/server';
import { isSpringServer } from '@/common/server/server-registry';

const {
    HOME_BASE_URL,
    NOTICE_BASE_URL,
    PLACE_BASE_URL,
    PROJECT_BASE_URL,
    AUTH_BASE_URL,
} = getEnv();

export const homeProxy = createProxyMiddleware<Request, Response>({
    target: HOME_BASE_URL,
    logger: console,
    on: {
        proxyRes: (proxyRes) => {
            delete proxyRes.headers['transfer-encoding'];
        },
        error: (err, req) => {
            console.error('[ERROR] 프록시 에러 발생');
            console.error(`요청 정보: ${req.method} ${req.url}`);
            console.error(`스택 트레이스: ${err.stack}`);
        },
    },
});

export const projectProxy = createProxyMiddleware<Request, Response>({
    target: PROJECT_BASE_URL,
    logger: console,
    on: {
        error: (err, req) => {
            console.error('[ERROR] 프록시 에러 발생');
            console.error(`요청 정보: ${req.method} ${req.url}`);
            console.error(`스택 트레이스: ${err.stack}`);
        },
    },
});

export const placeProxy = createProxyMiddleware<Request, Response>({
    target: PLACE_BASE_URL,
    logger: console,
    on: {
        proxyRes: (proxyRes) => {
            delete proxyRes.headers['transfer-encoding'];
        },
        error: (err, req) => {
            console.error('[ERROR] 프록시 에러 발생');
            console.error(`요청 정보: ${req.method} ${req.url}`);
            console.error(`스택 트레이스: ${err.stack}`);
        },
    },
});

export const noticeProxy = createProxyMiddleware<Request, Response>({
    target: NOTICE_BASE_URL,
    logger: console,
    on: {
        error: (err, req) => {
            console.error('[ERROR] 프록시 에러 발생');
            console.error(`요청 정보: ${req.method} ${req.url}`);
            console.error(`스택 트레이스: ${err.stack}`);
        },
    },
});

export const authProxy = createProxyMiddleware<Request, Response>({
    target: AUTH_BASE_URL,
    logger: console,
    on: {
        error: (err, req) => {
            console.error('[ERROR] 프록시 에러 발생');
            console.error(`요청 정보: ${req.method} ${req.url}`);
            console.error(`스택 트레이스: ${err.stack}`);
        },
        proxyReq: (proxyReq, req) => {
            console.log('--- 프록시 -> 인증 서버 요청 ---');
            console.log('요청 URL:', proxyReq.path);
            console.log('요청 헤더:', proxyReq.getHeaders());
            console.log('요청 바디', req.body);
        },
        proxyRes: (proxyRes) => {
            delete proxyRes.headers['transfer-encoding'];

            console.log('--- 인증 서버 -> 프록시 서버 응답 ---');
            console.log('응답 상태 코드:', proxyRes.statusCode);
            console.log('응답 헤더:', proxyRes.headers);
        },
    },
    changeOrigin: true,
});

export const adminProxy = createProxyMiddleware<Request, Response>({
    router: (req) => getServerBaseUrlFromServiceName(req.params.service),
    pathRewrite: {
        '^/': '/admin/',
    },
    on: {
        proxyReq: (proxyReq, req) => {
            if (req.body) {
                const bodyData = JSON.stringify(req.body);
                proxyReq.setHeader('Content-Type', 'application/json');
                proxyReq.setHeader(
                    'Content-Length',
                    Buffer.byteLength(bodyData),
                );
                proxyReq.write(bodyData);
            }
        },
        proxyRes: (proxyRes, req) => {
            if (isSpringServer(req.params.service)) {
                delete proxyRes.headers['transfer-encoding'];
            }
        },
        error: (err, req) => {
            console.error('[ERROR] 프록시 에러 발생');
            console.error(`요청 정보: ${req.method} ${req.url}`);
            console.error(`스택 트레이스: ${err.stack}`);
        },
    },
});
