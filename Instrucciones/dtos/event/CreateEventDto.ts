import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
  IsEnum,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  Matches,
  IsDateString,
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

export class CreateEventDto {
  @IsString({ message: 'Event name must be a string' })
  @IsNotEmpty({ message: 'Event name is required' })
  @MaxLength(200, { message: 'Event name must not exceed 200 characters' })
  name!: string;

  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  @MaxLength(1000, { message: 'Description must not exceed 1000 characters' })
  description?: string;

  @IsString({ message: 'Event type must be a string' })
  @IsOptional()
  @MaxLength(50, { message: 'Event type must not exceed 50 characters' })
  eventType?: string;

  @IsNotEmpty({ message: 'Event date is required' })
  @IsDateString({}, { message: 'Event date must be a valid date string' })
  eventDate!: string;

  @IsString({ message: 'Start time must be a string' })
  @IsNotEmpty({ message: 'Start time is required' })
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Start time must be in HH:MM format',
  })
  startTime!: string;

  @IsString({ message: 'End time must be a string' })
  @IsOptional()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'End time must be in HH:MM format',
  })
  endTime?: string;

  @IsString({ message: 'Route description must be a string' })
  @IsOptional()
  routeDescription?: string;

  @IsString({ message: 'Meeting point must be a string' })
  @IsOptional()
  @MaxLength(255, { message: 'Meeting point must not exceed 255 characters' })
  meetingPoint?: string;

  @ValidateNested()
  @Type(() => LocationDto)
  @IsOptional()
  meetingPointLocation?: LocationDto;

  @IsNumber({}, { message: 'Max participants must be a number' })
  @IsOptional()
  @Min(1, { message: 'Max participants must be at least 1' })
  maxParticipants?: number;

  @IsMongoId({ message: 'Regional ID must be a valid MongoDB ObjectId' })
  @IsNotEmpty({ message: 'Regional ID is required' })
  regionalId!: string;

  @IsEnum(['draft', 'published', 'cancelled', 'completed'], {
    message: 'Status must be one of: draft, published, cancelled, completed',
  })
  @IsOptional()
  status?: 'draft' | 'published' | 'cancelled' | 'completed';
}
