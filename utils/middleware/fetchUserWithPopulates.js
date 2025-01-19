const User = require('../../models/user');

const fetchUserWithPopulates = async (id, array) => {
    const user = await User.findById(id);
    return await User.populate(user, array);
}

module.exports = fetchUserWithPopulates;