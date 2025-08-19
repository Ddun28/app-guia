import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, UserVerificationSchema } from './user.mongo.schema';
import { UserProfileSchema } from './user-profile.schema'; 
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { EmailModule } from '../email/email.module';
import { UserProfilesModule } from './user-profiles/user-profiles.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'UserVerification', schema: UserVerificationSchema },
      { name: 'UserProfile', schema: UserProfileSchema }
    ]),
    EmailModule,
    forwardRef(() => UserProfilesModule)
  ],
  controllers: [UserController],
  providers: [UserService], 
  exports: [UserService, MongooseModule], 
})
export class UserModule {}