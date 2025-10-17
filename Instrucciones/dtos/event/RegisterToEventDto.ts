import { IsMongoId, IsNotEmpty } from 'class-validator';

export class RegisterToEventDto {
  @IsMongoId({ message: 'Event ID must be a valid MongoDB ObjectId' })
  @IsNotEmpty({ message: 'Event ID is required' })
  eventId!: string;
}
