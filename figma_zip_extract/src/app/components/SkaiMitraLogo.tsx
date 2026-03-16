interface SkaiMitraLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  subtitle?: string;
  variant?: 'default' | 'white';
}

export function SkaiMitraLogo({ 
  className = '', 
  size = 'md',
  subtitle,
  variant = 'default'
}: SkaiMitraLogoProps) {
  const sizeMap = {
    sm: { 
      container: 'w-8 h-8',
      text: 'text-lg',
      subtitle: 'text-xs'
    },
    md: { 
      container: 'w-10 h-10 sm:w-12 sm:h-12',
      text: 'text-xl sm:text-2xl',
      subtitle: 'text-xs sm:text-sm'
    },
    lg: { 
      container: 'w-14 h-14 sm:w-16 sm:h-16',
      text: 'text-2xl sm:text-3xl',
      subtitle: 'text-sm sm:text-base'
    }
  };

  const textColor = variant === 'white' ? 'text-white' : 'text-gray-900';
  const subtitleColor = variant === 'white' ? 'text-white/80' : 'text-gray-600';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Icon - Hexagonal Brain/Network Design */}
      <div className={`${sizeMap[size].container} relative flex items-center justify-center`}>
        <svg 
          viewBox="0 0 48 48" 
          fill="none" 
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Hexagon with Gradient */}
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e40af" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#60a5fa" />
            </linearGradient>
          </defs>
          
          {/* Main Hexagon Background */}
          <path 
            d="M24 2L42 13V35L24 46L6 35V13L24 2Z" 
            fill="url(#logoGradient)"
          />
          
          {/* Inner Network Pattern - Representing AI/Learning */}
          {/* Center Node */}
          <circle cx="24" cy="24" r="3" fill="white" opacity="0.95" />
          
          {/* Top Node */}
          <circle cx="24" cy="12" r="2.5" fill="white" opacity="0.85" />
          <line x1="24" y1="15" x2="24" y2="21" stroke="white" strokeWidth="1.5" opacity="0.7" />
          
          {/* Top Right Node */}
          <circle cx="32" cy="16" r="2.5" fill="white" opacity="0.85" />
          <line x1="30" y1="17.5" x2="26" y2="22.5" stroke="white" strokeWidth="1.5" opacity="0.7" />
          
          {/* Bottom Right Node */}
          <circle cx="32" cy="32" r="2.5" fill="white" opacity="0.85" />
          <line x1="30" y1="30.5" x2="26" y2="25.5" stroke="white" strokeWidth="1.5" opacity="0.7" />
          
          {/* Bottom Node */}
          <circle cx="24" cy="36" r="2.5" fill="white" opacity="0.85" />
          <line x1="24" y1="33" x2="24" y2="27" stroke="white" strokeWidth="1.5" opacity="0.7" />
          
          {/* Bottom Left Node */}
          <circle cx="16" cy="32" r="2.5" fill="white" opacity="0.85" />
          <line x1="18" y1="30.5" x2="22" y2="25.5" stroke="white" strokeWidth="1.5" opacity="0.7" />
          
          {/* Top Left Node */}
          <circle cx="16" cy="16" r="2.5" fill="white" opacity="0.85" />
          <line x1="18" y1="17.5" x2="22" y2="22.5" stroke="white" strokeWidth="1.5" opacity="0.7" />
        </svg>
      </div>
      
      {/* SkaiMitra Text with Styling */}
      <div>
        <h1 className={`${sizeMap[size].text} font-bold ${textColor} tracking-tight`}>
          <span className="font-bold">Skai</span>
          <span className="font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Mitra</span>
        </h1>
        {subtitle && (
          <p className={`${sizeMap[size].subtitle} ${subtitleColor}`}>{subtitle}</p>
        )}
      </div>
    </div>
  );
}
