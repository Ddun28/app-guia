import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserProfilesController } from './user-profiles.controller';
import { UserProfilesService } from './user-profiles.service';
import { UserModule } from '../user.module';
import { UserProfileModel, UserProfileSchema } from '../user-profile.schema';
import { UserSchema } from '../user.mongo.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ 
      name: UserProfileModel.modelName, 
      schema: UserProfileSchema 
    },{ name: 'User', schema: UserSchema }]),
    forwardRef(() => UserModule), 
  ],
  controllers: [UserProfilesController],
  providers: [UserProfilesService],
  exports: [UserProfilesService],
})
export class UserProfilesModule {}