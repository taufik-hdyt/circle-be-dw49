import { createClient } from "redis"

const redisClient = createClient({
  password: 'vYHQHVp1k78wWUN4ZvwchobrGqaHrAQZ',
  socket: {
    host: 'redis-14312.c281.us-east-1-2.ec2.cloud.redislabs.com',
    port: 14312
}
})

redisClient.on("error",(error)=> {
  console.log("Redis Client", error);
  process.exit(1)
})

export default redisClient

export async function redisConnect(){
  try {
    await redisClient.connect()
    console.log("Connected to Redis, Ready to caching All Your Sin");
  } catch (error) {
    console.log("Redis Client", error);
    process.exit(1);
  }
}

export const DEFAULT_EXPIRATION = 3600;