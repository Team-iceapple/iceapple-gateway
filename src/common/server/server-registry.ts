import { getEnv } from '@/common/env';

const Env = getEnv();

const ServerRegistry = {
    home: Env.HOME_BASE_URL,
    notice: Env.NOTICE_BASE_URL,
    place: Env.PLACE_BASE_URL,
    project: Env.PROJECT_BASE_URL,
} as const;

export function getServerBaseUrlFromServiceName(service: string): string {
    console.log('serviceName', service);
    return ServerRegistry[service as keyof typeof ServerRegistry];
}

export function isServerBaseUrlFromServiceName(service: string): boolean {
    return Object.hasOwn(ServerRegistry, service);
}
