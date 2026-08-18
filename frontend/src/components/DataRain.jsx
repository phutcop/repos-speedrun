import React, { useEffect, useState } from "react";

const DATA_TOKENS = ["finshyt", "independent", "intelligence", "ledger", "truth", "+", "-", "•", "abstract"];

function DataRain() {
  const [raindrops, setRaindrops] = useState([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Generate 30 falling data tokens for a sleek, minimal effect
    const drops = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      text: DATA_TOKENS[Math.floor(Math.random() * DATA_TOKENS.length)],
      left: Math.random() * 100, // percentage from left
      animationDuration: 4 + Math.random() * 6, // 4s to 10s fall speed
      animationDelay: Math.random() * 3, // 0s to 3s delay
      scale: 0.5 + Math.random() * 0.4, // size variation
      opacity: 0.02 + Math.random() * 0.05, // highly translucent, almost invisible watermark
    }));
    setRaindrops(drops);
  }, []);

  return (
    <div className="data-rain-container" aria-hidden="true">
      <style>{`
        .data-rain-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }
        .data-drop {
          position: absolute;
          top: -100px;
          font-family: var(--font-mono);
          font-weight: 500;
          color: var(--ink);
          white-space: nowrap;
          animation-name: fall-data;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          animation-fill-mode: forwards;
        }
        @keyframes fall-data {
          0% {
            transform: translateY(-100px);
            opacity: 0;
          }
          10% {
            opacity: var(--drop-opacity);
          }
          90% {
            opacity: var(--drop-opacity);
          }
          100% {
            transform: translateY(110vh);
            opacity: 0;
          }
        }
      `}</style>
      {raindrops.map((drop) => (
        <div
          key={drop.id}
          className="data-drop"
          style={{
            left: `${drop.left}%`,
            animationDuration: `${drop.animationDuration}s`,
            animationDelay: `${drop.animationDelay}s`,
            fontSize: `${drop.scale * 1.5}rem`,
            "--drop-opacity": drop.opacity,
          }}
        >
          {drop.text}
        </div>
      ))}
    </div>
  );
}

export default DataRain;
