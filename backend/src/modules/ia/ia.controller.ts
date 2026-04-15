import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { IaService } from './ia.service';
import { TransacaoService } from '../transacao/transacao.service';
import { TokenPayloadParam } from 'src/auth/param/token-payload.param';
import { PayloadTokenDto } from 'src/auth/dto/payload_token.dto';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';

@UseGuards(AuthTokenGuard)
@Controller('ia')
export class IaController {
  constructor(
    private readonly iaService: IaService,
    private readonly transacaoService: TransacaoService,
  ) {}

  @Post('analise')
  async analisar(
    @TokenPayloadParam() payload: PayloadTokenDto,
    @Body('pergunta') pergunta?: string,
  ) {
    const transacoes = await this.transacaoService.listarPorUsuario(
      payload.sub,
    );

    console.log('USER ID:', payload.sub);
    console.log('TRANSACOES:', transacoes);

    return this.iaService.analisarFinancas(transacoes || [], pergunta);
  }
}
