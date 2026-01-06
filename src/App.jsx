import React, { useMemo, useState } from "react";
import { PLAN } from "./data/plan.js";

function formatDiaLabel(dia) {
  return dia.replace(/^\w/, (m) => m.toUpperCase());
}

function copyToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text);
  }
  // Fallback
  const ta = document.createElement("textarea");
  ta.value = text;
  document.body.appendChild(ta);
  ta.select();
  document.execCommand("copy");
  document.body.removeChild(ta);
  return Promise.resolve();
}

function buildShoppingList(week) {
  // Minimal, Costco-friendly summary list based on week recipes
  // We keep it simple and readable.
  const items = [];
  const add = (name) => items.push(name);

  add(`Pollo crudo (aprox.) — ${week.totalesKgPollo} kg`);
  add("Arroz (seco) — suficiente para 7 días (ej. saco)");
  add("Pasta — 2 paquetes (500 g c/u)");
  add("Tomate picado en lata — 3 latas");
  add("Frijoles en lata — 2 latas");
  add("Lentejas secas — 1 bolsa");
  add("Cebolla — 7–8 medianas");
  add("Papa — 10–12 medianas");
  add("Zanahoria — 10–12 medianas o bolsa baby carrots");
  add("Zucchini — 6–8");
  add("Lechuga/romaine — 2");
  add("Miel, salsa de soya, aceite (oliva/aguacate), sal, ajo en polvo, paprika, comino");

  add("Desayunos: cereal, pan blanco, huevos, yogur (Activia sin lactosa o similar)");
  add("Fruta: bananas, manzanas, fresas, uvas + (opcional) mandarinas / peras");
  return items;
}

