import { createClient } from 'redis';
const client = createClient({ url: process.env.REDIS_LOCAL_URL });

//REDIS CONNECTION
client.on('connect', function () {
  console.log('Connected to Redis!');
});

client.on('error', function (err) {
  console.error('Redis error:' + err);
});

export default client;