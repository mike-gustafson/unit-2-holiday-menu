const Dish = require('../models/dish');
const User = require('../models/user');

const cssFile = 'dishes.css';

const diets = require('../utils/data/diets');
const categories = require('../utils/data/dishCategoryOptions');

const fetchOtherDishes = require('../utils/middleware/fetchOtherDishes');
const fetchFriendsDishes = require('../utils/middleware/fetchFriendsDishes');
const fetchUserWithPopulates = require('../utils/middleware/fetchUserWithPopulates');
const fetchFavoriteDishes = require('../utils/middleware/fetchFavoriteDishes');

exports.getDishes = async (req, res) => {
    try {
        const dataToPopulate = ['dishes', 'favoriteDishes', 'eventsHosting', 'eventsAttending', 'connections'];
        const user = await fetchUserWithPopulates(req.user.id, dataToPopulate);
        const favoriteDishes = await fetchFavoriteDishes(user);
        const friendsDishes = await fetchFriendsDishes(user);
        const otherDishes = await fetchOtherDishes(user);
        res.render('layout', {
            userDishes: user.dishes, 
            favoriteDishes,
            otherDishes,
            friendsDishes,
            title: 'Dishes',
            cssFile,
            view: 'dishes/index'});
    } catch (err) {
        console.error('Error getting dishes:', err);
        res.status(500).send('Error getting dishes.');
    }
};

exports.showDish = async (req, res) => {
    try {
        const dish = await Dish.findById(req.params.id);
        const user = await User.findById(req.user.id);
        const isFavorite = user.favoriteDishes.includes(dish._id);
        const dishCreatorName = await dish.getCreator();
        res.render('layout', { 
            dish, 
            isFavorite, 
            dishCreatorName,
            title: dish.name,
            cssFile,
            view: 'dishes/show'
        });
    } catch (err) {
        res.status(500).send('Error getting dish.');
    }
}

exports.newDishForm = (req, res) => {
    res.render('layout', { 
        categories, 
        diets,
        title: 'New Dish',
        cssFile,
        view: 'dishes/new' 
    });
};

exports.createDish = async (req, res) => {
    try {
        const newDish = {
            name: req.body.name.trim(),
            servings: parseInt(req.body.servings),
            diets: req.body.diets || [],
            category: req.body.category.trim().toLowerCase() || 'other',
            user: req.user._id,
            description: req.body.description || null
        };
        const dish = new Dish(newDish);
        const existingDish = await Dish.findOne({
            name: dish.name,
            servings: dish.servings,
            category: dish.category,
            description: dish.description
        });
        if (existingDish) {
            return res.status(400).send('An identical dish already exists.');
        }
        await dish.save();
        const user = await User.findById(req.user._id);
        user.dishes.push(dish._id);
        await user.save();
        res.redirect('/account');
    } catch (err) {
        console.error('Error creating dish:', err);
        res.status(500).send('Error creating dish. Please try again later.');
    }
};

exports.editDishForm = async (req, res) => {
    const dish = await Dish.findById(req.params.id);
    if (dish.user != req.user.id) {
        return res.status(403).send('Unauthorized. User does not own this dish.');
    } else {
        res.render('layout', {
            dish, 
            categories, 
            diets,
            title: 'Edit Dish',
            cssFile,
            view: 'dishes/edit'
        });
    }
};

exports.updateDish = async (req, res) => {
    try {
        const updatedDish = {
            name: req.body.name,
            servings: req.body.servings,
            diets: req.body.diets,
            description: req.body.description,
            category: req.body.category
        }
        await Dish.findByIdAndUpdate(req.params.id, updatedDish);
        res.redirect('/dishes/' + req.params.id);
    }
    catch (err) {
        res.status(500).send('Error updating dish.');
    }
}

exports.deleteDish = async (req, res) => {
    try {
        await Dish.findByIdAndDelete(req.params.id);
        res.redirect('/account');
    } catch (err) {
        res.status(500).send('Error deleting dish.');
    }
};
