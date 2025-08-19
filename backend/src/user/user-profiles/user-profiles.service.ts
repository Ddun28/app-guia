import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { UserProfile, UserProfileModel } from '../user-profile.schema';
import { UserService } from '../user.service'; // ← Importa UserService

@Injectable()
export class UserProfilesService {
  constructor(
    @InjectModel(UserProfileModel.modelName)
    private readonly userProfileModel: Model<UserProfile>,
    private readonly userService: UserService // ← Inyecta UserService
  ) {}

  async create(createUserProfileDto: CreateUserProfileDto): Promise<UserProfile> {
    try {
      console.log('Creando perfil para usuario:', createUserProfileDto.user_id);
      
      const createdProfile = new this.userProfileModel({
        ...createUserProfileDto,
        user_id: new Types.ObjectId(createUserProfileDto.user_id) 
      });
      
      const savedProfile = await createdProfile.save();
      console.log('Perfil creado ID:', savedProfile._id);

      // ✅ SINCRONIZAR: Actualizar referencia en el usuario
      await this.userService.updateUser(createUserProfileDto.user_id, {
        profile: savedProfile._id
      });
      console.log('Referencia actualizada en usuario');

      return savedProfile;
    } catch (error) {
      console.error('Error al crear perfil:', error);
      throw new Error('No se pudo crear el perfil');
    }
  }

  async findByUserId(userId: string): Promise<UserProfile | null> {
    try {
      if (!Types.ObjectId.isValid(userId)) {
        throw new Error('ID de usuario inválido');
      }
      return await this.userProfileModel
        .findOne({ user_id: new Types.ObjectId(userId) })
        .lean()
        .exec();
    } catch (error) {
      console.error('Error al buscar perfil:', error);
      return null;
    }
  }

  async update(
    userId: string,
    updateData: UpdateUserProfileDto,
  ): Promise<UserProfile> {
    try {
      console.log('Actualizando perfil para usuario:', userId);
      
      const result = await this.userProfileModel.findOneAndUpdate(
        { user_id: new Types.ObjectId(userId) },
        updateData,
        { 
          new: true,
          upsert: true,
          runValidators: true,
          setDefaultsOnInsert: true
        }
      ).exec();

      if (!result) {
        throw new Error('No se pudo actualizar el perfil');
      }

      console.log('Perfil actualizado ID:', result._id);

      // ✅ SINCRONIZAR: Asegurar referencia en el usuario
      await this.userService.updateUser(userId, {
        profile: result._id
      });
      console.log('Referencia actualizada en usuario');

      return result;
    } catch (error) {
      console.error('Error en UserProfilesService.update:', {
        userId,
        error: error.message,
        data: updateData
      });
      throw error;
    }
  }

  async delete(userId: string): Promise<UserProfile> {
    try {
      if (!Types.ObjectId.isValid(userId)) {
        throw new Error('ID de usuario inválido');
      }

      const deletedProfile = await this.userProfileModel
        .findOneAndDelete({ user_id: new Types.ObjectId(userId) })
        .lean()
        .exec();

      if (!deletedProfile) {
        throw new NotFoundException('Perfil no encontrado');
      }

      // ✅ SINCRONIZAR: Remover referencia en el usuario
      await this.userService.updateUser(userId, {
        profile: null
      });
      console.log('Referencia eliminada del usuario');

      return deletedProfile;
    } catch (error) {
      console.error('Error al eliminar perfil:', error);
      throw error;
    }
  }

  // ✅ Método adicional para sincronizar perfiles existentes
  async syncExistingProfiles(): Promise<{ synced: number; failed: number }> {
    try {
      const profiles = await this.userProfileModel.find().exec();
      let synced = 0;
      let failed = 0;

      for (const profile of profiles) {
        try {
          await this.userService.updateUser(profile.user_id.toString(), {
            profile: profile._id
          });
          synced++;
        } catch (error) {
          console.error(`Error sincronizando perfil ${profile._id}:`, error);
          failed++;
        }
      }

      return { synced, failed };
    } catch (error) {
      console.error('Error en syncExistingProfiles:', error);
      throw error;
    }
  }
}