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
      const res = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/clients/search/?doc_number=${docNumber}`
      );
      if (res.ok) {
        const data = await res.json();
        setClient(data);
      } else {
        setClient(null);
        alert("Cliente no encontrado");
      }
    } catch (error) {
      console.error(error);
      alert("Error al buscar cliente");
    } finally {
      setLoading(false);
    }
  };

  const exportClient = () => {
    if (!client) return;
    window.open(
      `${import.meta.env.VITE_API_URL}/clients/${client.id}/export/`,
      "_blank"
    );
  };

  const downloadFidelizados = () => {
    window.open(
      `${import.meta.env.VITE_API_URL}/reports/fidelizados/`,
      "_blank"
    );
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
          <button onClick={() => exportClient()}>CSV</button>
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
