import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TransacaoService } from './transacao.service';
import { CriarTransacaoDto } from './dto/criarTransacaoDto';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { TokenPayloadParam } from 'src/auth/param/token-payload.param';
import { PayloadTokenDto } from 'src/auth/dto/payload_token.dto';
@UseGuards(AuthTokenGuard)
@Controller('transacoes')
export class TransacaoController {
  constructor(private readonly transacaoService: TransacaoService) {}

  @Post('criar')
  criarTransacao(
    @Body() body: CriarTransacaoDto,
    @TokenPayloadParam() payload: PayloadTokenDto,
  ) {
    return this.transacaoService.criarTransacao(payload.sub, body);
  }

  @Get()
  listar(@TokenPayloadParam() payload: PayloadTokenDto) {
    return this.transacaoService.listarPorUsuario(payload.sub);
  }
  @Delete('deletar/:id')
  deletarTransacao(
    @Param('id', ParseIntPipe) id: number,
    @TokenPayloadParam() payload: PayloadTokenDto,
  ) {
    return this.transacaoService.deletarTransacao(id, payload.sub);
  }
  @Get('resumo')
  resumo(@TokenPayloadParam() payload: PayloadTokenDto) {
    return this.transacaoService.resumoMensal(payload.sub);
  }
  @Get('grafico')
  grafico(@TokenPayloadParam() payload: PayloadTokenDto) {
    return this.transacaoService.graficoMensal(payload.sub);
  }
}
