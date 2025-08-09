import React, { useState } from "react";

interface Purchase {
  id: number;
  date: string;
  amount: string;
  description: string;
}

interface Client {
  id: number;
  document_type: { id: number; code: string; name: string };
  document_number: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  purchases: Purchase[];
}

const API_BASE = "http://localhost:8000/api"; // <-- pon aquí tu base real

function App() {
  const [docNumber, setDocNumber] = useState("");
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(false);

  const searchClient = async () => {
    if (!docNumber) {
      alert("Ingrese un número de documento");
      return;
    }
    setLoading(true);
    try {
      const url = `${API_BASE}/clients/search/?doc_number=${encodeURIComponent(
        docNumber
      )}`;

      const res = await fetch(url, { headers: { Accept: "application/json" } });

      if (!res.ok) {
        const text = await res.text();
        console.error("Error HTTP:", res.status, text);
        setClient(null);
        alert(
          res.status === 404
            ? "Cliente no encontrado"
            : "Error consultando la API"
        );
        return;
      }

      const data: Client = await res.json();
      setClient(data);
    } catch (error) {
      console.error(error);
      alert("Error al buscar cliente");
    } finally {
      setLoading(false);
    }
  };

  const exportClient = () => {
    if (!client) return;
    // endpoint con slash final para evitar redirecciones
    window.open(`${API_BASE}/clients/${client.id}/export/`, "_blank");
  };

  const downloadFidelizados = () => {
    window.open(`${API_BASE}/reports/fidelizados/`, "_blank");
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Consulta de Clientes</h1>

      <div>
        <input
          type="text"
          placeholder="Número de documento"
          value={docNumber}
          onChange={(e) => setDocNumber(e.target.value)}
        />
        <button onClick={searchClient} disabled={loading}>
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </div>

      {client && (
        <div style={{ marginTop: "1rem" }}>
          <h2>
            {client.first_name} {client.last_name}
          </h2>
          <p>
            Documento: {client.document_type.name} {client.document_number}
          </p>
          <p>Email: {client.email}</p>
          <p>Teléfono: {client.phone}</p>

          <h3>Compras</h3>
          <ul>
            {client.purchases.map((p) => (
              <li key={p.id}>
                {p.date} - {p.amount} - {p.description}
              </li>
            ))}
          </ul>

          <h3>Exportar datos</h3>
          <button onClick={exportClient}>CSV</button>
        </div>
      )}

      <hr style={{ margin: "2rem 0" }} />

      <button onClick={downloadFidelizados}>
        Descargar reporte de fidelizados
      </button>
    </div>
  );
}

export default App;
