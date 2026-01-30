import React from 'react';
import { useTranslation } from 'react-i18next';
import { changeLanguage, languages, getCurrentLanguage } from './config';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LanguageSelector({ variant = 'default', className }) {
  const { i18n } = useTranslation();
  const currentLang = getCurrentLanguage();

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode);
  };

  const currentLanguage = languages.find(l => l.code === currentLang) || languages[0];

  if (variant === 'landing') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className={cn(
              "border-slate-700/50 bg-transparent text-slate-300 hover:bg-slate-800/50 hover:border-slate-600 hover:text-white gap-2",
              className
            )}
          >
            <span className="text-lg">{currentLanguage.flag}</span>
            <span className="hidden sm:inline">{currentLanguage.name}</span>
            <Globe className="w-4 h-4 sm:hidden" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="min-w-[160px]">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className="cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{lang.flag}</span>
                <span>{lang.name}</span>
              </div>
              {currentLang === lang.code && (
                <Check className="w-4 h-4 text-[#2bc196]" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Default variant for header/layout
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className={cn("text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800", className)}
        >
          <span className="text-lg">{currentLanguage.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px]">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className="cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{lang.flag}</span>
              <span>{lang.name}</span>
            </div>
            {currentLang === lang.code && (
              <Check className="w-4 h-4 text-[#2bc196]" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}