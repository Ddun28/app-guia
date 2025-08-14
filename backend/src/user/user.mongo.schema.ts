import { Schema, Document, Types } from 'mongoose';

export const UserSchema = new Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email_verified_at: { type: Date, default: null },
}, { timestamps: true });

export interface User extends Document {
_id: Types.ObjectId;
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  email_verified_at?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export const UserVerificationSchema = new Schema({
  user_id: { type: Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true },
}, { timestamps: true });

export interface UserVerification extends Document {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  token: string;
  createdAt: Date;
  updatedAt: Date;
}
