const Dish = require('../../models/dish');

const fetchFavoriteDishes = async (user) => {
    const favoriteDishes = await Dish.find({ _id: { $in: user.favoriteDishes } })
    .populate('user');
    return favoriteDishes;
}

module.exports = fetchFavoriteDishes;