// Pagsmile Brand Colors from Brand Guidelines
export const BRAND_COLORS = {
  // Primary Colors
  primary: '#2bc196',       // Verde Principal Pagsmile
  primaryDark: '#239b7a',   // Verde mais escuro para hover
  primaryLight: '#5cf7cf',  // Verde claro de destaque
  
  // Secondary Colors  
  secondary: '#002443',     // Azul Escuro Pagsmile
  secondaryLight: '#003459', // Azul médio para cards dark mode
  secondaryMid: '#004D73',   // Azul para bordas e elementos secundários
  
  // Neutral Colors
  light: '#f4f4f4',         // Cinza claro
  white: '#ffffff',         // Branco
};

export const getLogoUrlByTheme = (theme) => {
  if (theme === 'light') {
    return "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6979104cafd6b02cfed66766/2cf8bf7b4_Logo-modo-claro.png";
  }
  return "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6979104cafd6b02cfed66766/7fc82cec8_Logo-modo-escuro.png";
};