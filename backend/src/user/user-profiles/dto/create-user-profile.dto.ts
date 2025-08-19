import { IsOptional, IsNumber, IsString, IsIn, IsDateString, Min, Max } from 'class-validator';

export class CreateUserProfileDto {
  user_id: string;

  @IsOptional()
  @IsNumber()
  @Min(13)
  @Max(120)
  edad?: number;

  @IsOptional()
  ubicacion?: {
    ciudad?: string;
    pais?: string;
  };

  @IsOptional()
  @IsIn(['soltero', 'soltera', 'casado', 'casada', 'divorciado', 'divorciada', 'viudo', 'viuda'])
  estado_civil?: string;

  @IsOptional()
  @IsIn(['masculino', 'femenino', 'otro'])
  sexo?: string;

  @IsOptional()
  @IsDateString()
  fecha_nacimiento?: Date;

  @IsOptional()
  @IsString()
  telefono?: string;
}