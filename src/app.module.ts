import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CandidatesModule } from './candidates/candidates.module';
import { JobOrdersModule } from './job-orders/job-orders.module';
import { SubmittalsModule } from './submittals/submittals.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    CandidatesModule,
    JobOrdersModule,
    SubmittalsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {} 