const Redis = require('ioredis');
require('dotenv').config()
const redisOptions = {
  host: 'localhost',
  port: 6379,
};

const redisClient = new Redis(process.env.REDIS_CLIENT);

module.exports = redisClient;
