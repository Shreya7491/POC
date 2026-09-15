import { useState } from "react";
 
function App() {
  const [result, setResult] = useState(null);
 
  const callApi = async () => {
    try {
      // const response = await fetch("http://localhost:8000/hello");
      const response = await fetch("http://<EC2_PUBLIC_IP>:8000/hello");
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