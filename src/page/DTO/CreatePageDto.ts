import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePageDto {
  @IsString()
  @ApiProperty()
  text: string;
}
