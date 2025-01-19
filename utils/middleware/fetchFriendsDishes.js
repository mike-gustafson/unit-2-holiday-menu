const Dish = require('../../models/dish');

const fetchFriendsDishes = async (user) => {
    const friendsDishes = [];
    for (const friend of user.connections) {
        const friendDishes = await Dish.find({ _id: { $in: friend.dishes } }).populate('user');
        friendsDishes.push(...friendDishes);
    }
    return friendsDishes;
}

module.exports = fetchFriendsDishes;