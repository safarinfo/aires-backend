import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CandidateStatus } from '@prisma/client';

@Injectable()
export class CandidatesService {
  constructor(private readonly prisma: PrismaService) {}

  async createCandidate(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    skills: string[];
    experience: number;
    recruiterId: string;
  }) {
    return this.prisma.candidate.create({
      data,
      include: {
        recruiter: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  async findAll(filters?: {
    status?: CandidateStatus;
    skills?: string[];
    minExperience?: number;
    recruiterId?: string;
  }) {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.skills?.length) {
      where.skills = {
        hasSome: filters.skills,
      };
    }

    if (filters?.minExperience) {
      where.experience = {
        gte: filters.minExperience,
      };
    }

    if (filters?.recruiterId) {
      where.recruiterId = filters.recruiterId;
    }

    return this.prisma.candidate.findMany({
      where,
      include: {
        recruiter: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        submittals: {
          include: {
            jobOrder: {
              select: {
                id: true,
                title: true,
                status: true,
              },
            },
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const candidate = await this.prisma.candidate.findUnique({
      where: { id },
      include: {
        recruiter: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        submittals: {
          include: {
            jobOrder: {
              select: {
                id: true,
                title: true,
                status: true,
              },
            },
          },
        },
      },
    });

    if (!candidate) {
      throw new NotFoundException('Candidate not found');
    }

    return candidate;
  }

  async updateCandidate(id: string, data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    skills?: string[];
    experience?: number;
    status?: CandidateStatus;
    recruiterId?: string;
  }) {
    const candidate = await this.prisma.candidate.findUnique({
      where: { id },
    });

    if (!candidate) {
      throw new NotFoundException('Candidate not found');
    }

    return this.prisma.candidate.update({
      where: { id },
      data,
      include: {
        recruiter: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  async removeCandidate(id: string) {
    const candidate = await this.prisma.candidate.findUnique({
      where: { id },
    });

    if (!candidate) {
      throw new NotFoundException('Candidate not found');
    }

    return this.prisma.candidate.delete({
      where: { id },
      include: {
        recruiter: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  async uploadResume(id: string, resumeUrl: string) {
    const candidate = await this.prisma.candidate.findUnique({
      where: { id },
    });

    if (!candidate) {
      throw new NotFoundException('Candidate not found');
    }

    return this.prisma.candidate.update({
      where: { id },
      data: { resumeUrl },
      include: {
        recruiter: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }
} 