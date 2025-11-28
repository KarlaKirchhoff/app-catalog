import { useRef } from "react";
import * as html2pdf from "html2pdf.js";
import './App.css'


type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
};

const SAMPLE_PRODUCTS: Product[] = Array.from({ length: 22 }).map((_, i) => ({
  id: String(i + 1),
  name: `Produto ${(i + 1).toString().padStart(2, "0")}`,
  description: "Descrição curta do produto — material, uso e destaque.",
  price: Math.round((Math.random() * 200 + 20) * 100) / 100,
  image: `https://picsum.photos/seed/catalog${i + 1}/600/400`,
}));

export default function App() {
  const catalogRef = useRef<HTMLDivElement | null>(null);

  const exportToPdf = async () => {
    const element = catalogRef.current;
    if (!element) return;

    // Importação dinâmica para funcionar no Vite + TS
    const html2pdf = (await import("html2pdf.js")).default;

    // 1️⃣ Extrair CSS de impressão (opcional)
    const styleEl = document.createElement("style");
    // ... seu CSS de @media print ...
    element.appendChild(styleEl);

    // 2️⃣ Gerar PDF
    await (html2pdf as any)() // <== precisa do "as any" para TS
      .set({
        filename: "catalogo.pdf",
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(element)
      .save();

    // 3️⃣ Remover style temporário
    element.removeChild(styleEl);
  };
  return (
    <div className="page">
      <div className="container">
        <header className="header">
          <h1 className="title">Catálogo Rápido</h1>

          <div className="header-buttons">
            <button onClick={() => exportToPdf()} className="btn-primary">
              Exportar para PDF
            </button>
          </div>
        </header>

        {/* área que será capturada para PDF */}
        <div
          id="catalog-root"
          ref={catalogRef}
          className="catalog"
        >
          <section className="intro">
            <h2 className="intro-title">Coleção em destaque</h2>
            <p className="intro-desc">
              Uma seleção de produtos para mostrar como o catálogo funciona.
            </p>
          </section>

          <section className="products">
            {SAMPLE_PRODUCTS.map((p) => (
              <article key={p.id} className="product-card">
                <img src={p.image} alt={p.name} className="product-img" />

                <div className="product-body">
                  <h3 className="product-name">{p.name}</h3>
                  <p className="product-desc">{p.description}</p>

                  <div className="product-footer">
                    <strong className="price">R$ {p.price.toFixed(2)}</strong>
                    <button className="btn-secondary">Ver</button>
                  </div>
                </div>
              </article>
            ))}
          </section>

          <footer className="footer">
            Gerado em: {new Date().toLocaleString()}
          </footer>
        </div>
      </div>
    </div>
  );

}
