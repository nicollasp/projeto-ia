import { BadRequestException, Injectable } from '@nestjs/common';
import { CriarTransacaoDto } from './dto/criarTransacaoDto';
import { PrismaService } from 'src/common/prisma.service';

@Injectable()
export class TransacaoService {
  constructor(private readonly prismaService: PrismaService) {}
  async criarTransacao(usuarioId: number, body: CriarTransacaoDto) {
    return this.prismaService.transacoes.create({
      data: {
        tipo: body.tipo,
        valor: body.valor,
        categoria: body.categoria,
        data: body.data ? new Date(body.data) : new Date(),

        usuario: {
          connect: {
            id: usuarioId,
          },
        },
      },
    });
  }
  async resumoMensal(usuarioId: number) {
    const transacoes = await this.prismaService.transacoes.findMany({
      where: {
        usuarioId: usuarioId,
      },
    });
    if (!transacoes) {
      throw new BadRequestException('Nenhuma transação encontrada!');
    }

    const entradas = transacoes
      .filter((t) => t.tipo === 'ENTRADA')
      .reduce((acc, t) => acc + t.valor, 0);
    const saidas = transacoes
      .filter((t) => t.tipo === 'SAIDA')
      .reduce((acc, t) => acc + t.valor, 0);

    return {
      message: 'Resumo mensal:',
      transacoes,
      entradas,
      saidas,
      saldo: entradas - saidas,
    };
  }
  async deletarTransacao(id: number, usuarioId: number) {
    const transacao = await this.prismaService.transacoes.findUnique({
      where: { id },
    });

    if (!transacao || transacao.usuarioId !== usuarioId) {
      throw new Error('Não autorizado');
    }

    return this.prismaService.transacoes.delete({
      where: { id },
    });
  }
  async listarPorUsuario(usuarioId: number) {
    return this.prismaService.transacoes.findMany({
      where: { usuarioId },
    });
  }
}
