import { redisClient } from "@config/redis";

export const getCache = async <T>(
    key: string
): Promise<T | null> => {

    const data = await redisClient.get(key);

    if (!data) {
        return null;
    }

    return JSON.parse(data) as T;
};


export const setCache = async (
    key: string,
    data: unknown,
    ttl: number = 300
) => {

    await redisClient.setEx(
        key,
        ttl,
        JSON.stringify(data)
    );
};


export const deleteCache = async (
    key: string
) => {

    await redisClient.del(key);
};


export const getCacheVersion = async (
    resource: string
): Promise<number> => {

    const key = `${resource}:version`;

    const version = await redisClient.get(key);

    if (!version) {
        await redisClient.set(key, "1");
        return 1;
    }

    return Number(version);
};


export const incrementCacheVersion = async (
    resource: string
): Promise<number> => {

    return await redisClient.incr(
        `${resource}:version`
    );
};