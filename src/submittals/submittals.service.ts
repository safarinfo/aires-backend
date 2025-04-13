import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubmittalStatus } from '@prisma/client';

@Injectable()
export class SubmittalsService {
  constructor(private readonly prisma: PrismaService) {}

  async createSubmittal(data: {
    jobOrderId: string;
    candidateId: string;
  }) {
    return this.prisma.submittal.create({
      data,
      include: {
        jobOrder: {
          select: {
            id: true,
            title: true,
            status: true,
            client: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        candidate: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            resumeUrl: true,
          },
        },
      },
    });
  }

  async findAll(filters?: {
    jobOrderId?: string;
    candidateId?: string;
    status?: SubmittalStatus;
  }) {
    const where: any = {};

    if (filters?.jobOrderId) {
      where.jobOrderId = filters.jobOrderId;
    }

    if (filters?.candidateId) {
      where.candidateId = filters.candidateId;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    return this.prisma.submittal.findMany({
      where,
      include: {
        jobOrder: {
          select: {
            id: true,
            title: true,
            status: true,
            client: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        candidate: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            resumeUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const submittal = await this.prisma.submittal.findUnique({
      where: { id },
      include: {
        jobOrder: {
          select: {
            id: true,
            title: true,
            status: true,
            client: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        candidate: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            resumeUrl: true,
          },
        },
      },
    });

    if (!submittal) {
      throw new NotFoundException('Submittal not found');
    }

    return submittal;
  }

  async updateSubmittal(id: string, data: {
    status?: SubmittalStatus;
  }) {
    const submittal = await this.prisma.submittal.findUnique({
      where: { id },
    });

    if (!submittal) {
      throw new NotFoundException('Submittal not found');
    }

    return this.prisma.submittal.update({
      where: { id },
      data,
      include: {
        jobOrder: {
          select: {
            id: true,
            title: true,
            status: true,
            client: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        candidate: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            resumeUrl: true,
          },
        },
      },
    });
  }

  async removeSubmittal(id: string) {
    const submittal = await this.prisma.submittal.findUnique({
      where: { id },
    });

    if (!submittal) {
      throw new NotFoundException('Submittal not found');
    }

    return this.prisma.submittal.delete({
      where: { id },
      include: {
        jobOrder: {
          select: {
            id: true,
            title: true,
          },
        },
        candidate: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async getSubmittalStats() {
    const total = await this.prisma.submittal.count();
    const pending = await this.prisma.submittal.count({
      where: { status: SubmittalStatus.PENDING },
    });
    const accepted = await this.prisma.submittal.count({
      where: { status: SubmittalStatus.ACCEPTED },
    });
    const rejected = await this.prisma.submittal.count({
      where: { status: SubmittalStatus.REJECTED },
    });
    const interviewing = await this.prisma.submittal.count({
      where: { status: SubmittalStatus.INTERVIEWING },
    });
    const offered = await this.prisma.submittal.count({
      where: { status: SubmittalStatus.OFFERED },
    });
    const hired = await this.prisma.submittal.count({
      where: { status: SubmittalStatus.HIRED },
    });

    return {
      total,
      pending,
      accepted,
      rejected,
      interviewing,
      offered,
      hired,
    };
  }
} 