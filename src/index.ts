import cors from 'cors';
import express from 'express';
import { getEnv } from '@/common/env';
import { requestLogger } from '@/middleware/request-logger.ts';
import proxyRouter from '@/router.ts';

const { PORT } = getEnv();
const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use('/api', proxyRouter);

app.listen(PORT, () => {
    console.info(`Server Running on port: ${PORT}`);
});
