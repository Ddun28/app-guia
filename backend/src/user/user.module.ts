import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, UserVerificationSchema } from './user.mongo.schema';
import { UserService } from './user.service'; 
import { UserController } from './user.controller'; 
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'UserVerification', schema: UserVerificationSchema },
    ]),
    EmailModule
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
