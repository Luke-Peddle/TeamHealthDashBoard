const storyCardModules = require('../modules/storyCardsModules');
const redisClient = require('../utils/redis');

const storyCardController = {
    async createStoryCard(req, res) {

        const { discription, project } = req.body;
        const newStoryCard = await storyCardModules.createStoryCard( discription, project);
        await redisClient.del(`storyCard_Project:${project}`)
        res.status(201).json(newStoryCard);
    },

    async getAllStoryCards(req, res) {

        const storyCard = await storyCardModules.getAllStoryCards();
        res.status(201).json(storyCard);
    },

    async getStoryCardById(req, res) {
        console.log(req.params)
        const id = req.params.id;
        console.log("id: " + id)
    
        const cacheKey = `storyCard:${id}`;
        // const cacheData = await redisClient.get(cacheKey);
        
        if(cacheData){
            const storyCard = JSON.parse(cacheData)
            console.log(storyCard);
            return res.status(201).json(storyCard)
                }

    
         const storyCard = await storyCardModules.getStoryCardById(id);
         await redisClient.set(`storyCard:${id}`, JSON.stringify(storyCard));
         console.log(storyCard)
         return JSON.parse(storyCard);
    },


    async getStoryCardByProjectId(req, res) {
        console.log(req.params)
        const id = req.params.id;
        console.log("id: " + id)
    
        const cacheKey = `storyCard_Project:${id}`;
            const cacheData = await redisClient.get(cacheKey);
        
            if(cacheData){
              const storyCards = JSON.parse(cacheData)
              console.log(storyCards);
              return res.status(201).json(storyCards)
                    }
    
    
         const storyCards = await storyCardModules.getStoryCardsByProjectId(id);
          await redisClient.set(`storyCard_Project:${id}`, JSON.stringify(storyCards));
         console.log("storyCards: " + storyCards)
         res.status(201).json(storyCards);
    },

    async updateStoryCarde(req, res) {
        console.log(req.params);
        const id = req.params.id;
        const { discription } = req.body;
         const updatedStoryCard = await storyCardModules.updatStoryCard(id,discription);
         await redisClient.del(`storyCard:${id}`)
         res.status(201).json(updatedStoryCard);   
    },
    async DeleteStoryCard(req, res) {

        console.log(req.params)
        const id = req.params.id;
        const Project_id = req.params.Project_id;
        console.log("id: " + id)
        const response = await storyCardModules.deleteStoryCard(id);
        await redisClient.del(`storyCard:${id}`)
        await redisClient.del(`storyCard_Project:${Project_id}`)
         res.status(201).json(response);
    },
}

module.exports = storyCardController;