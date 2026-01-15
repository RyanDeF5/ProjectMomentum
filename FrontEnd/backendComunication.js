// backendCommunication.js

export async function fetchStockData(symbol) {
  const res = await fetch("http://localhost:3000/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ symbol })
  });

  if (!res.ok) throw new Error(`Network response was not ok: ${res.status}`);
  const data = await res.json();
  return data; // or: return summarize(data) if you want the processed result
}


