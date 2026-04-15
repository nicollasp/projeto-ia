import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CriarUsuarioDto } from './dto/criar-usuario.dto';
import * as bcrypt from 'bcrypt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Injectable()
export class UsuarioService {
  constructor(private readonly prismaService: PrismaService) {}

  async criarUsuario(body: CriarUsuarioDto) {
    const senhaHash: string = await bcrypt.hash(body.senha, 10);
    try {
      const novoUsuario = await this.prismaService.usuario.create({
        data: {
          nome: body.nome,
          email: body.email,
          senha: senhaHash,
        },
        select: {
          id: true,
          nome: true,
          email: true,
        },
      });
      return { message: 'Usuario criado com sucesso', novoUsuario };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new HttpException('Email ja cadastrado', HttpStatus.CONFLICT);
      }
      throw new HttpException(
        'Erro interno no servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async buscarUsuario(id: number) {
    const usuario = await this.prismaService.usuario.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        nome: true,
        email: true,
      },
    });
    if (!usuario) {
      throw new BadRequestException('Usuario não encontrado!');
    }
    return usuario;
  }
}
