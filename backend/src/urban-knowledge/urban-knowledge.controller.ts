import { Controller, Get, Post, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { UrbanKnowledgeService } from './urban-knowledge.service';
import { CreateAlertDto } from 'src/alerts/dto/create-alert.dto'; 
import { CreatePlaceDto } from 'src/places/dto/create-place.dto'; 
import { JwtAuthGuard } from 'src/user/auth/guards/jwt-auth.guard';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: any; 
}  

@Controller('urban-knowledge')
export class UrbanKnowledgeController {
  constructor(private readonly urbanKnowledgeService: UrbanKnowledgeService) {}

  @UseGuards(JwtAuthGuard)
  @Get('alerts')
  async getAlerts(@Req() req: RequestWithUser, @Query('lat') lat?: number, @Query('lng') lng?: number) {
    return this.urbanKnowledgeService.getAlerts(req.user, lat, lng);
  }

  @UseGuards(JwtAuthGuard)
  @Get('places')
  async getPlaces(
    @Req() req: RequestWithUser, 
    @Query('type') type: string, 
    @Query('lat') lat?: number, 
    @Query('lng') lng?: number
  ) {
    return this.urbanKnowledgeService.getPlaces(req.user, type, lat, lng);
  }

  @UseGuards(JwtAuthGuard)
  @Get('routes')
  async getSafeRoutes(
    @Req() req: RequestWithUser,
    @Query('destination') destination: string,
    @Query('origin') origin?: string
  ) {
    return this.urbanKnowledgeService.getSafeRoutes(req.user, destination, origin);
  }
 
  @UseGuards(JwtAuthGuard)
  @Post('alerts')
  async createAlert(@Req() req: RequestWithUser, @Body() createAlertDto: CreateAlertDto) {
    return this.urbanKnowledgeService.createAlert(req.user, createAlertDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('places')
  async createPlace(@Req() req: RequestWithUser, @Body() createPlaceDto: CreatePlaceDto) {
    return this.urbanKnowledgeService.createPlace(req.user, createPlaceDto);
  }
  
  
  @Get('recommended-places')
  async getRecommendedPlaces(
    @Query('ciudad') ciudad: string,
    @Query('pais') pais: string,
    @Query('tipo') tipo?: string
  ) {
    return this.urbanKnowledgeService.getRecommendedPlacesOSM(ciudad, pais, tipo);
  }
}