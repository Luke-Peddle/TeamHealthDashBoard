const redisClient = require('../utils/redis')


const clearCacheController ={
    async clearCache(){
       redisClient.flushAll()
    },
}

module.exports = clearCacheController;