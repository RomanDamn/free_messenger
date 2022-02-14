const {
    User, Favorite
} = require("../models");

module.exports.addToFavorites = async function (req, res) {
    const isExist = await Favorite.findOne({
        where: {
            subscriberId: req.body.subscriberId,
            subscribedId: req.body.subscribedId
        }
    })

    if(!isExist){
        try {
            const addToFavorites = await Favorite.create({
                subscriberId: req.body.subscriberId,
                subscribedId: req.body.subscribedId,
            })
            return res.status(200).json(addToFavorites)
        } catch (err) {
            console.log("Promise Rejected", err);
        }
    }
    return res.status(304);

    

}


module.exports.removeFromFavorites = async function (req, res) {
    const isExist = await Favorite.findOne({
        where: {
            subscriberId: req.body.subscriberId,
            subscribedId: req.body.subscribedId
        }
    })
    if(isExist){
        try {
            const removeFromFavorites = await Favorite.destroy({
                where: {
                    subscriberId: req.body.subscriberId,
                    subscribedId: req.body.subscribedId,
                }
            })
            return res.status(200).json("Deleted Succesfully")
        } catch (err) {
            console.log("Promise Rejected", err);
        }
    }
    return res.status(301)
    

}


module.exports.getAllFavorites = async function (req, res) {
    try {
        // const getAllFavorites = await User.findAll({attributes: ['id', 'username'], include: [{model: Favorite, attributes: ["subscriberId"]}, "id"]})
        // return res.status(200).json(getAllFavorites)
        const getAllFavoritesOfUser = await Favorite.findAll({
            where: {
                subscriberId: 1
            },
            attributes: ['subscribedId']
        })
        const getAllFavoritUsers = await Promise.all(getAllFavoritesOfUser.map(async function (user) {
            const findAll = await User.findOne({
                where: {
                    id: user.subscribedId
                },
                attributes: ['id', 'username']
            }).catch(function (err) {
                console.log("Promise Rejected", err);
            });
            return findAll;
        })
        )
        return res.status(200).json(getAllFavoritUsers)
    } catch (err) {
        console.log("Promise Rejected", err);
    }

}