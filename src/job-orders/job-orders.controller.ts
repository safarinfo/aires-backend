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
import { JobOrdersService } from './job-orders.service';
import { JobOrderStatus, UserRole } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateJobOrderDto } from './dto/create-job-order.dto';
import { UpdateJobOrderDto } from './dto/update-job-order.dto';
import { QueryJobOrderDto } from './dto/query-job-order.dto';

@ApiTags('job-orders')
@ApiBearerAuth()
@Controller('job-orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class JobOrdersController {
  constructor(private readonly jobOrdersService: JobOrdersService) {}

  @Post()
  @Roles(UserRole.RECRUITER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a new job order' })
  @ApiResponse({ status: 201, description: 'Job order created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  createJobOrder(@Body() createJobOrderDto: CreateJobOrderDto) {
    return this.jobOrdersService.createJobOrder(createJobOrderDto);
  }

  @Get()
  @Roles(UserRole.RECRUITER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get all job orders' })
  @ApiResponse({ status: 200, description: 'Return all job orders' })
  findAll(@Query() query: QueryJobOrderDto) {
    return this.jobOrdersService.findAll(query);
  }

  @Get('stats')
  @Roles(UserRole.RECRUITER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get job order statistics' })
  @ApiResponse({ status: 200, description: 'Return job order statistics' })
  getStats() {
    return this.jobOrdersService.getJobOrderStats();
  }

  @Get(':id')
  @Roles(UserRole.RECRUITER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get a job order by id' })
  @ApiResponse({ status: 200, description: 'Return the job order' })
  @ApiResponse({ status: 404, description: 'Job order not found' })
  findOne(@Param('id') id: string) {
    return this.jobOrdersService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.RECRUITER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update a job order' })
  @ApiResponse({ status: 200, description: 'Job order updated successfully' })
  @ApiResponse({ status: 404, description: 'Job order not found' })
  updateJobOrder(
    @Param('id') id: string,
    @Body() updateJobOrderDto: UpdateJobOrderDto,
  ) {
    return this.jobOrdersService.updateJobOrder(id, updateJobOrderDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete a job order' })
  @ApiResponse({ status: 200, description: 'Job order deleted successfully' })
  @ApiResponse({ status: 404, description: 'Job order not found' })
  removeJobOrder(@Param('id') id: string) {
    return this.jobOrdersService.removeJobOrder(id);
  }
} 