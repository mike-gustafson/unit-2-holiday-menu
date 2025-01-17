const Dish = require('../models/dish');
const User = require('../models/user');

const categories = require('../utils/data/dishCategoryOptions');
const diets = require('../utils/data/diets');



exports.getDishes = async (req, res) => {
    try {
        if (req.user) {
            const user = await User.findById(req.user.id);
            const userDishes = await Dish.find({ user: user._id });
            const favoriteDishes = await Dish.find({ _id: { $in: user.favoriteDishes } });
            const otherDishes = await Dish.find({ _id: { $nin: user.favoriteDishes.concat(user.dishes) } });
            res.render('layout', { 
                dishes: [], 
                userDishes, 
                favoriteDishes,
                otherDishes,
                title: 'Dishes',
                cssFile: 'dishes.css',
                view: 'dishes/index'});
        } else {
            return res.render('dishes/index', { dishes, userDishes: [], otherDishes: [] });
        }
    } catch (err) {
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
            cssFile: 'dishes.css',
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
        cssFile: 'dishes.css',
        view: 'dishes/new' 
    });
};

exports.createDish = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).send('Unauthorized. User not logged in.');
        }
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
        if (err.name === 'ValidationError') {
            return res.status(400).send('Validation Error: ' + err.message);
        }
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
            cssFile: 'dishes.css',
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
