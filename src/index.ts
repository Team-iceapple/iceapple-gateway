import type { Request, Response } from 'express';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { authMiddleware } from '@/middleware/auth.middleware.ts';
import { requestLogger } from '@/middleware/request-logger.ts';
import {getEnv} from '@/common/env';
import {getServerBaseUrlFromServiceName} from '@/common/server';

const env = getEnv();
const app = express();

app.use(requestLogger);
app.use(
    '/project',
    createProxyMiddleware<Request, Response>({
        target: env.PROJECT_BASE_URL,
        logger: console,
    }),
);

app.use(
    '/place',
    createProxyMiddleware<Request, Response>({
        target: env.PLACE_BASE_URL,
        logger: console,
    }),
);

app.use(
    '/notice',
    createProxyMiddleware<Request, Response>({
        target: env.NOTICE_BASE_URL,
        logger: console,
    }),
);

app.use(
    '/home',
    createProxyMiddleware<Request, Response>({
        target: env.HOME_BASE_URL,
        logger: console,
    }),
);

app.use(
    '/:service/admin',
    authMiddleware,
    createProxyMiddleware<Request, Response>({
        target: `http://localhost:${env.PORT}`,
        router: (req) => getServerBaseUrlFromServiceName(req.params.service),
        pathRewrite: {
            '^/[^/]+/admin': '/admin',
        },
        on: {
            proxyReq: (req) => console.log(req.host, req.path),
        }
    }),
);

app.listen(env.PORT, () => {
    console.info(`Server Running on port: ${env.PORT}`);
});
