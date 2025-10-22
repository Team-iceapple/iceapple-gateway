import express from 'express';
import {
    authProxy,
    homeProxy,
    noticeProxy,
    placeProxy,
    projectProxy,
} from '@/proxies.ts';
import { adminProxyRouter } from '@/routes/admin.ts';

const apiRouter = express.Router();

apiRouter.use('/home', homeProxy);
apiRouter.use('/project', projectProxy);
apiRouter.use('/place', placeProxy);
apiRouter.use('/notice', noticeProxy);
apiRouter.use('/auth', authProxy);

apiRouter.use('/admin', adminProxyRouter);

export { apiRouter };
