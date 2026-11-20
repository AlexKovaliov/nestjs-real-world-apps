import { Module } from '@nestjs/common';
import { PaginationService } from './pagination/pagination.service';
import { EncryptionService } from './encryption/encryption.service';

@Module({
  providers: [PaginationService, EncryptionService],
  exports: [PaginationService, EncryptionService],
})
export class CommonModule {}
