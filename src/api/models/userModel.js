import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import jwt from 'jsonwebtoken';
import 'mongoose-type-email';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  password: { type: String, required: [true, 'Password is required'] },
  email: { type: mongoose.SchemaTypes.Email, required: [true, 'Email is required'] },
  activated: Boolean,
  admin: Boolean,
  birthday: Date,
  created_at: Date,
  updated_at: Date,
  network: String,
  avatar: String,
});

// on every save, add the date
userSchema.pre('save', function (next) {
  // get the current date
  const currentDate = new Date();

  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at) {
    this.created_at = currentDate;
  }

  next();
});

userSchema.index({ email: 1, network: 1}, { unique: true });
userSchema.plugin(uniqueValidator, { message: 'This {PATH} exists already.' });

userSchema.methods.toJSON = function toJSON() {
  const user = this.toObject();
  delete user.password;
  user.token = user.email && jwt.sign(user.email, process.env.SUPER_SECRET);
  return user;
};

const userModel = mongoose.model('Users', userSchema);

export default userModel;
