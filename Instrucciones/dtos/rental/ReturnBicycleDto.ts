import {
  IsNotEmpty,
  IsOptional,
  ValidateNested,
  IsEnum,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

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

export class ReturnBicycleDto {
  @ValidateNested()
  @Type(() => LocationDto)
  @IsOptional()
  endLocation?: LocationDto;
}
