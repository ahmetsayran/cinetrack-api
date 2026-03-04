import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Search, Plus } from 'lucide-react';
import { Input } from '#/components/ui/input';
import { Button } from '#/components/ui/button';
import { cn } from '#/lib/utils';
import { ThemeSwitch } from '#/components/theme-switch';
import { useLanguage } from '#/context/language-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "#/components/ui/dropdown-menu";

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  fixed?: boolean;
}

export const Header = ({ className, fixed, children, ...props }: HeaderProps) => {
  const { t, language, setLanguage } = useLanguage();
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

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
        <Link to="/" className="flex shrink-0 items-center mr-4">
          <span className="text-[#E5B509] font-extrabold text-3xl tracking-tighter">
            FilmLog
          </span>
        </Link>

        <nav className="flex items-center shrink-0">
          <Button variant="ghost" asChild className="hover:bg-white/10 text-white rounded-sm px-4 h-11 font-bold text-base">
            <Link to="/">{t('home')}</Link>
          </Button>
        </nav>

        {/* 3. KATEGORİLER (Eski Hamburger Menü) */}
        <div
          onMouseEnter={() => setIsCategoriesOpen(true)}
          onMouseLeave={() => setIsCategoriesOpen(false)}
        >
          <DropdownMenu open={isCategoriesOpen} onOpenChange={setIsCategoriesOpen} modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="hover:bg-white/10 text-white rounded-sm px-4 h-11 font-bold text-base data-[state=open]:bg-white/10 shrink-0">
                {t('categories') || 'Kategoriler'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-56 bg-[#2A2A2A] text-white border-[#333333] text-base"
              onMouseEnter={() => setIsCategoriesOpen(true)}
              onMouseLeave={() => setIsCategoriesOpen(false)}
            >
              <DropdownMenuGroup>
                <DropdownMenuItem asChild className="hover:bg-[#333333] cursor-pointer py-2 text-sm text-gray-200">
                  <button className="w-full text-left" onClick={() => { document.getElementById('category-Aksiyon')?.scrollIntoView({ behavior: 'smooth' }); setIsCategoriesOpen(false); }}>{t('action') || 'Aksiyon'}</button>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="hover:bg-[#333333] cursor-pointer py-2 text-sm text-gray-200">
                  <button className="w-full text-left" onClick={() => { document.getElementById('category-Komedi')?.scrollIntoView({ behavior: 'smooth' }); setIsCategoriesOpen(false); }}>{t('comedy') || 'Komedi'}</button>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="hover:bg-[#333333] cursor-pointer py-2 text-sm text-gray-200">
                  <button className="w-full text-left" onClick={() => { document.getElementById('category-Korku')?.scrollIntoView({ behavior: 'smooth' }); setIsCategoriesOpen(false); }}>{t('horror') || 'Korku'}</button>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="hover:bg-[#333333] cursor-pointer py-2 text-sm text-gray-200">
                  <button className="w-full text-left" onClick={() => { document.getElementById('category-Bilim Kurgu')?.scrollIntoView({ behavior: 'smooth' }); setIsCategoriesOpen(false); }}>{t('scifi') || 'Bilim Kurgu'}</button>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="hover:bg-[#333333] cursor-pointer py-2 text-sm text-gray-200">
                  <button className="w-full text-left" onClick={() => { document.getElementById('category-Romantik')?.scrollIntoView({ behavior: 'smooth' }); setIsCategoriesOpen(false); }}>{t('romance') || 'Romantik'}</button>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* 4. ARAMA ÇUBUĞU */}
        <div className="flex flex-1 items-center px-4 max-w-3xl">
          <div className="relative w-full flex items-center">
            <Search className="absolute left-3.5 h-5 w-5 text-gray-500 pointer-events-none" />
            <Input
              type="search"
              placeholder={t('searchPlaceholder')}
              className="w-full bg-white dark:bg-[#1A1A1A] text-black dark:text-[#E5B509] pl-11 shadow-none h-11 rounded-md text-base focus-visible:ring-2 focus-visible:ring-[#F5C518] border-none"
            />
          </div>
        </div>

        {/* SAĞ TARAF (Watchlist / Profil / Tema Göstergesi / Dil Seçimi) */}
        <div className="flex shrink-0 items-center gap-3 ml-auto">
          {/* İZLEME LİSTESİ (WATCHLIST) */}
          <Link to="/watchlist">
            <Button variant="ghost" className="hidden sm:flex hover:bg-white/10 text-white rounded-sm px-4 h-11 font-bold text-base cursor-pointer">
              <Plus className="mr-2 h-5 w-5" strokeWidth={3} />
              {t('watchlist')}
            </Button>
          </Link>

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

          {/* SIGN IN BUTONU & DROPDOWN */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="hover:bg-white/10 text-white rounded-sm px-4 h-11 font-bold text-base shrink-0">
                {t('signIn') || 'Sign in'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 bg-[#2A2A2A] text-white border-[#333333] text-base">
              <DropdownMenuItem asChild className="hover:bg-[#333333] cursor-pointer py-2 font-bold text-white">
                <Link to="/sign-in">{t('signIn') || 'Giriş Yap'}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="hover:bg-[#333333] cursor-pointer py-2 font-bold text-white">
                <Link to="/sign-up">{t('signUp') || 'Üye Ol'}</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {children}
        </div>

      </div>
    </header>
  );
};

Header.displayName = 'Header';
