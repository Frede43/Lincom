import React from 'react'

// Logos SVG pour les partenaires du Burundi
export const UniversiteBurundiLogo: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 150 80"
    className={`w-full h-full ${className}`}
    role="img"
    aria-label="Université du Burundi"
  >
    <rect width="150" height="80" fill="#3B82F6" rx="4" />
    <circle cx="40" cy="40" r="20" fill="#FFFFFF" opacity="0.9" />
    <text x="75" y="35" fill="#FFFFFF" fontSize="12" fontWeight="600" fontFamily="system-ui">
      UNIVERSITÉ
    </text>
    <text x="75" y="50" fill="#FFFFFF" fontSize="12" fontWeight="600" fontFamily="system-ui">
      DU BURUNDI
    </text>
    <text x="40" y="45" fill="#3B82F6" fontSize="16" fontWeight="700" textAnchor="middle">
      UB
    </text>
  </svg>
)

export const ARCTLogo: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 150 80"
    className={`w-full h-full ${className}`}
    role="img"
    aria-label="ARCT Burundi"
  >
    <rect width="150" height="80" fill="#10B981" rx="4" />
    <polygon points="30,20 50,20 40,35" fill="#FFFFFF" />
    <rect x="25" y="35" width="30" height="3" fill="#FFFFFF" />
    <rect x="25" y="42" width="20" height="3" fill="#FFFFFF" />
    <rect x="25" y="49" width="25" height="3" fill="#FFFFFF" />
    <text x="75" y="35" fill="#FFFFFF" fontSize="14" fontWeight="700" fontFamily="system-ui">
      ARCT
    </text>
    <text x="75" y="50" fill="#FFFFFF" fontSize="10" fontFamily="system-ui">
      BURUNDI
    </text>
  </svg>
)

export const MITLogo: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 150 80"
    className={`w-full h-full ${className}`}
    role="img"
    aria-label="MIT"
  >
    <rect width="150" height="80" fill="#EF4444" rx="4" />
    <rect x="20" y="25" width="8" height="30" fill="#FFFFFF" />
    <rect x="32" y="25" width="8" height="30" fill="#FFFFFF" />
    <rect x="44" y="25" width="8" height="30" fill="#FFFFFF" />
    <rect x="20" y="20" width="32" height="4" fill="#FFFFFF" />
    <text x="75" y="45" fill="#FFFFFF" fontSize="18" fontWeight="700" fontFamily="system-ui">
      MIT
    </text>
  </svg>
)

export const USAIDLogo: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 150 80"
    className={`w-full h-full ${className}`}
    role="img"
    aria-label="USAID"
  >
    <rect width="150" height="80" fill="#F59E0B" rx="4" />
    <circle cx="35" cy="25" r="3" fill="#FFFFFF" />
    <path d="M20 35 L35 25 L50 35 L35 45 Z" fill="#FFFFFF" />
    <rect x="20" y="50" width="30" height="3" fill="#FFFFFF" />
    <text x="75" y="35" fill="#FFFFFF" fontSize="12" fontWeight="700" fontFamily="system-ui">
      USAID
    </text>
    <text x="75" y="50" fill="#FFFFFF" fontSize="8" fontFamily="system-ui">
      FROM THE AMERICAN PEOPLE
    </text>
  </svg>
)

export const BRABankLogo: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 150 80"
    className={`w-full h-full ${className}`}
    role="img"
    aria-label="BRA Bank"
  >
    <rect width="150" height="80" fill="#EF4444" rx="4" />
    <rect x="20" y="25" width="25" height="15" fill="#FFFFFF" rx="2" />
    <rect x="22" y="27" width="21" height="2" fill="#EF4444" />
    <rect x="22" y="31" width="21" height="2" fill="#EF4444" />
    <rect x="22" y="35" width="21" height="2" fill="#EF4444" />
    <text x="60" y="35" fill="#FFFFFF" fontSize="12" fontWeight="700" fontFamily="system-ui">
      BRA
    </text>
    <text x="60" y="50" fill="#FFFFFF" fontSize="10" fontFamily="system-ui">
      BANK
    </text>
  </svg>
)

export const LeoClubLogo: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 150 80"
    className={`w-full h-full ${className}`}
    role="img"
    aria-label="Leo Club"
  >
    <rect width="150" height="80" fill="#8B5CF6" rx="4" />
    <circle cx="35" cy="40" r="15" fill="#FFFFFF" opacity="0.9" />
    <text x="35" y="45" fill="#8B5CF6" fontSize="12" fontWeight="700" textAnchor="middle">
      L
    </text>
    <text x="70" y="35" fill="#FFFFFF" fontSize="12" fontWeight="700" fontFamily="system-ui">
      LEO
    </text>
    <text x="70" y="50" fill="#FFFFFF" fontSize="12" fontWeight="700" fontFamily="system-ui">
      CLUB
    </text>
  </svg>
)

export const BRBLogo: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 150 80"
    className={`w-full h-full ${className}`}
    role="img"
    aria-label="Banque de la République du Burundi"
  >
    <rect width="150" height="80" fill="#059669" rx="4" />
    <circle cx="35" cy="40" r="18" fill="none" stroke="#FFFFFF" strokeWidth="2" />
    <circle cx="35" cy="40" r="10" fill="#FFFFFF" />
    <text x="35" y="45" fill="#059669" fontSize="10" fontWeight="700" textAnchor="middle">
      BRB
    </text>
    <text x="70" y="35" fill="#FFFFFF" fontSize="10" fontWeight="600" fontFamily="system-ui">
      BANQUE DE LA
    </text>
    <text x="70" y="45" fill="#FFFFFF" fontSize="10" fontWeight="600" fontFamily="system-ui">
      RÉPUBLIQUE
    </text>
    <text x="70" y="55" fill="#FFFFFF" fontSize="10" fontWeight="600" fontFamily="system-ui">
      DU BURUNDI
    </text>
  </svg>
)

export const UNDPLogo: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 150 80"
    className={`w-full h-full ${className}`}
    role="img"
    aria-label="UNDP"
  >
    <rect width="150" height="80" fill="#3B82F6" rx="4" />
    <circle cx="35" cy="40" r="15" fill="#FFFFFF" />
    <path d="M25 35 L35 25 L45 35 L35 45 Z" fill="#3B82F6" />
    <text x="70" y="35" fill="#FFFFFF" fontSize="12" fontWeight="700" fontFamily="system-ui">
      UNDP
    </text>
    <text x="70" y="50" fill="#FFFFFF" fontSize="8" fontFamily="system-ui">
      PROGRAMME DES
    </text>
    <text x="70" y="60" fill="#FFFFFF" fontSize="8" fontFamily="system-ui">
      NATIONS UNIES
    </text>
  </svg>
)

// Composant principal pour afficher les logos des partenaires
export const PartnerLogos: React.FC<{ className?: string }> = ({ className = '' }) => {
  const partners = [
    { name: 'Université du Burundi', component: UniversiteBurundiLogo },
    { name: 'ARCT Burundi', component: ARCTLogo },
    { name: 'MIT', component: MITLogo },
    { name: 'USAID', component: USAIDLogo },
    { name: 'BRA Bank', component: BRABankLogo },
    { name: 'Leo Club', component: LeoClubLogo },
    { name: 'BRB', component: BRBLogo },
    { name: 'UNDP', component: UNDPLogo },
  ]

  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 ${className}`}>
      {partners.map((partner, index) => {
        const LogoComponent = partner.component
        return (
          <div
            key={index}
            className="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <LogoComponent className="w-full h-16" />
          </div>
        )
      })}
    </div>
  )
}

export default PartnerLogos
