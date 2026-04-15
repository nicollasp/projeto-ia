import { useState, useEffect } from "react";
import { login as loginApi } from "../services/auth";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  function toggleTheme() {
    if (dark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setDark(!dark);
  }

  async function handleLogin() {
    try {
      const data = await loginApi(email, senha);
      localStorage.setItem("token", data.accessToken);

      login(data.accessToken);
      navigate("/dashboard");
    } catch {
      alert("Erro ao logar");
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-900 dark:from-gray-900 dark:to-gray-800 transition duration-500">
      {/* botão tema */}
      <button
        onClick={toggleTheme}
        className="hover:opacity-50 absolute top-5 right-5 bg-blue-900 dark:bg-gray-800 text-black dark:text-white px-4 py-1 rounded-md shadow"
      >
        {dark ? "☀️" : "🌙"}
      </button>

      <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl w-80 transition duration-500">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
          Login
        </h1>

        <input
          className="w-full mb-4 p-3 border border-gray-300 dark:border-gray-700 rounded-lg 
          bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white 
          focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full mb-6 p-3 border border-gray-300 dark:border-gray-700 rounded-lg 
          bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white 
          focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          placeholder="Senha"
          type="password"
          onChange={(e) => setSenha(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 hover:bg-opacity-50 text-white py-3 rounded-lg font-semibold transition duration-300
          focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          Entrar
        </button>
      </div>
    </div>
  );
}
