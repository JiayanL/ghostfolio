import { ExportModule } from '@ghostfolio/api/app/export/export.module';
import { UserModule } from '@ghostfolio/api/app/user/user.module';
import { ConfigurationModule } from '@ghostfolio/api/services/configuration/configuration.module';

import { Module } from '@nestjs/common';

import { BackupController } from './backup.controller';
import { BackupService } from './backup.service';

@Module({
  controllers: [BackupController],
  exports: [BackupService],
  imports: [ConfigurationModule, ExportModule, UserModule],
  providers: [BackupService]
})
export class BackupModule {}
