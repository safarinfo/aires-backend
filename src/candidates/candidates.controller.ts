import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CandidatesService } from './candidates.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role, CandidateStatus } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';

@Controller('candidates')
@ApiTags('Candidates')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) {}

  @Post()
  @Roles(Role.RECRUITER, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a new candidate' })
  @ApiResponse({ status: 201, description: 'Candidate created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(@Body() createCandidateDto: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    skills: string[];
    experience: number;
    recruiterId: string;
  }) {
    return this.candidatesService.createCandidate(createCandidateDto);
  }

  @Get()
  @Roles(Role.RECRUITER, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get all candidates with optional filters' })
  @ApiResponse({ status: 200, description: 'Candidates retrieved successfully' })
  findAll(
    @Query('status') status?: CandidateStatus,
    @Query('skills') skills?: string,
    @Query('minExperience') minExperience?: string,
    @Query('recruiterId') recruiterId?: string,
  ) {
    const filters: any = {};
    if (status) filters.status = status;
    if (skills) filters.skills = skills.split(',');
    if (minExperience) filters.minExperience = parseInt(minExperience);
    if (recruiterId) filters.recruiterId = recruiterId;

    return this.candidatesService.findAll(filters);
  }

  @Get(':id')
  @Roles(Role.RECRUITER, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get a candidate by ID' })
  @ApiResponse({ status: 200, description: 'Candidate retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Candidate not found' })
  findOne(@Param('id') id: string) {
    return this.candidatesService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.RECRUITER, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update a candidate' })
  @ApiResponse({ status: 200, description: 'Candidate updated successfully' })
  @ApiResponse({ status: 404, description: 'Candidate not found' })
  update(
    @Param('id') id: string,
    @Body() updateCandidateDto: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      skills?: string[];
      experience?: number;
      status?: CandidateStatus;
      recruiterId?: string;
    },
  ) {
    return this.candidatesService.updateCandidate(id, updateCandidateDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete a candidate' })
  @ApiResponse({ status: 200, description: 'Candidate deleted successfully' })
  @ApiResponse({ status: 404, description: 'Candidate not found' })
  remove(@Param('id') id: string) {
    return this.candidatesService.removeCandidate(id);
  }

  @Post(':id/resume')
  @Roles(Role.RECRUITER, Role.ADMIN, Role.SUPER_ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload a candidate resume' })
  @ApiResponse({ status: 200, description: 'Resume uploaded successfully' })
  @ApiResponse({ status: 404, description: 'Candidate not found' })
  async uploadResume(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // TODO: Implement S3 upload and get URL
    const resumeUrl = 'https://example.com/resume.pdf'; // Replace with actual S3 URL
    return this.candidatesService.uploadResume(id, resumeUrl);
  }
} 