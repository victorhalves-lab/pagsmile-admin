export const getLogoUrlByTheme = (theme) => {
  if (theme === 'light') {
    return "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6979104cafd6b02cfed66766/f402928e3_Logo-modo-claro.png";
  }
  return "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6979104cafd6b02cfed66766/6bc1f8b3d_Logo-modo-escuro.png";
};