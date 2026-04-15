import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/common/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HashingServiceProtocol } from './hash/hashing.service';
import { BcrytService } from './hash/bcrypt.service';

@Global()
@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  providers: [
    {
      provide: HashingServiceProtocol,
      useClass: BcrytService,
    },
    AuthService,
    PrismaService,
  ],
  controllers: [AuthController],
  exports: [HashingServiceProtocol, JwtModule, ConfigModule],
})
export class AuthModule {}
