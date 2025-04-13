import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateSubmittalDto {
  @ApiProperty({
    description: 'The ID of the job order',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  jobOrderId: string;

  @ApiProperty({
    description: 'The ID of the candidate',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  candidateId: string;
} 