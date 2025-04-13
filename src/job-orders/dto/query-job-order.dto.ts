import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { JobOrderStatus } from '@prisma/client';

export class QueryJobOrderDto {
  @ApiProperty({
    description: 'Filter by job order status',
    enum: JobOrderStatus,
    required: false,
  })
  @IsEnum(JobOrderStatus)
  @IsOptional()
  status?: JobOrderStatus;

  @ApiProperty({
    description: 'Filter by client ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  clientId?: string;

  @ApiProperty({
    description: 'Search in title and description',
    example: 'software engineer',
    required: false,
  })
  @IsString()
  @IsOptional()
  search?: string;
} 