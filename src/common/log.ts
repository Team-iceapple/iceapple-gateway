import type { OnProxyEvent } from 'http-proxy-middleware/dist/types';

export const onLogger: OnProxyEvent = {
    proxyReq: (proxyReq, req, res) => {
        const originalRequestInfo = {
            client_ip: req.socket.remoteAddress,
            method: req.method,
            url: req.url,
            headers: req.headers,
        };

        const proxyRequestInfo = {
            host: proxyReq.host,
            path: proxyReq.path,
            method: proxyReq.method,
            headers: proxyReq.getHeaders(),
        };

        console.info(
            `[REQUEST] 클라이언트 요청: ${JSON.stringify(originalRequestInfo, null, 2)}`,
        );

        // 요청 본문(body)을 로깅하기 위해서는 이 프록시 미들웨어 이전에
        // express.json()과 같은 body-parser가 적용되어 있어야 합니다.
        if ((req as any).body) {
            console.info(
                `[REQUEST] 클라이언트 요청 본문: ${JSON.stringify((req as any).body, null, 2)}`,
            );
        }

        console.info(
            `[PROXY] 서비스로 전달하는 요청: ${JSON.stringify(proxyRequestInfo, null, 2)}`,
        );
    },

    proxyRes: (proxyRes, req, res) => {
        const responseInfo = {
            statusCode: proxyRes.statusCode,
            statusMessage: proxyRes.statusMessage,
            headers: proxyRes.headers,
        };

        console.info(
            `[RESPONSE] 서비스로부터 받은 응답: ${JSON.stringify(responseInfo, null, 2)}`,
        );

        const bodyChunks: Uint8Array[] = [];
        proxyRes.on('data', (chunk) => {
            bodyChunks.push(chunk as Uint8Array);
        });

        proxyRes.on('end', () => {
            if (bodyChunks.length === 0) {
                console.info('[RESPONSE] 서비스 응답 본문: (없음)');
                return;
            }

            const responseBody = Buffer.concat(bodyChunks).toString('utf8');
            let formattedBody = responseBody;

            try {
                const jsonBody = JSON.parse(responseBody);
                formattedBody = JSON.stringify(jsonBody, null, 2);
            } catch (e) {
                // JSON 파싱 실패 시 원본 텍스트 사용
            }

            console.info(`[RESPONSE] 서비스 응답 본문:\n${formattedBody}`);
        });
    },

    error: (err, req, res) => {
        console.error('[ERROR] 프록시 에러 발생');
        console.error(`요청 정보: ${req.method} ${req.url}`);
        console.error(`스택 트레이스: ${err.stack}`);
    },
};
