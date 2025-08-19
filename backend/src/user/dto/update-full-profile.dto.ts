import { IsOptional, IsNumber, Min, Max, IsString, IsIn, IsEmail, IsNotEmpty } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class UpdateFullProfileDto {
  // User fields
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  apellido?: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  // Profile fields
  @IsOptional()
  @IsNumber()
  @Min(13)
  @Max(120)
  @Type(() => Number)
  edad?: number;

  @IsOptional()
  @IsString()
  @IsIn(['soltero', 'soltera', 'casado', 'casada', 'divorciado', 'divorciada', 'viudo', 'viuda'])
  estado_civil?: string;

  @IsOptional()
  @IsString()
  @IsIn(['masculino', 'femenino', 'otro'])
  sexo?: string;

  @IsOptional()
  @Transform(({ value }) => value ? new Date(value) : null) // Transforma string a Date
  fecha_nacimiento?: Date; // Tipo Date pero acepta string

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  ubicacion?: {
    ciudad?: string;
    pais?: string;
  };
}