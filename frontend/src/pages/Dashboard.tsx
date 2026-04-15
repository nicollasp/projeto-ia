import { useEffect, useState } from "react";
import {
  listarTransacoes,
  criarTransacao,
  deletarTransacao,
  obterResumo,
} from "../services/transacao";
import { analisarIA } from "../services/ia";

type Resumo = {
  entradas: number;
  saidas: number;
  saldo: number;
};

export default function Dashboard() {
  const [transacoes, setTransacoes] = useState<any[]>([]);
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("ENTRADA");
  const [categoria, setCategoria] = useState("");
  const [resumo, setResumo] = useState<Resumo | null>(null);

  const [pergunta, setPergunta] = useState("");
  const [respostaIA, setRespostaIA] = useState<any | null>(null);
  const [loadingIA, setLoadingIA] = useState(false);

  const [dark, setDark] = useState(
    () => localStorage.getItem("theme") === "dark",
  );

  // 🌙 DARK MODE GLOBAL
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  function toggleTheme() {
    const novo = !dark;
    setDark(novo);
    localStorage.setItem("theme", novo ? "dark" : "light");
  }

  async function carregarDados() {
    const [t, r] = await Promise.all([listarTransacoes(), obterResumo()]);

    setTransacoes(t || []);
    setResumo(r);
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r  from-blue-600 to-blue-900 dark:from-gray-900 dark:to-gray-800 transition text-black dark:text-white">
      {/* 🌙 botão tema */}
      <button
        onClick={toggleTheme}
        className="hover:opacity-50 absolute top-5 right-5 bg-blue-900 dark:bg-gray-800 text-black dark:text-white px-4 py-1 rounded-md shadow"
      >
        {dark ? "☀️" : "🌙"}
      </button>

      {/* container */}
      <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl w-[700px]">
        <h1 className="text-2xl font-bold text-center mb-6">Dashboard 💰</h1>

        {/* cards */}
        {resumo && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: "Entradas", value: resumo.entradas },
              { label: "Saídas", value: resumo.saidas },
              { label: "Saldo", value: resumo.saldo },
            ].map((c) => (
              <div
                key={c.label}
                className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl"
              >
                <p className="text-sm">{c.label}</p>
                <strong>R$ {c.value}</strong>
              </div>
            ))}
          </div>
        )}

        {/* form */}
        <div className="flex gap-2 mb-6">
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="p-2 rounded bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="ENTRADA">Entrada</option>
            <option value="SAIDA">Saída</option>
          </select>

          <input
            placeholder="Valor"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            className="p-2 rounded bg-gray-100 dark:bg-gray-800 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />

          <input
            placeholder="Categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="p-2 rounded bg-gray-100 dark:bg-gray-800 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />

          <button
            onClick={adicionar}
            className="hover:opacity-50 bg-blue-500 text-white px-4 rounded transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            +
          </button>
        </div>

        {/* lista */}
        <div className="space-y-3">
          {transacoes.map((t) => (
            <div
              key={t.id}
              className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 p-3 rounded-lg"
            >
              <span>
                {t.tipo === "ENTRADA" ? "+" : "-"} R$ {t.valor} ({t.categoria})
              </span>

              <button
                onClick={() => deletar(t.id)}
                className="rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition   hover:opacity-50"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>

        {/* IA */}
        <div className="mt-5">
          <h2 className="text-lg font-semibold mb-3">🤖 Pergunte à IA</h2>

          <div className="flex gap-2 mb-4">
            <input
              placeholder="Ex: Como posso economizar?"
              value={pergunta}
              onChange={(e) => setPergunta(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition "
            />

            <button
              onClick={perguntarIA}
              className="bg-blue-500 text-white px-4 rounded-lg hover:opacity-50  transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              {loadingIA ? "..." : "Perguntar"}
            </button>
          </div>

          {respostaIA && (
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl">
              <p className="mb-2">
                <strong>Resumo:</strong> {respostaIA.resumo}
              </p>

              <ul className="list-disc ml-5 space-y-1">
                {respostaIA.dicas.map((d: string, i: number) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <button
          className="bg-blue-500 text-white px-4 rounded-lg hover:opacity-50  transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition  "
          onClick={logout}
        >
          Sair
        </button>
      </div>
    </div>
  );
}
