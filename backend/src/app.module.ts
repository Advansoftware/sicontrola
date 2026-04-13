import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { DriversModule } from './drivers/drivers.module';
import { RefuelsModule } from './refuels/refuels.module';
import { MaintenancesModule } from './maintenances/maintenances.module';
import { PartsModule } from './parts/parts.module';
import { FinesModule } from './fines/fines.module';
import { RevisionsModule } from './revisions/revisions.module';
import { MailModule } from './mail/mail.module';
import { UploadsModule } from './uploads/uploads.module';
import { StudentsModule } from './students/students.module';
import { SecretaryModule } from './secretary/secretary.module';
import { UsageModule } from './usage/usage.module';
import { FinancialModule } from './financial/financial.module';

@Module({
  imports: [
    PrismaModule, 
    AuthModule, 
    MailModule,
    UploadsModule,
    StudentsModule,
    SecretaryModule,
    UsageModule,
    FinancialModule,
    VehiclesModule, 
    DriversModule, 
    RefuelsModule, 
    MaintenancesModule, 
    PartsModule,
    FinesModule,
    RevisionsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
