import React from 'react';
import { Link } from '@tanstack/react-router';
import { Search, Menu, Plus } from 'lucide-react';
import { Input } from '#/components/ui/input';
import { Button } from '#/components/ui/button';
import { cn } from '#/lib/utils';
import { ThemeSwitch } from '#/components/theme-switch';
import { ProfileDropdown } from '#/components/profile-dropdown';
import { useLanguage } from '#/context/language-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "#/components/ui/dropdown-menu";

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  fixed?: boolean;
}

export const Header = ({ className, fixed, children, ...props }: HeaderProps) => {
  const { t, language, setLanguage } = useLanguage();

  return (
    <header
      className={cn(
        'bg-[#121212] text-white flex h-20 w-full items-center',
        fixed && 'fixed top-0 z-50',
        className,
      )}
      {...props}
    >
      <div className="w-full max-w-7xl mx-auto flex items-center gap-5 px-4 sm:px-6">

        {/* 1. LOGO ALANI */}
        <Link to="/" className="flex shrink-0 items-center">
          <span className="text-white font-extrabold text-3xl tracking-tighter">
            FilmLog
          </span>
        </Link>

        {/* 2. HAMBURGER MENÜ */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="hover:bg-white/10 text-white rounded-sm h-11 w-11 data-[state=open]:bg-white/10 shrink-0">
              <Menu className="h-6 w-6" strokeWidth={3} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56 bg-[#2A2A2A] text-white border-[#333333] text-base">
            <DropdownMenuItem asChild className="hover:bg-[#333333] cursor-pointer py-2 text-base">
              <Link to="/">{t('movies')}</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="hover:bg-[#333333] cursor-pointer py-2 text-base">
              <Link to="/">{t('shows')}</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="hover:bg-[#333333] cursor-pointer py-2 text-base">
              <Link to="/">{t('watchlist')}</Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-[#444] my-2" />

            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-gray-400 text-xs tracking-widest uppercase mb-1">Kategoriler</DropdownMenuLabel>
              <DropdownMenuItem asChild className="hover:bg-[#333333] cursor-pointer py-2 text-sm text-gray-200">
                <Link to="/">{t('action') || 'Aksiyon'}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="hover:bg-[#333333] cursor-pointer py-2 text-sm text-gray-200">
                <Link to="/">{t('comedy') || 'Komedi'}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="hover:bg-[#333333] cursor-pointer py-2 text-sm text-gray-200">
                <Link to="/">{t('horror') || 'Korku'}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="hover:bg-[#333333] cursor-pointer py-2 text-sm text-gray-200">
                <Link to="/">{t('scifi') || 'Bilim Kurgu'}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="hover:bg-[#333333] cursor-pointer py-2 text-sm text-gray-200">
                <Link to="/">{t('romance') || 'Romantik'}</Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 3. ANA SAYFA LİNKİ */}
        <nav className="flex items-center shrink-0">
          <Button variant="ghost" asChild className="hover:bg-white/10 text-white rounded-sm px-4 h-11 font-bold text-base">
            <Link to="/">{t('home')}</Link>
          </Button>
        </nav>

        {/* 4. ARAMA ÇUBUĞU */}
        <div className="flex flex-1 items-center px-4 max-w-3xl">
          <div className="relative w-full flex items-center">
            <Search className="absolute left-3.5 h-5 w-5 text-gray-500" />
            <Input
              type="search"
              placeholder={t('searchPlaceholder')}
              className="w-full bg-white text-black pl-11 shadow-none h-11 rounded-md text-base focus-visible:ring-2 focus-visible:ring-[#F5C518] border-none"
            />
          </div>
        </div>

        {/* SAĞ TARAF (Watchlist / Profil / Tema Göstergesi / Dil Seçimi) */}
        <div className="flex shrink-0 items-center gap-3 ml-auto">
          {/* İZLEME LİSTESİ (WATCHLIST) */}
          <Button variant="ghost" className="hidden sm:flex hover:bg-white/10 text-white rounded-sm px-4 h-11 font-bold text-base">
            <Plus className="mr-2 h-5 w-5" strokeWidth={3} />
            {t('watchlist')}
          </Button>

          {/* DİL SEÇİMİ (TR/EN) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-11 font-bold text-base px-3 text-white hover:bg-white/10 data-[state=open]:bg-white/10">
                {language}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-24 bg-[#2A2A2A] text-white border-[#333333] min-w-[5rem] text-base">
              <DropdownMenuItem onClick={() => setLanguage('TR')} className="hover:bg-[#333333] cursor-pointer justify-center font-bold focus:bg-white/10 focus:text-white py-2">
                TR
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('EN')} className="hover:bg-[#333333] cursor-pointer justify-center font-bold focus:bg-white/10 focus:text-white py-2">
                EN
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ThemeSwitch />
          <ProfileDropdown />
          {children}
        </div>

      </div>
    </header>
  );
};

Header.displayName = 'Header';
