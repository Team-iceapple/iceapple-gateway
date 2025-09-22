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

        console.log('[AuthMiddleware] 인증서버로 인증 요청...');
        const response = await fetch(`${AUTH_BASE_URL}/validate`, {
            headers: {
                Authorization: authorization,
            },
        });

        console.log('인증 결과', await response.json());

        if (!response.ok)
            return res
                .status(401)
                .json({ message: (await response.json()).message });

        next();
    } catch (error) {
        console.error('Authentication middleware error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
