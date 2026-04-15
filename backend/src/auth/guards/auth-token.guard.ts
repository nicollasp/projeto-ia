import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { REQUEST_TOKEN_PAYLOAD_NAME } from '../common/auth.constants';
import { PrismaService } from 'src/common/prisma.service';
import { PayloadTokenDto } from '../dto/payload_token.dto';
import { RequestComPayload } from '../types/request-com-payload';

@Injectable()
export class AuthTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<RequestComPayload>();
    const token = this.extractTokenHeader(req);

    if (!token) {
      throw new UnauthorizedException('Token não encontrado');
    }

    try {
      const payload = await this.jwtService.verifyAsync<PayloadTokenDto>(token);
      const usuario = await this.prisma.usuario.findUnique({
        where: { id: payload.sub },
      });

      if (!usuario) {
        throw new UnauthorizedException('Usuário não existe');
      }

      req[REQUEST_TOKEN_PAYLOAD_NAME] = payload;
    } catch {
      throw new UnauthorizedException('Token não autorizado');
    }

    return true;
  }

  extractTokenHeader(req: RequestComPayload) {
    const autorizacao = req.headers?.authorization;

    if (!autorizacao || typeof autorizacao !== 'string') {
      return;
    }

    const [tipo, token] = autorizacao.split(' ');

    if (tipo !== 'Bearer' || !token) {
      throw new UnauthorizedException('Token mal formatado');
    }

    return token;
  }
}
