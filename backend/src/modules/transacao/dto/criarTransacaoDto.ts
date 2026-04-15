import { IsDateString } from 'class-validator';

export class CriarTransacaoDto {
  tipo!: string;
  valor!: number;
  categoria!: string;
  @IsDateString()
  data?: string;
}
