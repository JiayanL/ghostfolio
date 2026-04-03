import { HasPermission } from '@ghostfolio/api/decorators/has-permission.decorator';
import { HasPermissionGuard } from '@ghostfolio/api/guards/has-permission.guard';
import { permissions } from '@ghostfolio/common/permissions';

import {
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Res,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';

import { BackupFileInfo, BackupService } from './backup.service';

@Controller('admin/backup')
export class BackupController {
  public constructor(private readonly backupService: BackupService) {}

  @Post()
  @HasPermission(permissions.accessAdminControl)
  @UseGuards(AuthGuard('jwt'), HasPermissionGuard)
  public async createBackup(): Promise<BackupFileInfo> {
    try {
      return await this.backupService.createBackup();
    } catch (error) {
      throw new HttpException(
        {
          error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
          message: [error.message]
        },
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get()
  @HasPermission(permissions.accessAdminControl)
  @UseGuards(AuthGuard('jwt'), HasPermissionGuard)
  public async getBackups(): Promise<BackupFileInfo[]> {
    return this.backupService.getBackups();
  }

  @Get(':fileName')
  @HasPermission(permissions.accessAdminControl)
  @UseGuards(AuthGuard('jwt'), HasPermissionGuard)
  public async downloadBackup(
    @Param('fileName') fileName: string,
    @Res() response: Response
  ): Promise<void> {
    const filePath = this.backupService.getBackupFilePath(fileName);

    if (!filePath) {
      throw new HttpException(
        getReasonPhrase(StatusCodes.NOT_FOUND),
        StatusCodes.NOT_FOUND
      );
    }

    response.download(filePath, fileName);
  }

  @Delete(':fileName')
  @HasPermission(permissions.accessAdminControl)
  @UseGuards(AuthGuard('jwt'), HasPermissionGuard)
  public async deleteBackup(
    @Param('fileName') fileName: string
  ): Promise<void> {
    const deleted = this.backupService.deleteBackup(fileName);

    if (!deleted) {
      throw new HttpException(
        getReasonPhrase(StatusCodes.NOT_FOUND),
        StatusCodes.NOT_FOUND
      );
    }
  }

  @Post('cleanup')
  @HasPermission(permissions.accessAdminControl)
  @UseGuards(AuthGuard('jwt'), HasPermissionGuard)
  public async cleanUpOldBackups(): Promise<{ deletedCount: number }> {
    const deletedCount = this.backupService.cleanUpOldBackups();

    return { deletedCount };
  }
}