export default function App() {
  const [weekId, setWeekId] = useState("semana1");
  const week = PLAN.semanas[weekId];

  const [dayId, setDayId] = useState(week.dias[0].id);

  // If week changes, reset day.
  React.useEffect(() => {
    setDayId(PLAN.semanas[weekId].dias[0].id);
  }, [weekId]);

  const day = useMemo(() => week.dias.find((d) => d.id === dayId), [week, dayId]);

  const shoppingList = useMemo(() => buildShoppingList(week), [week]);

  const shareText = useMemo(() => {
    const d = day;
    return [
      `📅 ${week.titulo} — ${formatDiaLabel(d.nombreDia)}`,
      "",
      `DESAYUNO: ${d.desayuno.titulo}`,
      `• Fruta niños: ${d.desayuno.frutaNinos}`,
      `• Nota: ${d.desayuno.nota}`,
      "",
      `COMIDA: ${d.comida.titulo}`,
      `• Pollo: ${d.comida.polloKg} kg`,
      `• Acompañamiento: ${d.comida.acompanamiento}`,
      "",
      "INGREDIENTES:",
      ...d.comida.ingredientes.map((x) => `- ${x}`),
      "",
      "PREPARACIÓN:",
      ...d.comida.pasos.map((x, i) => `${i + 1}. ${x}`),
      "",
      `LUNCH (niña sin recalentar): ${d.lunch.nina}`,
      `LUNCH (adulto con micro): ${d.lunch.adulto}`,
      "",
      `CENA: ${d.cena.titulo}`,
      ...d.cena.opciones.map((x) => `- ${x}`),
      "",
      `Notas: ${d.notas}`
    ].join("\n");
  }, [week, day]);

  const onCopy = async () => {
    await copyToClipboard(shareText);
    alert("Copiado. Pégalo en WhatsApp o donde quieras.");
  };

  const onCopyShopping = async () => {
    const text = ["🛒 Lista Costco-friendly (" + week.titulo + ")", "", ...shoppingList.map((x) => `- ${x}`)].join("\n");
    await copyToClipboard(text);
    alert("Lista de compras copiada.");
  };

  return (
    <div className="container">
      <div className="header">
        <div className="title">
          <h1>Recetas Familia — 2 semanas</h1>
          <p>
            Menú práctico para 2 adultos + 3 niños (7, 3, 1).<br/>
            Lunch de escuela pensado para comerse frío y lunch de trabajo pensado para micro. Sin puerco. Costco-friendly.
          </p>
        </div>
        <div className="chips">
  <div className="chip"><span className="dot"></span> 2 semanas listas</div>
  <div className="chip"><span className="dot green"></span> Pensado para celular</div>
</div>
</div>
      <div className="panel">
        <div className="toolbar">
          <div className="tabs">
            <button
              className={"tab " + (weekId === "semana1" ? "active" : "")}
              onClick={() => setWeekId("semana1")}
            >
              Semana 1
            </button>
            <button
              className={"tab " + (weekId === "semana2" ? "active" : "")}
              onClick={() => setWeekId("semana2")}
            >
              Semana 2
            </button>
          </div>

          <div className="controls">
            <select className="select" value={dayId} onChange={(e) => setDayId(e.target.value)}>
              {week.dias.map((d) => (
                <option key={d.id} value={d.id}>
                  {formatDiaLabel(d.nombreDia)} — {d.comida.titulo}
                </option>
              ))}
            </select>
            <button className="btn" onClick={onCopy}>Copiar día</button>
            <button className="btn" onClick={onCopyShopping}>Copiar compras</button>
          </div>
        </div>

        <div className="grid">
          <div className="card">
            <h2>{week.titulo} — {formatDiaLabel(day.nombreDia)}</h2>

            <div className="meta">
              <span className="pill">Pollo: {day.comida.polloKg} kg</span>
              <span className="pill">Tiempo: {day.comida.tiempo}</span>
              <span className="pill">Estilo: {day.comida.metodo}</span>
            </div>

            <h3>Desayuno</h3>
            <ul className="kv">
              <li><strong>Hoy:</strong> {day.desayuno.titulo}</li>
              <li><strong>Fruta niños:</strong> {day.desayuno.frutaNinos}</li>
              <li><strong>Nota:</strong> {day.desayuno.nota}</li>
            </ul>

            <h3>Comida (receta)</h3>
            <ul className="kv">
              <li><strong>Acompañamiento:</strong> {day.comida.acompanamiento}</li>
            </ul>

            <h3>Ingredientes</h3>
            <ul className="bullets">
              {day.comida.ingredientes.map((i, idx) => <li key={idx}>{i}</li>)}
            </ul>

            <h3>Preparación</h3>
            <ol className="steps">
              {day.comida.pasos.map((p, idx) => <li key={idx}>{p}</li>)}
            </ol>

            <div className="note">
              <b>Lunch</b><br/>
              • Escuela: {day.lunch.nina}<br/>
              • Trabajo: {day.lunch.adulto}
            </div>

            <h3>Cena (ligera)</h3>
            <ul className="bullets">
              {day.cena.opciones.map((o, idx) => <li key={idx}>{o}</li>)}
            </ul>

            <p className="footer">{day.notas}</p>
          </div>

          <div className="card">
            <h2>Semana (vista rápida)</h2>
            <p className="small">Selecciona un día arriba para ver detalles. Aquí está el resumen de la semana.</p>

            <ul className="bullets">
              {week.dias.map((d) => (
                <li key={d.id}>
                  <b>{formatDiaLabel(d.nombreDia)}:</b> {d.comida.titulo} <span className="small">({d.comida.polloKg} kg)</span>
                </li>
              ))}
            </ul>

            <h3>Desayunos (rotación simple)</h3>
            <ul className="bullets">
              {week.rotacionDesayuno.map((x, idx) => <li key={idx}>{x}</li>)}
            </ul>

            <h3>Lunch (guía rápida)</h3>
            <ul className="bullets">
              <li><b>Escuela (frío):</b> wraps, sandwiches, pasta fría, bowl de arroz frío sin mucha salsa.</li>
              <li><b>Trabajo (micro):</b> bowl completo (arroz + pollo + frijoles + verdura), guisos, pasta con salsa.</li>
            </ul>

            <h3>Lista de compras (resumen)</h3>
            <ul className="bullets">
              {shoppingList.map((x, idx) => <li key={idx}>{x}</li>)}
            </ul>

            <p className="footer">
              Tip rápido: cuando sirvas la comida, aparta la porción de lunch de la niña en formato seco (sin salsa líquida).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
