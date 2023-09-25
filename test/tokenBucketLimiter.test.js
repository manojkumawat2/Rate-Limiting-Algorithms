const assert = require('assert');
const { describe } = require('node:test');
const rateLimitUsingTokenBucket = require('../src/tokenBucketLimiter');
const redisClient = require('../src/redisClient');

const sleep = () => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(true), 20000);
    })
}

describe('Token Bucket rate limit alogithm testing', () => {
    it('Test Cases', async () => {
        const userId = 123;
        const intervalInSeconds = 15;
        const maximumRequests = 3;

        // delete the cache
        (await redisClient).del(`${userId}_requests_counter`);

        const isRequestAllowed1 = await rateLimitUsingTokenBucket(userId, intervalInSeconds, maximumRequests);
        assert(isRequestAllowed1 === true, 'Test 1');

        const isRequestAllowed2 = await rateLimitUsingTokenBucket(userId, intervalInSeconds, maximumRequests);
        assert(isRequestAllowed2 === true, 'Test 2');

        const isRequestAllowed3 = await rateLimitUsingTokenBucket(userId, intervalInSeconds, maximumRequests);
        assert(isRequestAllowed3, true, 'Test 3');

        const isRequestAllowed4 = await rateLimitUsingTokenBucket(userId, intervalInSeconds, maximumRequests);
        assert(isRequestAllowed4 === false, 'Test 4');

        await sleep();

        const isRequestAllowed5 = await rateLimitUsingTokenBucket(userId, intervalInSeconds, maximumRequests);
        assert(isRequestAllowed5 === true, 'Test 5');
    });
});