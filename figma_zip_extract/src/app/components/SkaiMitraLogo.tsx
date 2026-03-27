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
      {/* Logo Image from Public Folder */}
      <div className={`${sizeMap[size].container} relative flex items-center justify-center flex-shrink-0`}>
        <img 
          src="/SkaiMitra_LogoV2.0.jpg" 
          alt="SkaiMitra Logo"
          className={`w-full h-full object-cover rounded-lg`}
        />
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
