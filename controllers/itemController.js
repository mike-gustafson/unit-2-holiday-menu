const Item = require('../models/item');

exports.getItems = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  const items = await Item.find({ user: req.user._id });
  res.render('items/index', { items, user: req.user });
};

exports.newItemForm = (req, res) => {
  res.render('items/new');
};

exports.createItem = async (req, res) => {
  try {
    const { name, quantity } = req.body;
    const item = new Item({ name, quantity, user: req.user._id });
    await item.save();
    res.redirect('/items');
  } catch (err) {
    res.status(500).send('Error creating item.');
  }
};

exports.editItemForm = async (req, res) => {
  const item = await Item.findById(req.params.id);
  res.render('items/edit', { item });
};

exports.updateItem = async (req, res) => {
  try {
    const { name, quantity } = req.body;
    await Item.findByIdAndUpdate(req.params.id, { name, quantity });
    res.redirect('/items');
  } catch (err) {
    res.status(500).send('Error updating item.');
  }
};

exports.deleteItem = async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.redirect('/items');
};
