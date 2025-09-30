import express from 'express';
import { authMiddleware } from '@/middleware/auth.middleware';
import { routeValidateMiddleware } from '@/middleware/route-validate.middleware';
import {
    adminProxy,
    authProxy,
    homeProxy,
    noticeProxy,
    placeProxy,
    projectProxy,
} from '@/proxies';

const proxyRouter = express.Router();

proxyRouter.use('/home', homeProxy);
proxyRouter.use('/project', projectProxy);
proxyRouter.use('/place', placeProxy);
proxyRouter.use('/notice', noticeProxy);
proxyRouter.use('/auth', authProxy);
proxyRouter.use(
    '/admin/:service',
    express.json(),
    routeValidateMiddleware,
    authMiddleware,
    adminProxy,
);

export default proxyRouter;
