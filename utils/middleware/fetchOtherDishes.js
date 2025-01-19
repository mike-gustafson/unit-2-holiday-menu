const Dish = require('../../models/dish');

const fetchOtherDishes = async (user) => {
    const data = await Dish.find({
        user: { $nin: [...user.connections, user._id, ...user.favoriteDishes] }
    }).populate('user');
    return data;
}

module.exports = fetchOtherDishes;