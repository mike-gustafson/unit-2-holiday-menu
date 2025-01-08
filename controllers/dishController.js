const Dish = require('../models/dish');
const User = require('../models/user');

const categories = require('../config/dishCategoryOptions');
const dietaryAccommodations = require('../config/dishDietaryOptions');

const parseDietaryAccommodations = (list) => {
    if (!list) return [];
    return list.split(',');
};

const parseUserName = async (dish) => {
    const dishCreator = await User.findById(dish.user);
    const firstName = dishCreator.firstName.slice(0, 1).toUpperCase();
    const lastName = dishCreator.lastName;
    const creatorName = firstName + '. ' + lastName;
    return creatorName;
};

exports.getDishes = async (req, res) => {
    try {
        const dishes = await Dish.find();

        if (req.user) {
            const user = await User.findById(req.user.id);
            const userDishes = dishes.filter(dish => dish.user.equals(user._id));
            const otherDishes = dishes.filter(dish => !dish.user.equals(user._id));
            res.render('dishes/index', { dishes: [], userDishes, otherDishes });
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
        const dishCreatorName = await parseUserName(dish);
        const isFavorite = user.favoriteDishes.includes(dish._id);
        res.render('dishes/show', { dish, isFavorite, dishCreatorName });
    } catch (err) {
        res.status(500).send('Error getting dish.');
    }
}

exports.newDishForm = (req, res) => {
    res.render('dishes/new', { categories, dietaryAccommodations });
};

exports.createDish = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).send('Unauthorized. User not logged in.');
        }

        let dietaryAccommodations = parseDietaryAccommodations(req.body.dietaryAccommodations);

        const newDish = {
            name: req.body.name.trim(),
            servings: parseInt(req.body.servings),
            dietaryAccommodations: dietaryAccommodations || [],
            category: req.body.category.trim().toLowerCase() || 'other',
            user: req.user._id,
            description: req.body.description || null,
            recipe: req.body.recipe || null
        };
        const dish = new Dish(newDish);
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
        res.render('dishes/edit', { dish, categories, dietaryAccommodations });
    }
};

exports.updateDish = async (req, res) => {
    try {
        const updatedDish = {
            name: req.body.name,
            servings: req.body.servings,
            dietaryAccommodations: req.body.dietaryAccommodations,
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
