import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  IsNumber,
  IsDateString,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

class LocationDto {
  @IsEnum(['Point'], { message: 'Location type must be "Point"' })
  @IsNotEmpty({ message: 'Location type is required' })
  type!: 'Point';

  @IsArray({ message: 'Coordinates must be an array' })
  @ArrayMinSize(2, { message: 'Coordinates must have exactly 2 elements [longitude, latitude]' })
  @ArrayMaxSize(2, { message: 'Coordinates must have exactly 2 elements [longitude, latitude]' })
  @IsNumber({}, { each: true, message: 'Each coordinate must be a number' })
  coordinates!: [number, number];
}

export class CreateBicycleDto {
    @IsString({ message: 'Code must be a string' })
    @IsNotEmpty({ message: 'Code is required' })
    @MaxLength(50, { message: 'Code must not exceed 50 characters' })
    code!: string;

    @IsString({ message: 'Brand must be a string' })
    @IsNotEmpty({ message: 'Brand is required' })
    @MaxLength(100, { message: 'Brand must not exceed 100 characters' })
    brand!: string;

    @IsString({ message: 'Model must be a string' })
    @IsOptional()
    @MaxLength(100, { message: 'Model must not exceed 100 characters' })
    model?: string;

    @IsString({ message: 'Color must be a string' })
    @IsNotEmpty({ message: 'Color is required' })
    @MaxLength(50, { message: 'Color must not exceed 50 characters' })
    color!: string;

    @IsEnum(['available', 'rented', 'maintenance', 'retired'], {
        message: 'Status must be one of: available, rented, maintenance, retired',
    })
    @IsOptional()
    status?: 'available' | 'rented' | 'maintenance' | 'retired';

    @Transform(({ value }) => {
        // Convertir number a string si es necesario
        if (typeof value === 'number') return value.toString();
        return value;
    })
    @IsString({ message: 'Rental price per hour must be a string or number' })
    @IsNotEmpty({ message: 'Rental price per hour is required' })
    rentalPricePerHour!: string;

    @IsMongoId({ message: 'Regional ID must be a valid MongoDB ObjectId' })
    @IsNotEmpty({ message: 'Regional ID is required' })
    regionalId!: string;

    @ValidateNested()
    @Type(() => LocationDto)
    @IsOptional()
    currentLocation?: LocationDto;

    @IsOptional()
    @IsDateString()
    purchaseDate?: string;

    @IsOptional()
    @IsDateString()
    lastMaintenanceDate?: string;
}
