import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuarioModule } from '../modules/usuario/usuario.module';
import { PrismaService } from '../common/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'src/common/prisma.module';
import { TransacaoModule } from 'src/modules/transacao/transacao.module';
import { AuthModule } from 'src/auth/auth.module';
import { IaModule } from 'src/modules/ia/ia.module';

@Module({
  imports: [
    IaModule,
    AuthModule,
    TransacaoModule,
    PrismaModule,
    UsuarioModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
