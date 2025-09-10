import { IsEnum, IsString, IsNumber, IsOptional } from 'class-validator';
import { AlertType } from '../schemas/alert.schema';

export class CreateAlertDto {
  @IsEnum(AlertType)
  type: AlertType;

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;
}