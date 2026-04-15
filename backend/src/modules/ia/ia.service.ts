import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AnaliseFinanceira } from './types/analise-financeira.type';
import { Transacao } from './types/transacao.type';

@Injectable()
export class IaService {
  private genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

  async analisarFinancas(
    transacoes: Transacao[],
    pergunta?: string,
  ): Promise<AnaliseFinanceira> {
    try {
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-3-flash-preview',
      });

      const texto = transacoes
        .map((t) => `${t.tipo} - R$ ${t.valor} - ${t.categoria}`)
        .join('\n');

      const prompt = `
Você é um consultor financeiro.

Aqui estão as transações do usuário, analise:

${texto}

Pergunta do usuário:

${pergunta || 'faça uma análise geral'}

Responda APENAS em JSON:

{
  "resumo": "...",
  "problemas": ["..."],
  "dicas": ["..."],
  "economia": ["..."]
}
`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();

      const cleaned = text
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      let json: AnaliseFinanceira;
      try {
        json = JSON.parse(cleaned) as AnaliseFinanceira;
      } catch {
        json = {
          resumo: 'Erro ao interpretar resposta da IA',
          problemas: [],
          dicas: [],
          economia: [],
        };
      }

      return json;
    } catch (err) {
      console.error('Erro IA:', err);

      return {
        resumo: 'IA indisponível no momento',
        problemas: [],
        dicas: ['Tente novamente mais tarde'],
        economia: [],
      };
    }
  }
}
