import { Schema, Document, Types, Model } from 'mongoose';
import { User } from './user.mongo.schema';

// Definición de la clase del modelo
export class UserProfileModel {
  static modelName = 'UserProfile'; // Nombre que usaremos en todas las referencias
}

// Esquema
export const UserProfileSchema = new Schema({
  user_id: { 
    type: Types.ObjectId, 
    ref: 'User',  // Referencia al modelo User
    required: true, 
    unique: true 
  },
  edad: { 
    type: Number, 
    min: 13, 
    max: 120 
  },
  ubicacion: {
    ciudad: { type: String },
    pais: { type: String }
  },
  estado_civil: { 
    type: String, 
    enum: ['soltero', 'soltera', 'casado', 'casada', 'divorciado', 'divorciada', 'viudo', 'viuda'] 
  },
  sexo: { 
    type: String, 
    enum: ['masculino', 'femenino', 'otro'] 
  },
  fecha_nacimiento: { type: Date },
  telefono: { type: String }
}, { 
  timestamps: true,
  collection: 'user_profiles' // Nombre físico de la colección en MongoDB
});

// Interface TypeScript
export interface UserProfile extends Document {
  _id: Types.ObjectId;
  user_id: Types.ObjectId | User;
  edad?: number;
  ubicacion?: {
    ciudad?: string;
    pais?: string;
  };
  estado_civil?: 'soltero' | 'soltera' | 'casado' | 'casada' | 'divorciado' | 'divorciada' | 'viudo' | 'viuda';
  sexo?: 'masculino' | 'femenino' | 'otro';
  fecha_nacimiento?: Date;
  telefono?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Tipo para el modelo
export type UserProfileModelType = Model<UserProfile>;