import { useState } from "react";
import { Link, useNavigate } from "react-router";

export default function LoginForm() {
  // Création de useStates pour récupérer les valeurs des inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Au submit, la page se recharge, ce n'est pas le comportement voulu
  // On stop alors Event de faire son comportement par défaut et gérons la logique par la suite
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //
    try {
      const response = await fetch("http://localhost:3310/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Connexion réussie :", data);
        // Ici, tu peux stocker le token et rediriger l'utilisateur
        navigate("/dashboard");
      } else {
        alert(data.message || "Erreur de connexion");
      }
    } catch (err) {
      console.error("Erreur réseau :", err);
    }
  };

  return (
    <>
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 w-full items-center"
        >
          {/* Email */}
          <label className="input validator">
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <title id="emailIconTitle">Email Icon</title>
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </g>
            </svg>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="mail@site.com"
              required
              value={email} // Valeur lié au state
              onChange={(e) => setEmail(e.target.value)} // Mise a jour du state
            />
          </label>
          {/* Password */}
          <label className="input validator">
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <title id="passwordIconTitle">Password Icon</title>
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" />
                <circle cx="16.5" cy="7.5" r=".5" fill="currentColor" />
              </g>
            </svg>
            <input
              id="password"
              type="password"
              name="password"
              required
              placeholder="Password"
              minLength={5}
              value={password} // Valeur lié au state
              onChange={(e) => setPassword(e.target.value)} // Mise a jour du state
            />
          </label>
          <button
            id="submit-button"
            type="submit"
            className="btn bg-purple-800 btn-wide shadow-md shadow-white"
          >
            Valider
          </button>
          <Link to="/register">Doesn't have an account ?</Link>
        </form>
      </div>
    </>
  );
}
