import { useState } from "react";
 
function App() {
  const [result, setResult] = useState(null);
 
  const callApi = async () => {
    try {
      // Relative path: proxied to the backend by Vite (dev) or nginx (prod).
      const response = await fetch("/api/hello");
      const data = await response.json();
 
      setResult(data);
    } catch (error) {
      console.error(error);
      setResult({ message: "API call failed" });
    }
  };
 
  return (
    <div>
      <h1>Hello App</h1>
 
      <button onClick={callApi}>
        Call FastAPI
      </button>
 
      {result && (
        <div>
          <h2>{result.message}</h2>
          <p>Called at: {result.called_at}</p>
        </div>
      )}
    </div>
  );
}
 
export default App;