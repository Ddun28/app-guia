import { IsEnum, IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';
import { PlaceType } from '../schemas/place.schema';

export class CreatePlaceDto {
  @IsString()
  name: string;

  @IsEnum(PlaceType)
  type: PlaceType;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsNumber()
  @Min(0)
  @Max(5)
  @IsOptional()
  rating?: number;
}