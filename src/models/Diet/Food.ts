import { Schema, model, models } from "mongoose";

export const foodSchema = new Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
});

export default models?.Food || model("Food", foodSchema);




