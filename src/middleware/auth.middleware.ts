import type { Handler } from 'express';
import { getEnv } from '@/common/env';

const { AUTH_BASE_URL } = getEnv();

export const authMiddleware: Handler = async (req, res, next) => {
    try {
        const { authorization } = req.headers;

        if (!authorization) {
            return res
                .status(401)
                .json({ message: 'Authorization header is required.' });
        }

        const response = await fetch(`${AUTH_BASE_URL}/validate`, {
            headers: {
                Authorization: authorization,
            },
        });

        if (!response.ok)
            return res.status(401).json({ message: 'Unauthorized.' });

        next();
    } catch (error) {
        console.error('Authentication middleware error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
