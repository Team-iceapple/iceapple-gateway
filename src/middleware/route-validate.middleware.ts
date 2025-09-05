import type { RequestHandler } from 'express';
import { isServerBaseUrlFromServiceName } from '@/common/server';

export const routeValidateMiddleware: RequestHandler = (req, res, next) => {
    const service = req.params.service;

    if (!isServerBaseUrlFromServiceName(service)) {
        res.status(404).send({
            status: 404,
            message: `Cannot GET ${req.path}`,
            error: 'Not Found',
            path: req.path,
        });
        return;
    }

    next();
};
