import { Module } from '@nestjs/common';
import { IaService } from './ia.service';
import { IaController } from './ia.controller';
import { TransacaoService } from '../transacao/transacao.service';
import { PrismaService } from 'src/common/prisma.service';

@Module({
  controllers: [IaController],
  providers: [IaService, TransacaoService, PrismaService],
})
export class IaModule {}
