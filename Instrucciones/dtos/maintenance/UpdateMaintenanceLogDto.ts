import {
  IsMongoId,
  IsString,
  MaxLength,
  IsNumber,
  Min,
  IsOptional,
  IsEnum,
  IsDateString,
} from 'class-validator';

export class UpdateMaintenanceLogDto {
  @IsMongoId({ message: 'Bicycle ID must be a valid MongoDB ObjectId' })
  @IsOptional()
  bicycleId?: string;

  @IsEnum(['preventive', 'corrective', 'inspection', 'repair', 'other'], {
    message: 'Maintenance type must be preventive, corrective, inspection, repair, or other',
  })
  @IsOptional()
  maintenanceType?: 'preventive' | 'corrective' | 'inspection' | 'repair' | 'other';

  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  description?: string;

  @IsNumber({}, { message: 'Cost must be a number' })
  @IsOptional()
  @Min(0, { message: 'Cost must be a positive number' })
  cost?: number;

  @IsString({ message: 'Performed by must be a string' })
  @IsOptional()
  @MaxLength(150, { message: 'Performed by must not exceed 150 characters' })
  performedBy?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Maintenance date must be a valid date string' })
  maintenanceDate?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Next maintenance date must be a valid date string' })
  nextMaintenanceDate?: string;
}