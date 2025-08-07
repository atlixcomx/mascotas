// Iconos personalizados basados en la iconografía de Atlixco

export const DogIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Cabeza del perro */}
    <circle cx="12" cy="12" r="6" fill={color} opacity="0.1"/>
    <path d="M7 12C7 8.5 9.5 6 12 6C14.5 6 17 8.5 17 12C17 13.5 16.5 14.8 15.5 15.8" 
          stroke={color} strokeWidth="2" strokeLinecap="round"/>
    
    {/* Orejas caídas características */}
    <path d="M8 9C6 8 5 9 5 11C5 12 6 13 7 12.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 9C18 8 19 9 19 11C19 12 18 13 17 12.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    
    {/* Hocico */}
    <ellipse cx="12" cy="15" rx="2.5" ry="1.5" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    
    {/* Nariz */}
    <ellipse cx="12" cy="14" rx="0.8" ry="0.5" fill={color}/>
    
    {/* Ojos expresivos */}
    <circle cx="10" cy="11" r="1.2" fill={color}/>
    <circle cx="14" cy="11" r="1.2" fill={color}/>
    <circle cx="10" cy="10.5" r="0.4" fill="white"/>
    <circle cx="14" cy="10.5" r="0.4" fill="white"/>
    
    {/* Boca sonriente */}
    <path d="M10 16C10.5 17 11.5 17.5 12 17.5C12.5 17.5 13.5 17 14 16" 
          stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    
    {/* Lengua */}
    <path d="M12 17.5C12 18.5 12 19 12 19.5" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const HeartIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21C12 21 3 14 3 8.5C3 5.5 5.5 3 8.5 3C10.5 3 11.5 4 12 5C12.5 4 13.5 3 15.5 3C18.5 3 21 5.5 21 8.5C21 14 12 21 12 21Z" 
          stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);

export const HomeIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15" 
          stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const PhoneIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 4H9L11 9L8.5 10.5C9.57096 12.6715 11.3285 14.429 13.5 15.5L15 13L20 15V19C20 20.1046 19.1046 21 18 21C9.71573 21 3 14.2843 3 6C3 4.89543 3.89543 4 5 4Z" 
          stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const MailIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 7C3 5.89543 3.89543 5 5 5H19C20.1046 5 21 5.89543 21 7V17C21 18.1046 20.1046 19 19 19H5C3.89543 19 3 18.1046 3 17V7Z" 
          stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 7L12 13L21 7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const LocationIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21C12 21 5 15 5 10C5 6.13401 8.13401 3 12 3C15.866 3 19 6.13401 19 10C19 15 12 21 12 21Z" 
          stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="10" r="3" stroke={color} strokeWidth="2"/>
  </svg>
);

export const ClockIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2"/>
    <path d="M12 6V12L16 14" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const SearchIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="11" r="8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 21L16.65 16.65" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const FormIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" 
          stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 2V8H20" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="8" y1="12" x2="16" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <line x1="8" y1="16" x2="16" y2="16" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <line x1="8" y1="20" x2="12" y2="20" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const HandshakeIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.42 4.58C21.19 3.81 21.19 2.55 20.42 1.78L19.22 0.58C18.45 -0.19 17.19 -0.19 16.42 0.58L13 4" 
          stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11 6L13 4L7 4C5.89543 4 5 4.89543 5 6V8C5 9.10457 5.89543 10 7 10H9L11 8V6Z" 
          stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13 16L11 18V20C11 21.1046 11.8954 22 13 22H15C16.1046 22 17 21.1046 17 20V18L15 16H13Z" 
          stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11 8L13 10L15 8L17 10L19 8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const HospitalIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 21H21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 21V7L12 3L19 7V21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 21V14H15V21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 9H14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 7V11" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const VaccineIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 3L21 7L7 21L3 17L17 3Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19 5L14 10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11 13L8 16" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 19L3 21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ScissorsIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="6" cy="6" r="3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="6" cy="18" r="3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20 4L8.12 15.88" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="14.47" y1="14.48" x2="20" y2="20" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8.12 8.12L12 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const StethoscopeIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 3V10C4 14.4183 7.58172 18 12 18C12.3387 18 12.6724 17.9776 13 17.9341M13 17.9341C13.6421 18.5778 14.5255 19 15.5 19C17.433 19 19 17.433 19 15.5C19 13.567 17.433 12 15.5 12C13.567 12 12 13.567 12 15.5C12 16.28 12.28 16.99 12.7341 17.5341C12.8228 17.6616 12.9223 17.7806 13.0311 17.8896" 
          stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20 3V10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="15.5" cy="15.5" r="1.5" stroke={color} strokeWidth="2"/>
  </svg>
);

export const MountainIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 18L12 10L16 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 20L7 12L11 20" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13 20L17 12L21 20" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const BirdIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Cuerpo del colibrí */}
    <ellipse cx="12" cy="12" rx="3" ry="6" fill={color} opacity="0.1"/>
    <path d="M12 6C12.8 6 13.5 6.5 14 7.2C14.5 8 14.5 9 14 10L12 18L10 10C9.5 9 9.5 8 10 7.2C10.5 6.5 11.2 6 12 6Z" 
          stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    
    {/* Pico largo característico */}
    <path d="M12 6L12 3" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 3L11.5 2.5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    
    {/* Alas en movimiento rápido */}
    <path d="M10 8C7 6 5 7 4 9C5 8 7 8.5 10 9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 8C17 6 19 7 20 9C19 8 17 8.5 14 9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    
    {/* Cola en forma de V */}
    <path d="M12 18L10 20" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 18L14 20" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    
    {/* Ojo */}
    <circle cx="12.5" cy="8" r="0.8" fill={color}/>
    
    {/* Líneas de movimiento para mostrar velocidad */}
    <path d="M6 10L4 11" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
    <path d="M18 10L20 11" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
  </svg>
);

