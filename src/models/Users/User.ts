import { model, models, Schema } from "mongoose";

export const userSchema = new Schema({
  mail: { type: String, required: true },
  name: { type: String, required: true }
});

export default models?.User || model("User", userSchema);