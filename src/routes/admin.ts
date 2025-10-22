import express from 'express';
import { authMiddleware } from '@/middleware/auth.middleware.ts';
import {
    adminHomeProxy,
    adminNoticeProxy,
    adminPlaceProxy,
    adminProjectProxy,
} from '@/proxies.ts';

const adminProxyRouter = express.Router();

adminProxyRouter.use(authMiddleware);
adminProxyRouter.use('/home', adminHomeProxy);
adminProxyRouter.use('/place', adminPlaceProxy);
adminProxyRouter.use('/notice', adminNoticeProxy);
adminProxyRouter.use('/project', adminProjectProxy);

export { adminProxyRouter };
