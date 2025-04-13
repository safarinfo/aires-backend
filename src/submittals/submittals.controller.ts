import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SubmittalsService } from './submittals.service';
import { SubmittalStatus, UserRole } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('submittals')
@ApiBearerAuth()
@Controller('submittals')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SubmittalsController {
  constructor(private readonly submittalsService: SubmittalsService) {}

  @Post()
  @Roles(UserRole.RECRUITER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a new submittal' })
  @ApiResponse({ status: 201, description: 'Submittal created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  createSubmittal(
    @Body() data: {
      jobOrderId: string;
      candidateId: string;
    },
  ) {
    return this.submittalsService.createSubmittal(data);
  }

  @Get()
  @Roles(UserRole.RECRUITER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get all submittals' })
  @ApiResponse({ status: 200, description: 'Return all submittals' })
  findAll(
    @Query('jobOrderId') jobOrderId?: string,
    @Query('candidateId') candidateId?: string,
    @Query('status') status?: SubmittalStatus,
  ) {
    return this.submittalsService.findAll({ jobOrderId, candidateId, status });
  }

  @Get('stats')
  @Roles(UserRole.RECRUITER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get submittal statistics' })
  @ApiResponse({ status: 200, description: 'Return submittal statistics' })
  getStats() {
    return this.submittalsService.getSubmittalStats();
  }

  @Get(':id')
  @Roles(UserRole.RECRUITER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get a submittal by id' })
  @ApiResponse({ status: 200, description: 'Return the submittal' })
  @ApiResponse({ status: 404, description: 'Submittal not found' })
  findOne(@Param('id') id: string) {
    return this.submittalsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.RECRUITER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update a submittal' })
  @ApiResponse({ status: 200, description: 'Submittal updated successfully' })
  @ApiResponse({ status: 404, description: 'Submittal not found' })
  updateSubmittal(
    @Param('id') id: string,
    @Body() data: {
      status?: SubmittalStatus;
    },
  ) {
    return this.submittalsService.updateSubmittal(id, data);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete a submittal' })
  @ApiResponse({ status: 200, description: 'Submittal deleted successfully' })
  @ApiResponse({ status: 404, description: 'Submittal not found' })
  removeSubmittal(@Param('id') id: string) {
    return this.submittalsService.removeSubmittal(id);
  }
} 