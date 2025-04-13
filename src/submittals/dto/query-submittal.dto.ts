import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { SubmittalStatus } from '@prisma/client';

export class QuerySubmittalDto {
  @ApiProperty({
    description: 'Filter by job order ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  jobOrderId?: string;

  @ApiProperty({
    description: 'Filter by candidate ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  candidateId?: string;

  @ApiProperty({
    description: 'Filter by submittal status',
    enum: SubmittalStatus,
    required: false,
  })
  @IsEnum(SubmittalStatus)
  @IsOptional()
  status?: SubmittalStatus;
} 