export const FlowerIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2"/>
    <path d="M12 9C12 7.5 10.5 6 9 6C7.5 6 6 7.5 6 9C6 10.5 7.5 12 9 12" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M15 12C16.5 12 18 10.5 18 9C18 7.5 16.5 6 15 6C13.5 6 12 7.5 12 9" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 15C12 16.5 13.5 18 15 18C16.5 18 18 16.5 18 15C18 13.5 16.5 12 15 12" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M9 12C7.5 12 6 13.5 6 15C6 16.5 7.5 18 9 18C10.5 18 12 16.5 12 15" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 12V21" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const WaveIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 12C3 12 5 8 8 8C11 8 13 12 16 12C19 12 21 8 21 8" 
          stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 18C3 18 5 14 8 14C11 14 13 18 16 18C19 18 21 14 21 14" 
          stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const DoctorIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="7" r="4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5.5 21V19C5.5 16.7909 7.29086 15 9.5 15H14.5C16.7091 15 18.5 16.7909 18.5 19V21" 
          stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 7H14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 5V9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ClipboardIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 4H18C19.1046 4 20 4.89543 20 6V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V6C4 4.89543 4.89543 4 6 4H8" 
          stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="8" y="2" width="8" height="4" rx="1" stroke={color} strokeWidth="2"/>
    <line x1="8" y1="12" x2="16" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <line x1="8" y1="16" x2="14" y2="16" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const CheckCircleIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2"/>
    <path d="M9 12L11 14L15 10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ArrowRightIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 12H19" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 5L19 12L12 19" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const MenuIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="3" y1="6" x2="21" y2="6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <line x1="3" y1="12" x2="21" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <line x1="3" y1="18" x2="21" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const CloseIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 6L18 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const FacebookIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" 
          stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const InstagramIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="20" rx="5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 11.37C16.1234 12.2022 15.9813 13.0522 15.5938 13.799C15.2063 14.5458 14.5932 15.1514 13.8416 15.5297C13.0901 15.9079 12.2385 16.0396 11.4078 15.9059C10.5771 15.7723 9.80977 15.3801 9.21485 14.7852C8.61993 14.1902 8.22774 13.4229 8.09408 12.5922C7.96042 11.7615 8.09208 10.9099 8.47034 10.1584C8.8486 9.40685 9.4542 8.79374 10.201 8.40624C10.9478 8.01874 11.7978 7.87658 12.63 8C13.4789 8.12588 14.2649 8.52146 14.8717 9.1283C15.4785 9.73515 15.8741 10.5211 16 11.37Z" 
          stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="17.5" cy="6.5" r="1.5" fill={color}/>
  </svg>
);

export const WhatsAppIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 11.5C21 16.75 16.75 21 11.5 21C9.99 21 8.56 20.65 7.29 20.05L3 22L4.95 17.71C4.35 16.44 4 15.01 4 13.5C4 8.25 8.25 4 13.5 4C15.22 4 16.82 4.53 18.14 5.43" 
          stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 10.5C9 10.5 10 12 12 12C14 12 15 10.5 15 10.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="9" cy="9" r="1" fill={color}/>
    <circle cx="15" cy="9" r="1" fill={color}/>
  </svg>
);

// Logo del Centro Municipal de Adopción y Bienestar Animal (basado en el PDF)
export const CentroAdopcionLogo = ({ size = 52 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(50, 50)">
      {/* Corazón con perro y persona */}
      <path d="M0 -20C-11 -20 -20 -11 -20 0C-20 5 -18 10 -15 15L0 30L15 15C18 10 20 5 20 0C20 -11 11 -20 0 -20Z" 
            fill="none" stroke="#b5a47e" strokeWidth="3"/>
      
      {/* Silueta de perro simplificada */}
      <g transform="translate(-8, -5)">
        <circle cx="0" cy="0" r="4" fill="none" stroke="#b5a47e" strokeWidth="2"/>
        <path d="M0 4C0 4 -3 8 -3 10C-3 12 -1 12 -1 12H1C1 12 3 12 3 10C3 8 0 4 0 4Z" 
              fill="none" stroke="#b5a47e" strokeWidth="2"/>
        <circle cx="-2" cy="-1" r="0.8" fill="#b5a47e"/>
        <circle cx="2" cy="-1" r="0.8" fill="#b5a47e"/>
      </g>
      
      {/* Silueta de persona simplificada */}
      <g transform="translate(8, -5)">
        <circle cx="0" cy="-2" r="3" fill="none" stroke="#b5a47e" strokeWidth="2"/>
        <path d="M-3 2C-3 2 -3 8 -3 10H3C3 8 3 2 3 2" 
              fill="none" stroke="#b5a47e" strokeWidth="2"/>
      </g>
    </g>
  </svg>
);