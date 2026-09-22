import { useState } from "react";
import "./App.css";

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callApi = async () => {
    setLoading(true);
    setError(null);
    try {
      // Relative path: proxied to the backend by Vite (dev) or nginx (prod).
      const response = await fetch("/api/hello");
      if (!response.ok) throw new Error(`Request failed (${response.status})`);
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Couldn't reach the API. Please try again.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <main className="card">
        <span className="badge">FastAPI + React</span>
        <h1>Hello App</h1>
        <p className="subtitle">
          Click the button to say hi to the backend and see it respond.
        </p>

        <button className="cta" onClick={callApi} disabled={loading}>
          {loading ? "Calling API…" : "Call the API"}
        </button>

        {error && <p className="error">{error}</p>}

        {result && (
          <div className="result">
            <p className="greeting">{result.message}</p>
            <p className="timestamp">
              Called at: {new Date(result.called_at).toLocaleString()}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;