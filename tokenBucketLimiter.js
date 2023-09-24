const redisClient = require('./redisClient');

async function rateLimitUsingTokenBucket(userId, intervalInSeconds, maximumRequests) {
    let client = await redisClient;

    try {
        const cacheKey = `${userId}_requests_counter`;
        // Get the current token counter from Redis
        const currentTokens = (await client.get(cacheKey)) || 0;
        
        if (currentTokens < maximumRequests) {
            // If there are available tokens, decrement and proceed
            await client.setEx(cacheKey, intervalInSeconds, currentTokens + 1);
            return true;
        }

        // Too many requests: reject the request
        return false;

    } catch (err) {
        console.log(err);
        return false;
    }
}

const ans = rateLimitUsingTokenBucket(1234, 60, 10);
console.log(ans);