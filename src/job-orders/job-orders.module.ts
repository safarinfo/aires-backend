import { Module } from '@nestjs/common';
import { JobOrdersService } from './job-orders.service';
import { JobOrdersController } from './job-orders.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [JobOrdersController],
  providers: [JobOrdersService],
  exports: [JobOrdersService],
})
export class JobOrdersModule {} 