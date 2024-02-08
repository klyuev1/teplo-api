import mongoose, { Model, Schema } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

import {IUser} from '../interfaces/IUser'
import AuthorizationError from '../errors/AuthorizationError';


interface IUserModel extends Model<IUser> {
  findUserByCredentials(email: string, password: string): Promise<IUser | null>;
}

const userSchema: Schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: 'Некорректный адрес электронной почты',
    },
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

const UserModel: IUserModel = mongoose.model<IUser>('User', userSchema) as IUserModel;

UserModel.findUserByCredentials = function (
  this: IUserModel,
  email: string,
  password: string
): Promise<IUser | null> {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthorizationError('Неправильные почта или пароль');
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new AuthorizationError('Неправильные почта или пароль');
        }

        return user;
      });
    });
};

export default UserModel;
