import { Schema, Document, Types } from 'mongoose';
import { UserProfile, UserProfileModel } from './user-profile.schema';

export const UserSchema = new Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email_verified_at: { type: Date, default: null },
  reset_password_token: { type: String, default: null },
  reset_password_expires: { type: Date, default: null },
  profile: { 
    type: Types.ObjectId, 
    ref: 'UserProfile',
    default: null
  }
}, { 
  timestamps: true,
  collection: 'users' 
});

export interface User extends Document {
  _id: Types.ObjectId;
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  email_verified_at?: Date | null;
  reset_password_token?: string | null;
  reset_password_expires?: Date | null;
  profile?: Types.ObjectId | UserProfile | null;
  createdAt: Date;
  updatedAt: Date;
}

export const UserVerificationSchema = new Schema({
  user_id: { type: Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true },
}, { timestamps: true });

export interface UserVerification extends Document {
  _id: Types.ObjectId;
  user_id: Types.ObjectId | User;
  token: string;
  createdAt: Date;
  updatedAt: Date;
}