const User = require('../models/user');
const Dish = require('../models/dish');

exports.main = async (req, res) => {
    try {
        const users = await User.find( {} , { firstName: 1, lastName:1, connections:1 } );
        const currentUser = await User.findById(req.user.id, { connections: 1 });
        const usersWithMutuals = users.map(person => {
            const mutualFriends = currentUser.connections.filter(friendId =>
              person.connections.includes(friendId)
            );
            return {
            ...person.toObject(),
            mutualFriendsCount: mutualFriends.length,
          };
        });
        res.render('layout', { 
            title: 'Users',
            users: usersWithMutuals,
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
            .populate('favoriteDishes')
            .populate('connections');
        const userDishes = user.dishes;
        const favoriteDishes = user.favoriteDishes;
        const friendsDishes = [];
        for (const friend of user.connections) {
          const friendDishes = await Dish.find({ _id: { $in: friend.dishes } }).populate('user');
          friendsDishes.push(...friendDishes);
        }
        console.log(user);
        if (!user) {
            res.status(404).send('User not found.');
            return;
        }
        res.render('layout', { 
            user,
            userDishes,
            favoriteDishes,
            friendsDishes,
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

exports.addConnection = async (req, res) => {
    try {
        const user = await User.findById(req.user.id, { connections: 1 });
        if (user.connections.includes(req.params.id)) {
            res.status(400).send('Connection already exists.');
            return;
        }
        user.connections.push(req.params.id);
        await user.save();
        res.redirect(`/users/`);
    }
    catch (err) {
        console.error('Error adding connection:', err);
        res.status(500).send('Error adding connection.');
    }
}

exports.removeConnection = async (req, res) => {
    try {
        const user = await User.findById(req.user.id, { connections: 1 });
        if (!user.connections.includes(req.params.id)) {
            res.status(400).send('Connection does not exist.');
            return;
        }
        user.connections = user.connections.filter(id => id != req.params.id);
        await user.save();
        res.redirect(`/users/`);
    }
    catch (err) {
        console.error('Error removing connection:', err);
        res.status(500).send('Error removing connection.');
    }
}