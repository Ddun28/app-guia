import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Delete, 
  UseGuards,
  Request,
  Res,
  Param
} from '@nestjs/common';
import { UserProfilesService } from './user-profiles.service';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { Response } from 'express';

@Controller('user-profiles')
@UseGuards(JwtAuthGuard)
export class UserProfilesController {
  constructor(private readonly userProfilesService: UserProfilesService) {}

  @Post()
  async createProfile(
    @Request() req,
    @Body() createUserProfileDto: CreateUserProfileDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const { user_id: _, ...profileData } = createUserProfileDto;
    
    const profile = await this.userProfilesService.create({
      user_id: req.user._id,
      ...profileData
    });
    return profile;
  }

  @Get('me')
  async getMyProfile(@Request() req) {
    return this.userProfilesService.findByUserId(req.user._id);
  }

  @Patch('me')
  async updateMyProfile(
    @Request() req,
    @Body() updateUserProfileDto: UpdateUserProfileDto,
  ) {
    return this.userProfilesService.update(
      req.user._id,
      updateUserProfileDto,
    );
  }

  @Delete('me')
  async deleteMyProfile(@Request() req) {
    return this.userProfilesService.delete(req.user._id);
  }

  @Get(':id')
  @UseGuards()
  async getProfile(@Param('id') id: string) {
    return this.userProfilesService.findByUserId(id);
  }
}