import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsNotEmpty, IsUUID, ArrayMinSize } from 'class-validator';

export class CreateJobOrderDto {
  @ApiProperty({
    description: 'The title of the job order',
    example: 'Senior Software Engineer',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Detailed description of the job order',
    example: 'We are looking for an experienced software engineer...',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'List of requirements for the position',
    example: ['5+ years experience', 'Node.js expertise', 'Team leadership'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  requirements: string[];

  @ApiProperty({
    description: 'The ID of the client who posted this job order',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  clientId: string;
} 