const Redis = require('ioredis');
const config = require('../configs/config.json');

const redis = new Redis({
  host: config?.redis?.host,
  port: config?.redis?.port,
  password: config?.redis?.password,
  maxRetriesPerRequest: null,  // Disable automatic retries to avoid unnecessary delay
  enableOfflineQueue: false 
});

redis.on('connect', () => {
  console.log('Connected to Redis');
});

redis.on('error', (err) => {
    console.log(`Redis error: ${err}`);
});

module.exports = redis;
