import { useEffect, useState } from "react";
import {
  listarTransacoes,
  criarTransacao,
  deletarTransacao,
  obterResumo,
  obterGraficoMensal,
} from "../services/transacao";
import { analisarIA } from "../services/ia";
import GraficoMensal from "./GraficoMensal";
import { Grafico, RespostaIA, Resumo, Transacao } from "../types/types";

export default function Dashboard() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("ENTRADA");
  const [categoria, setCategoria] = useState("");
  const [resumo, setResumo] = useState<Resumo | null>(null);

  const [pergunta, setPergunta] = useState("");
  const [respostaIA, setRespostaIA] = useState<RespostaIA | null>(null);
  const [loadingIA, setLoadingIA] = useState(false);

  const [graficoMensal, setGraficoMensal] = useState<Grafico[]>([]);

  const [dark, setDark] = useState(
    () => localStorage.getItem("theme") === "dark",
  );

  //DARK MODE GLOBAL
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  function toggleTheme() {
    const novo = !dark;
    setDark(novo);
    localStorage.setItem("theme", novo ? "dark" : "light");
  }

  async function carregarDados() {
    try {
      const [t, r, mensal] = await Promise.all([
        listarTransacoes(),
        obterResumo(),
        obterGraficoMensal(),
      ]);

      setTransacoes(Array.isArray(t) ? t : []);
      setResumo(r || null);

      setGraficoMensal(Array.isArray(mensal) ? mensal : []);
    } catch (err) {
      console.error("Erro ao carregar:", err);
      setTransacoes([]);
      setGraficoMensal([]);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  async function adicionar() {
    if (!valor) return;

    await criarTransacao({
      tipo,
      valor: Number(valor),
      categoria: categoria || "geral",
      data: new Date().toISOString(),
    });

    setValor("");
    setCategoria("");
    carregarDados();
  }

  async function deletar(id: number) {
    await deletarTransacao(id);
    carregarDados();
  }

  async function perguntarIA() {
    if (!pergunta) return;

    setLoadingIA(true);
    try {
      const res = await analisarIA(pergunta);
      setRespostaIA(res);
    } catch {
      alert("Erro ao consultar IA");
    } finally {
      setLoadingIA(false);
    }
  }
  function logout() {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-blue-600 to-blue-900 dark:from-gray-900 dark:to-gray-800 text-black dark:text-white">
      {/* botão tema */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-6 bg-blue-900 dark:bg-gray-800 px-3 py-1 rounded-md shadow z-50 text-2xl "
      >
        {dark ? "☀️" : "🌙"}
      </button>

      <div className="w-full px-3 sm:px-6 md:px-10 lg:px-16 py-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
          Dashboard 💰
        </h1>

        {/* CARDS */}
        {resumo && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 text-2xl">
            {[
              { label: "Entradas", value: resumo.entradas },
              { label: "Saídas", value: resumo.saidas },
              { label: "Saldo", value: resumo.saldo },
            ].map((c) => (
              <div
                key={c.label}
                className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl shadow text-center"
              >
                <p className="text-sm opacity-70">{c.label}</p>
                <strong className="text-base sm:text-lg">R$ {c.value}</strong>
              </div>
            ))}
          </div>
        )}

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ESQUERDA */}
          <div className="lg:col-span-2 space-y-4">
            {/* FORM */}
            <div className="flex flex-col gap-3 sm:flex-row ">
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="p-6 rounded bg-gray-100 dark:bg-gray-800 w-full sm:w-auto text-xl font-semibold  focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                <option value="ENTRADA">Entrada</option>
                <option value="SAIDA">Saída</option>
              </select>

              <input
                placeholder="Valor"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                className="p-2 rounded bg-gray-100 dark:bg-gray-800 w-full text-xl  focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />

              <input
                placeholder="Categoria"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="p-2 rounded bg-gray-100 dark:bg-gray-800 w-full text-xl  focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />

              <button
                onClick={adicionar}
                className="bg-blue-500 text-white px-16 py-2 rounded w-full sm:w-auto text-2xl  focus:outline-none focus:ring-2 focus:ring-blue-500 transition hover:bg-opacity-50 transition duration-300"
              >
                +
              </button>
            </div>

            {/* LISTA */}
            <div className="space-y-2">
              {transacoes.map((t) => (
                <div
                  key={t.id}
                  className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 p-5 rounded-lg text-xl font-semibold"
                >
                  <span className="truncate">
                    {t.tipo === "ENTRADA" ? "+" : "-"} R$ {t.valor} (
                    {t.categoria})
                  </span>

                  <button onClick={() => deletar(t.id)}>🗑️</button>
                </div>
              ))}
            </div>
          </div>

          {/* DIREITA */}
          <div className="space-y-4">
            {/* GRAFICO */}
            {graficoMensal.length > 0 && (
              <div className="bg-gray-100 dark:bg-gray-800 p-3 sm:p-8 rounded-xl">
                <GraficoMensal dados={graficoMensal} />
              </div>
            )}

            {/* IA */}
            <div className="bg-gray-100 dark:bg-gray-800 p-3 sm:p-4 rounded-xl">
              <h2 className="text-base sm:text-xl font-semibold mb-5">
                🤖 Pergunte à IA
              </h2>

              <div className="flex flex-col sm:flex-row gap-2 mb-3">
                <input
                  placeholder="Ex: Como posso economizar?"
                  value={pergunta}
                  onChange={(e) => setPergunta(e.target.value)}
                  className="w-full p-2 rounded bg-gray-200 dark:bg-gray-700 text-xl font-semibold  focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />

                <button
                  onClick={perguntarIA}
                  className="bg-blue-500 text-white px-4 py-4 rounded hover:bg-opacity-50 transition duration-300"
                >
                  {loadingIA ? (
                    <span className="flex gap-1 justify-center items-center">
                      <span className="animate-bounce [animation-delay:-0.3s]">
                        .
                      </span>
                      <span className="animate-bounce [animation-delay:-0.15s]">
                        .
                      </span>
                      <span className="animate-bounce">.</span>
                    </span>
                  ) : (
                    "Perguntar"
                  )}
                </button>
              </div>

              {respostaIA && (
                <div className="bg-gray-200 dark:bg-gray-700 p-5 rounded text-xs sm:text-xl">
                  <p className="mb-1">
                    <strong>Resumo:</strong> {respostaIA.resumo}
                  </p>

                  <ul className="list-disc ml-4 space-y-1">
                    {respostaIA.dicas.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* LOGOUT */}
            <button
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-opacity-50 transition duration-300"
              onClick={logout}
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
