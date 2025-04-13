import { Module } from '@nestjs/common';
import { SubmittalsService } from './submittals.service';
import { SubmittalsController } from './submittals.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { JobOrdersModule } from '../job-orders/job-orders.module';

@Module({
  imports: [PrismaModule, UsersModule, JobOrdersModule],
  controllers: [SubmittalsController],
  providers: [SubmittalsService],
  exports: [SubmittalsService],
})
export class SubmittalsModule {} 