const redisClient = require('./redisClient');

async function rateLimitUsingTokenBucket(userId, intervalInSeconds, maximumRequests) {
    let client = await redisClient;

    try {
        const cacheKey = `${userId}_requests_counter`;
        // Get the current token counter from Redis
        const requestsCount = await client.incr(cacheKey);

        if (requestsCount === 1) {
            await client.expire(cacheKey, intervalInSeconds);
        }

        if (requestsCount <= maximumRequests) {
            return true;
        }

        // Too many requests: reject the request
        return false;

    } catch (err) {
        console.log(err);
        return false;
    }
}

module.exports = rateLimitUsingTokenBucket;