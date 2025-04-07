/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           description: User ID
 *         username:
 *           type: string
 *           description: User's username
 *         email:
 *           type: string
 *           description: User's email
 *         password:
 *           type: string
 *           description: User's password (hashed)
 *         googleId:
 *           type: string
 *           description: Google ID for OAuth users
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *
 *     Recipe:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - ingredients
 *         - instructions
 *         - cookingTime
 *         - userId
 *       properties:
 *         _id:
 *           type: string
 *           description: Recipe ID
 *         title:
 *           type: string
 *           description: Recipe title
 *         description:
 *           type: string
 *           description: Recipe description
 *         ingredients:
 *           type: array
 *           items:
 *             type: string
 *           description: List of ingredients
 *         instructions:
 *           type: array
 *           items:
 *             type: string
 *           description: Step-by-step instructions
 *         cookingTime:
 *           type: integer
 *           description: Cooking time in minutes
 *         difficulty:
 *           type: string
 *           enum: [Easy, Medium, Hard]
 *           description: Recipe difficulty level
 *         servings:
 *           type: integer
 *           description: Number of servings
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Recipe tags
 *         image:
 *           type: string
 *           description: URL to recipe image
 *         userId:
 *           type: string
 *           description: ID of user who created the recipe
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *
 *     Ingredient:
 *       type: object
 *       required:
 *         - name
 *         - category
 *       properties:
 *         _id:
 *           type: string
 *           description: Ingredient ID
 *         name:
 *           type: string
 *           description: Ingredient name
 *         category:
 *           type: string
 *           enum: [Protein, Vegetable, Fruit, Grain, Dairy, Spice, Other]
 *           description: Ingredient category
 *         nutritionalInfo:
 *           type: object
 *           properties:
 *             calories:
 *               type: number
 *               description: Calories per serving
 *             protein:
 *               type: number
 *               description: Protein content in grams
 *             carbs:
 *               type: number
 *               description: Carbohydrate content in grams
 *             fat:
 *               type: number
 *               description: Fat content in grams
 *           description: Nutritional information
 *         commonUses:
 *           type: array
 *           items:
 *             type: string
 *           description: Common uses for this ingredient
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *
 *     Favorite:
 *       type: object
 *       required:
 *         - userId
 *         - recipeId
 *       properties:
 *         _id:
 *           type: string
 *           description: Favorite ID
 *         userId:
 *           type: string
 *           description: ID of user who favorited the recipe
 *         recipeId:
 *           type: string
 *           description: ID of favorited recipe
 *         notes:
 *           type: string
 *           description: User notes about the recipe
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 */

