import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { LoginDto } from './dto/login_usuario.dto';
import { JwtService } from '@nestjs/jwt';
import { HashingServiceProtocol } from './hash/hashing.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly hashingService: HashingServiceProtocol,
  ) {}

  async usuarioLogin(body: LoginDto) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { email: body.email },
    });

    if (!usuario) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const senhaValida = await this.hashingService.compare(
      body.senha,
      usuario.senha,
    );

    if (!senhaValida) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = {
      sub: usuario.id,
      email: usuario.email,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      usuario: {
        id: usuario.id,
        email: usuario.email,
      },
    };
  }
}
