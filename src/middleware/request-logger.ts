import type { RequestHandler } from 'express';

export const requestLogger: RequestHandler = (req, res, next) => {
    const id = Math.random().toString(16).substring(2, 8);
    const { originalUrl, method } = req;

    console.log(`[REQUEST] ${id} ${method} ${originalUrl}`);

    res.on('finish', () => {
        const { statusCode } = res;
        console.log(`[RESPONSE] ${id} ${statusCode} ${originalUrl}`);
    });

    next();
};
