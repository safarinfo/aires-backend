import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsOptional, IsEnum, IsUUID, ArrayMinSize } from 'class-validator';
import { JobOrderStatus } from '@prisma/client';

export class UpdateJobOrderDto {
  @ApiProperty({
    description: 'The title of the job order',
    example: 'Senior Software Engineer',
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'Detailed description of the job order',
    example: 'We are looking for an experienced software engineer...',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'List of requirements for the position',
    example: ['5+ years experience', 'Node.js expertise', 'Team leadership'],
    type: [String],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @IsOptional()
  requirements?: string[];

  @ApiProperty({
    description: 'The status of the job order',
    enum: JobOrderStatus,
    required: false,
  })
  @IsEnum(JobOrderStatus)
  @IsOptional()
  status?: JobOrderStatus;
} 