import { Schema, model, models } from "mongoose";
import mongoose from "mongoose";

export const dietSchema = new Schema({
    name: { type: String, required: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    meals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Meal' }]
});

export default models?.Diet || model("Diet", dietSchema);




