import type { Handler } from 'express';

export const authMiddleware: Handler = (req, res, next) => {
    console.log(
        '추후, 인증 서버에 인증 요청 후 인증이 완료된 경우에만 next()호출',
    );

    next();
};
