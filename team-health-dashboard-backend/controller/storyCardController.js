const storyCardModules = require('../modules/storyCardsModules');
const redisClient = require('../utils/redis');

const storyCardController = {
    async createStoryCard(req, res) {

        const { discription, sprint } = req.body;
        const newStoryCard = await storyCardModules.createStoryCard( discription, sprint);
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
        const cacheData = await redisClient.get(cacheKey);
        
        // if(cacheData){
        //     const projects = JSON.parse(cacheData)
        //     console.log(projects);
        //     res.status(201).json(projects)
        //         }

    
         const storyCard = await storyCardModules.getStoryCardById(id);
         await redisClient.set(`sprint:${id}`, JSON.stringify(storyCard));
         console.log(storyCard)
         res.status(201).json(storyCard);
    },


    async getStoryCardBySprintId(req, res) {
        console.log(req.params)
        const id = req.params.id;
        console.log("id: " + id)
    
        const cacheKey = `storyCards:${id}`;
            const cacheData = await redisClient.get(cacheKey);
        
            if(cacheData){
              const storyCards = JSON.parse(cacheData)
              console.log(storyCards);
              res.status(201).json(storyCards)
                    }
    
    
         const storyCards = await storyCardModules.getStoryCardsBySprintId(id);
         await redisClient.set(`storyCards:${id}`, JSON.stringify(storyCards));
         console.log(storyCards)
         res.status(201).json(storyCards);
    },

    async updateStoryCarde(req, res) {
        console.log(req.params);
        const id = req.params.id;
        const { discription } = req.body;
         const updatedStoryCard = await storyCardModules.updatStoryCard(id,discription);
         res.status(201).json(updatedStoryCard);   
    },
    async DeleteStoryCard(req, res) {

        console.log(req.params)
        const id = req.params.id;
        console.log("id: " + id)
        const response = await storyCardModules.deleteStoryCard(id);    
         res.status(201).json(response);
    },
}

module.exports = storyCardController;