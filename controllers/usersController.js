const User = require('../models/user');

exports.main = async (req, res) => {
    try {
        const users = await User.find( {} , { firstName: 1, lastName:1 } );
        res.render('layout', { 
            title: 'Users',
            users,
            cssFile: 'users.css',
            view: 'users/index'
        });
    }
    catch (err) {
        console.error('Error showing users:', err);
        res.status(500).send('Error showing users.');
    }
};

exports.showUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .populate('connections')
            .populate('dishes')
            .populate('favoriteDishes');
        const userDishes = user.dishes;
        const favoriteDishes = user.favoriteDishes;
        console.log(user);
        if (!user) {
            res.status(404).send('User not found.');
            return;
        }
        res.render('layout', { 
            user,
            userDishes,
            favoriteDishes,
            title: 'User',
            cssFile: 'users.css',
            view: 'users/show'
        });
    }
    catch (err) {
        console.error('Error showing user:', err);
        res.status(500).send('Error showing user.');
    }
};
