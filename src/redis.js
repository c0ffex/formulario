const Redis = require('ioredis');

const redisOptions = {
  host: 'localhost',
  port: 6379,
};

const redisClient = new Redis(redisOptions);

module.exports = redisClient;
