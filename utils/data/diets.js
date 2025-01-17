const diets = [
    {
        "name": "Vegetarian",
        "description": "No meat, poultry, or seafood.",
        "icon": "🌱",
        "covers": [
            { "name": "Vegan", "isCovered": false },
            { "name": "Gluten-Free", "isCovered": false },
            { "name": "Dairy-Free", "isCovered": false },
            { "name": "Nut-Free", "isCovered": false },
            { "name": "Soy-Free", "isCovered": false },
            { "name": "Kosher", "isCovered": false },
            { "name": "Halal", "isCovered": false },
            { "name": "Low-Carb", "isCovered": false },
            { "name": "Keto", "isCovered": false }
        ]
    },
    {
        "name": "Vegan",
        "description": "No animal products, including meat, dairy, eggs, and honey.",
        "icon": "🥦",
        "covers": [
            { "name": "Vegetarian", "isCovered": true },
            { "name": "Gluten-Free", "isCovered": false },
            { "name": "Dairy-Free", "isCovered": true },
            { "name": "Nut-Free", "isCovered": false },
            { "name": "Soy-Free", "isCovered": false },
            { "name": "Kosher", "isCovered": false },
            { "name": "Halal", "isCovered": false },
            { "name": "Low-Carb", "isCovered": false },
            { "name": "Keto", "isCovered": false }
        ]
    },
    {
        "name": "Gluten-Free",
        "description": "No gluten, which is found in wheat, barley, and rye.",
        "icon": "🚫🌾",
        "covers": [
            { "name": "Vegetarian", "isCovered": false },
            { "name": "Vegan", "isCovered": false },
            { "name": "Dairy-Free", "isCovered": false },
            { "name": "Nut-Free", "isCovered": false },
            { "name": "Soy-Free", "isCovered": false },
            { "name": "Kosher", "isCovered": false },
            { "name": "Halal", "isCovered": false },
            { "name": "Low-Carb", "isCovered": false },
            { "name": "Keto", "isCovered": false }
        ]
    },
    {
        "name": "Dairy-Free",
        "description": "No dairy products, including milk, cheese, butter, or cream.",
        "icon": "🚫🥛",
        "covers": [
            { "name": "Vegetarian", "isCovered": false },
            { "name": "Vegan", "isCovered": false },
            { "name": "Gluten-Free", "isCovered": false },
            { "name": "Nut-Free", "isCovered": false },
            { "name": "Soy-Free", "isCovered": false },
            { "name": "Kosher", "isCovered": false },
            { "name": "Halal", "isCovered": false },
            { "name": "Low-Carb", "isCovered": false },
            { "name": "Keto", "isCovered": false }
        ]
    },
    {
        "name": "Nut-Free",
        "description": "No peanuts or tree nuts.",
        "icon": "🚫🥜",
        "covers": [
            { "name": "Vegetarian", "isCovered": false },
            { "name": "Vegan", "isCovered": false },
            { "name": "Gluten-Free", "isCovered": false },
            { "name": "Dairy-Free", "isCovered": false },
            { "name": "Soy-Free", "isCovered": false },
            { "name": "Kosher", "isCovered": false },
            { "name": "Halal", "isCovered": false },
            { "name": "Low-Carb", "isCovered": false },
            { "name": "Keto", "isCovered": false }
        ]
    },
    {
        "name": "Soy-Free",
        "description": "No soy products, including soy sauce and tofu.",
        "icon": "🚫🌱",
        "covers": [
            { "name": "Vegetarian", "isCovered": false },
            { "name": "Vegan", "isCovered": false },
            { "name": "Gluten-Free", "isCovered": false },
            { "name": "Dairy-Free", "isCovered": false },
            { "name": "Nut-Free", "isCovered": false },
            { "name": "Kosher", "isCovered": false },
            { "name": "Halal", "isCovered": false },
            { "name": "Low-Carb", "isCovered": false },
            { "name": "Keto", "isCovered": false }
        ]
    },
    {
        "name": "Kosher",
        "description": "Prepared in accordance with Jewish dietary laws.",
        "icon": "✡️",
        "covers": [
            { "name": "Vegetarian", "isCovered": false },
            { "name": "Vegan", "isCovered": false },
            { "name": "Gluten-Free", "isCovered": false },
            { "name": "Dairy-Free", "isCovered": false },
            { "name": "Nut-Free", "isCovered": false },
            { "name": "Soy-Free", "isCovered": false },
            { "name": "Halal", "isCovered": false },
            { "name": "Low-Carb", "isCovered": false },
            { "name": "Keto", "isCovered": false }
        ]
    },
    {
        "name": "Halal",
        "description": "Permissible under Islamic dietary laws.",
        "icon": "☪️",
        "covers": [
            { "name": "Vegetarian", "isCovered": false },
            { "name": "Vegan", "isCovered": false },
            { "name": "Gluten-Free", "isCovered": false },
            { "name": "Dairy-Free", "isCovered": false },
            { "name": "Nut-Free", "isCovered": false },
            { "name": "Soy-Free", "isCovered": false },
            { "name": "Kosher", "isCovered": false },
            { "name": "Low-Carb", "isCovered": false },
            { "name": "Keto", "isCovered": false }
        ]
    },
    {
        "name": "Low-Carb",
        "description": "Reduced carbohydrate content.",
        "icon": "🥩",
        "covers": [
            { "name": "Vegetarian", "isCovered": false },
            { "name": "Vegan", "isCovered": false },
            { "name": "Gluten-Free", "isCovered": false },
            { "name": "Dairy-Free", "isCovered": false },
            { "name": "Nut-Free", "isCovered": false },
            { "name": "Soy-Free", "isCovered": false },
            { "name": "Kosher", "isCovered": false },
            { "name": "Halal", "isCovered": false },
            { "name": "Keto", "isCovered": false }
        ]
    },
    {
        "name": "Keto",
        "description": "High fat, moderate protein, and very low carbohydrate diet.",
        "icon": "🥓",
        "covers": [
            { "name": "Vegetarian", "isCovered": false },
            { "name": "Vegan", "isCovered": false },
            { "name": "Gluten-Free", "isCovered": false },
            { "name": "Dairy-Free", "isCovered": false },
            { "name": "Nut-Free", "isCovered": false },
            { "name": "Soy-Free", "isCovered": false },
            { "name": "Kosher", "isCovered": false },
            { "name": "Halal", "isCovered": false },
            { "name": "Low-Carb", "isCovered": false },
        ]
    }
    
];

module.exports = diets;