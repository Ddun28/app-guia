import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UrbanKnowledgeController } from './urban-knowledge.controller';
import { UrbanKnowledgeService } from './urban-knowledge.service';
import { Alert, AlertSchema } from '../alerts/schemas/alert.schema';
import { Place, PlaceSchema } from '../places/schemas/place.schema';
import { Route, RouteSchema } from '../routes/schemas/route.schema';
import { UserProfileSchema, USER_PROFILE_MODEL } from 'src/user/user-profiles/schemas/user-profile.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Alert.name, schema: AlertSchema },
      { name: Place.name, schema: PlaceSchema },
      { name: Route.name, schema: RouteSchema },
      { name: USER_PROFILE_MODEL, schema: UserProfileSchema },
    ]),
  ],
  controllers: [UrbanKnowledgeController],
  providers: [
    UrbanKnowledgeService,
  ],
  exports: [UrbanKnowledgeService], 
})
export class UrbanKnowledgeModule {}