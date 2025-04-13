import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { SubmittalStatus } from '@prisma/client';

export class UpdateSubmittalDto {
  @ApiProperty({
    description: 'The status of the submittal',
    enum: SubmittalStatus,
    required: false,
  })
  @IsEnum(SubmittalStatus)
  @IsOptional()
  status?: SubmittalStatus;
} 