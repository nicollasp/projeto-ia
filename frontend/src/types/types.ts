export type Resumo = {
  entradas: number;
  saidas: number;
  saldo: number;
};
export type Grafico = {
  mes: string;
  entradas: number;
  saidas: number;
};
export type Transacao = {
  id: number;
  tipo: "ENTRADA" | "SAIDA";
  valor: number;
  categoria: string;
  data: string;
};
export type RespostaIA = {
  resumo: string;
  problemas: string[];
  dicas: string[];
  economia: string[];
};
