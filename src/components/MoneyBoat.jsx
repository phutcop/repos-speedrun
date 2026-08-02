/* =====================================================
   MONEY BOAT
   Signature decorative motif: a paper boat folded from
   a dollar note, sitting on a couple of quiet water
   lines. Fixed bottom-right, gently bobbing.
   Purely decorative — aria-hidden, no pointer events.
   ===================================================== */
function MoneyBoat() {
  return (
    <div className="money-boat" aria-hidden="true">
      <svg viewBox="0 0 120 84" fill="none">
        {/* water lines */}
        <path
          className="boat-water"
          d="M4 70 Q 16 66 28 70 T 52 70 T 76 70 T 100 70"
          stroke="#212842"
          strokeOpacity="0.18"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          className="boat-water boat-water-2"
          d="M12 77 Q 24 74 36 77 T 60 77 T 84 77 T 108 77"
          stroke="#212842"
          strokeOpacity="0.12"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* boat group bobs as one unit */}
        <g className="boat-hull">
          {/* hull — folded note, banknote green */}
          <path
            d="M14 56 L106 56 L88 70 L32 70 Z"
            fill="#2f8f5b"
            stroke="#1c5c3a"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          {/* hull fold crease */}
          <path d="M60 56 L60 70" stroke="#1c5c3a" strokeWidth="1" strokeOpacity="0.6" />

          {/* left dollar emblem on hull */}
          <circle cx="38" cy="63" r="4.4" fill="none" stroke="#eafff2" strokeWidth="1.1" />
          <text x="38" y="65.6" fontSize="6" textAnchor="middle" fill="#eafff2" fontFamily="Georgia, serif">
            $
          </text>

          {/* right dollar emblem on hull */}
          <circle cx="82" cy="63" r="4.4" fill="none" stroke="#eafff2" strokeWidth="1.1" />
          <text x="82" y="65.6" fontSize="6" textAnchor="middle" fill="#eafff2" fontFamily="Georgia, serif">
            $
          </text>

          {/* folded sail — triangular note fold, slightly lighter green + crease lines */}
          <path
            d="M60 56 L60 14 L92 56 Z"
            fill="#3fa873"
            stroke="#1c5c3a"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <path d="M60 30 L79 56" stroke="#1c5c3a" strokeWidth="0.9" strokeOpacity="0.5" />
          <path d="M60 14 L60 56" stroke="#1c5c3a" strokeWidth="0.9" strokeOpacity="0.5" />

          {/* small back fold / second sail face, deeper shade for dimensionality */}
          <path
            d="M60 56 L60 24 L40 56 Z"
            fill="#276e46"
            stroke="#1c5c3a"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </div>
  );
}

export default MoneyBoat;
