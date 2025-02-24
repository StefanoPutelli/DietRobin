import { Schema, model, models } from "mongoose";

export const mealSchema = new Schema({
    day: { type: Number, required: true },
    name: { type: String, required: true },
    foods: [{
        foodID: String,
        name: String,
        quantity: Number
    }]
});

export default models?.Meal || model("Meal", mealSchema);




