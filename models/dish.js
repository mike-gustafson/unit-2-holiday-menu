const mongoose = require('mongoose');
const User = require('./user');

const dishSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        trim: true 
    },
    category: { 
        type: String, 
        required: true, 
        trim: true, 
        lowercase: true,
        enum: ['appetizer', 'entree', 'dessert', 'beverage', 'other'],
        default: 'other',
        index: true
    },
    servings: {
        type: Number,
        required: true,
        validate: {
            validator: Number.isInteger,
            message: 'Servings must be an integer.'
        },
        min: [1, 'Servings must be at least 1.']
    },    
    description: { 
        type: String, 
        default: '' 
    },
    diets: { 
        type: [String], 
        default: [] 
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        index: true,
        required: true
    }
}, { timestamps: true });

dishSchema.methods.getCreator = async function () {
    const user = await User.findById(this.user);
    return user ? user.fullName : 'Unknown User';
};

dishSchema.index({ name: 1, servings: 1, category: 1, description: 1 }, { unique: true });

module.exports = mongoose.model('Dish', dishSchema);