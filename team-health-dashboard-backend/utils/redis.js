const redis = require('redis');

const redisClient = redis.createClient({
    host: 'localhost',
    port:  6379,
  });

  (async () => {
    try {
        await redisClient.connect();
    } catch (err) {
        console.error('Failed to connect to Redis:', err);
    }
})();

  module.exports = redisClient;
