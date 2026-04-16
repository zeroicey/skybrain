import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateDroneDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  model!: string;
}
