import mongoose, { Document, Schema } from 'mongoose';

interface User {
  Name: string;
  Login: string;
  Password: string;
}

interface UserDocument extends User, Document {}

const userSchema = new Schema<UserDocument>({
  Name: String,
  Login: String,
  Password: String,
}, {collection : 'User', versionKey: false});

const UserModel = mongoose.model('User', userSchema);

export default UserModel;