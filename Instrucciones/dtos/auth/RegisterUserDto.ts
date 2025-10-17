import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Matches,
  IsInt,
  Min,
  Max,
} from 'class-validator';

export class RegisterUserDto {
  @IsEnum(['CC', 'TI', 'CE'], { message: 'Document type must be CC, TI, or CE' })
  @IsNotEmpty({ message: 'Document type is required' })
  documentType!: 'CC' | 'TI' | 'CE';

  @IsString({ message: 'Document number must be a string' })
  @IsNotEmpty({ message: 'Document number is required' })
  @MinLength(6, { message: 'Document number must be at least 6 characters' })
  @MaxLength(20, { message: 'Document number must not exceed 20 characters' })
  documentNumber!: string;

  @IsString({ message: 'First name must be a string' })
  @IsNotEmpty({ message: 'First name is required' })
  @MaxLength(100, { message: 'First name must not exceed 100 characters' })
  firstName!: string;

  @IsString({ message: 'Last name must be a string' })
  @IsNotEmpty({ message: 'Last name is required' })
  @MaxLength(100, { message: 'Last name must not exceed 100 characters' })
  lastName!: string;

  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  @MaxLength(255, { message: 'Email must not exceed 255 characters' })
  email!: string;

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @MaxLength(100, { message: 'Password must not exceed 100 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  password!: string;

  @IsString({ message: 'Phone must be a string' })
  @IsOptional()
  @MinLength(7, { message: 'Phone must be at least 7 characters' })
  @MaxLength(15, { message: 'Phone must not exceed 15 characters' })
  @Matches(/^\+?[\d\s-()]+$/, { message: 'Phone must contain only numbers, spaces, and valid characters' })
  phone?: string;

  @IsInt({ message: 'Socioeconomic stratum must be an integer' })
  @IsOptional()
  @Min(1, { message: 'Socioeconomic stratum must be between 1 and 6' })
  @Max(6, { message: 'Socioeconomic stratum must be between 1 and 6' })
  socioeconomicStratum?: number;



    @IsString({ message: 'Regional ID must be a string' })
    @IsNotEmpty({ message: 'Regional ID is required' })
    @Matches(/^[0-9a-fA-F]{24}$/, { message: 'Regional ID must be a valid MongoDB ObjectId' })
    regionalId!: string;
}
