import { request } from "./api";

export async function listarTransacoes() {
  return await request("/transacoes");
}

export function criarTransacao(data: any) {
  return request("/transacoes/criar", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
export function deletarTransacao(id: number) {
  return request(`/transacoes/deletar/${id}`, {
    method: "DELETE",
  });
}
export async function obterResumo() {
  return await request("/transacoes/resumo");
}
