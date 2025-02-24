import { userSchema} from './User';
import { Schema, model, models } from 'mongoose';
import mongoose from 'mongoose';

export const clientSchema = new Schema({
    diet: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Diet' }]
});

clientSchema.add(userSchema);

export default models?.Client || model('Client', clientSchema);

