function PiggyBank() {
  return (
    <div className="money-boat" aria-hidden="true" style={{ position: "fixed", right: "20px", bottom: "16px", zIndex: 5, pointerEvents: "none" }}>
      <svg viewBox="0 0 120 120" fill="none" style={{ width: "96px", height: "96px", animation: "bob 4s ease-in-out infinite" }}>
        <style>{`
          @keyframes bob {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-4px) rotate(-2deg); }
          }
        `}</style>
        
        {/* Coin dropping */}
        <circle cx="60" cy="20" r="10" fill="#fbc531" stroke="#e1b12c" strokeWidth="2" />
        <text x="60" y="24" fontSize="12" fill="#e1b12c" textAnchor="middle" fontWeight="bold" fontFamily="Fredoka, sans-serif">$</text>
        
        {/* Piggy Body */}
        <ellipse cx="60" cy="70" rx="40" ry="32" fill="#ffb8b8" stroke="#ff9f9f" strokeWidth="3" />
        
        {/* Snout */}
        <ellipse cx="90" cy="65" rx="12" ry="16" fill="#ffcccc" stroke="#ff9f9f" strokeWidth="3" />
        <circle cx="94" cy="60" r="2" fill="#ff9f9f" />
        <circle cx="94" cy="70" r="2" fill="#ff9f9f" />
        
        {/* Ears */}
        <path d="M40 45 L35 25 L55 38 Z" fill="#ffb8b8" stroke="#ff9f9f" strokeWidth="3" strokeLinejoin="round" />
        <path d="M75 42 L85 22 L90 38 Z" fill="#ffb8b8" stroke="#ff9f9f" strokeWidth="3" strokeLinejoin="round" />
        
        {/* Eye */}
        <circle cx="70" cy="55" r="4" fill="#3a2a1c" />
        
        {/* Legs */}
        <path d="M35 95 L35 110 L45 110 L45 100" fill="#ffb8b8" stroke="#ff9f9f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M75 95 L75 110 L85 110 L85 100" fill="#ffb8b8" stroke="#ff9f9f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* Coin Slot */}
        <path d="M50 40 L70 40" stroke="#ff9f9f" strokeWidth="4" strokeLinecap="round" />
        
        {/* Tail */}
        <path d="M20 70 Q 10 65 10 75 T 18 80" stroke="#ff9f9f" strokeWidth="3" strokeLinecap="round" fill="none" />
      </svg>
    </div>
  );
}

export default PiggyBank;
