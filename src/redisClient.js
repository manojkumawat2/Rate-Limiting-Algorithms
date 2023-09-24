const { createClient } = require('redis');

async function createRedisClient() {
    let client;

    try {
        client = await createClient().connect();

        return client;
    } catch (error) {
        console.error('Error connecting to Redis:', error);
        throw error;
    }
}

module.exports = createRedisClient();
