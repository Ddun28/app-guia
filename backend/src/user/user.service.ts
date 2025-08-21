import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserVerification } from './user.mongo.schema';
import { UserProfileModel } from './user-profile.schema';

@Injectable()
export class UserService {
  private readonly SALT_ROUNDS = 10;
  
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('UserVerification') private verificationModel: Model<UserVerification>,
  ) {}

  async createUser(data: Partial<User>): Promise<User> {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, this.SALT_ROUNDS);
    }
    const user = new this.userModel(data); 
    return user.save();
  }

  async findAllUsers(): Promise<User[]> {
    return this.userModel.find().select('-password').exec();
  }
 
  async findUserByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findUserByEmailForAuth(email: string): Promise<User | null> {
    return this.userModel
      .findOne({ email })
      .select('+password') 
      .exec();
  }

  async findUserByEmailWithProfile(email: string): Promise<User | null> {
    return this.userModel
      .findOne({ email })
      .select('-password') 
      .populate({
        path: 'profile',
        model: 'UserProfile',
        select: 'edad estado_civil sexo fecha_nacimiento telefono ubicacion',
        options: { strictPopulate: false } 
      })
      .exec();
  }

  async findUserByResetToken(token: string): Promise<User | null> {
    return this.userModel
      .findOne({ 
        reset_password_token: token,
        reset_password_expires: { $gt: new Date() }
      })
      .exec();
  }

  async updateUser(id: string, data: Partial<User & { password?: string }>): Promise<User | null> {
    try {
      // Validación de ID
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('ID de usuario inválido');
      }

      // Preparar datos de actualización
      const updateData = { ...data };

      // Hashear contraseña si se proporciona
      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, this.SALT_ROUNDS);
      }

      // Ejecutar actualización
      const updatedUser = await this.userModel.findByIdAndUpdate(
        { _id: new Types.ObjectId(id) },
        updateData,
        { 
          new: true,
          runValidators: true
        }
      ).select('-password').exec();

      if (!updatedUser) {
        throw new NotFoundException('Usuario no encontrado');
      }

      return updatedUser;
    } catch (error) {
      console.error('Error en UserService.updateUser:', {
        id,
        error: error.message
      });
      throw error;
    }
  }

  async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async createVerification(userId: string, token: string): Promise<UserVerification> {
    const verification = new this.verificationModel({ 
      user_id: new Types.ObjectId(userId),
      token 
    });
    return verification.save();
  }

  async deleteVerificationsForUser(userId: string): Promise<void> {
    await this.verificationModel.deleteMany({ 
      user_id: new Types.ObjectId(userId) 
    }).exec();
  }

  async deleteVerification(id: string): Promise<void> {
    await this.verificationModel.findByIdAndDelete(id).exec();
  }

  async findVerificationByToken(token: string): Promise<UserVerification | null> {
    return this.verificationModel.findOne({ token }).exec();
  }

  async findUserById(id: string): Promise<User | null> {
    return this.userModel.findById(id).select('-password').exec();
  }
}