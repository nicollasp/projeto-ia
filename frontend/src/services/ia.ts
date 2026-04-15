import { request } from "./api";

export function analisarIA(pergunta: string) {
  return request("/ia/analise", {
    method: "POST",
    body: JSON.stringify({ pergunta }),
  });
}
