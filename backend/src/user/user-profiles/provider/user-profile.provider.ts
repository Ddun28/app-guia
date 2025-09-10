import { Connection } from 'mongoose';
import { UserProfileSchema, USER_PROFILE_MODEL } from '../schemas/user-profile.schema';

export const userProfileProviders = [
  {
    provide: USER_PROFILE_MODEL,
    useFactory: (connection: Connection) =>
      connection.model(USER_PROFILE_MODEL, UserProfileSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];