export function SignalIQLogoIcon() {
  return (
    <svg
      className="w-8 h-8"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer circle */}
      <circle cx="16" cy="16" r="14" fill="url(#logoGradient)" opacity="0.9" />
      
      {/* Inner drone/signal design */}
      <g>
        {/* Center circle (hub) */}
        <circle cx="16" cy="16" r="3" fill="#ffffff" />
        
        {/* Signal waves */}
        <path
          d="M 16 10 Q 12 12 12 16"
          stroke="#ffffff"
          strokeWidth="1"
          fill="none"
          opacity="0.8"
        />
        <path
          d="M 16 10 Q 20 12 20 16"
          stroke="#ffffff"
          strokeWidth="1"
          fill="none"
          opacity="0.8"
        />
        
        {/* Drone arms */}
        <line x1="16" y1="16" x2="10" y2="10" stroke="#ffffff" strokeWidth="1.5" />
        <line x1="16" y1="16" x2="22" y2="10" stroke="#ffffff" strokeWidth="1.5" />
        <line x1="16" y1="16" x2="10" y2="22" stroke="#ffffff" strokeWidth="1.5" />
        <line x1="16" y1="16" x2="22" y2="22" stroke="#ffffff" strokeWidth="1.5" />
        
        {/* Propeller indicators */}
        <circle cx="10" cy="10" r="1.5" fill="#ffffff" />
        <circle cx="22" cy="10" r="1.5" fill="#ffffff" />
        <circle cx="10" cy="22" r="1.5" fill="#ffffff" />
        <circle cx="22" cy="22" r="1.5" fill="#ffffff" />
      </g>
      
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#06b6d4', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
    </svg>
  )
}
