import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserVerification } from './user.mongo.schema';

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

  async updateUser(id: string, data: Partial<User>): Promise<User | null> {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, this.SALT_ROUNDS);
    }
    return this.userModel
      .findByIdAndUpdate(id, data, { new: true })
      .select('-password')
      .exec();
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