import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JobOrderStatus } from '@prisma/client';

@Injectable()
export class JobOrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async createJobOrder(data: {
    title: string;
    description: string;
    requirements: string[];
    clientId: string;
  }) {
    return this.prisma.jobOrder.create({
      data,
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        submittals: {
          include: {
            candidate: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                status: true,
              },
            },
          },
        },
      },
    });
  }

  async findAll(filters?: {
    status?: JobOrderStatus;
    clientId?: string;
    search?: string;
  }) {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.clientId) {
      where.clientId = filters.clientId;
    }

    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.jobOrder.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        submittals: {
          include: {
            candidate: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                status: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const jobOrder = await this.prisma.jobOrder.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        submittals: {
          include: {
            candidate: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                status: true,
              },
            },
          },
        },
      },
    });

    if (!jobOrder) {
      throw new NotFoundException('Job order not found');
    }

    return jobOrder;
  }

  async updateJobOrder(id: string, data: {
    title?: string;
    description?: string;
    requirements?: string[];
    status?: JobOrderStatus;
  }) {
    const jobOrder = await this.prisma.jobOrder.findUnique({
      where: { id },
    });

    if (!jobOrder) {
      throw new NotFoundException('Job order not found');
    }

    return this.prisma.jobOrder.update({
      where: { id },
      data,
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        submittals: {
          include: {
            candidate: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                status: true,
              },
            },
          },
        },
      },
    });
  }

  async removeJobOrder(id: string) {
    const jobOrder = await this.prisma.jobOrder.findUnique({
      where: { id },
    });

    if (!jobOrder) {
      throw new NotFoundException('Job order not found');
    }

    return this.prisma.jobOrder.delete({
      where: { id },
      include: {
        client: {
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

  async getJobOrderStats() {
    const total = await this.prisma.jobOrder.count();
    const open = await this.prisma.jobOrder.count({
      where: { status: JobOrderStatus.OPEN },
    });
    const closed = await this.prisma.jobOrder.count({
      where: { status: JobOrderStatus.CLOSED },
    });
    const onHold = await this.prisma.jobOrder.count({
      where: { status: JobOrderStatus.ON_HOLD },
    });

    return {
      total,
      open,
      closed,
      onHold,
    };
  }
} 