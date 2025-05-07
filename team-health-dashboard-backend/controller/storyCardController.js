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
}

module.exports = storyCardController;