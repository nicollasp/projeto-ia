import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // 🔥 deixa global (melhor prática)
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
