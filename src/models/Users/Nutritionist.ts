import { userSchema } from "./User"
import { Schema, model, models} from "mongoose";
import mongoose from "mongoose";

export const nutristionistSchema =  new Schema({
    clients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Client' }]
});

nutristionistSchema.add(userSchema);

export default models?.Nutristionist || model("Nutristionist", nutristionistSchema)

