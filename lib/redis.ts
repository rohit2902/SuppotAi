import { createClient } from "redis";

const redis = createClient({
    url:process.env.REDIS_URL
})
redis.on("error", (err) => {
  console.error("Redis Client Error:", err);
});
let connected = false;

 async function getRedis() {
  if (!connected) {
    await redis.connect();
    connected = true;
  }

  return redis;
}
export default getRedis