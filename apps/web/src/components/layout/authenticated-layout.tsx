import { Outlet } from '@tanstack/react-router';
import { Header } from '#/components/layout/header';
import { Footer } from '#/components/layout/footer';
import { SearchProvider } from '#/context/search-context';
import { LanguageProvider } from '#/context/language-context';

interface Props {
  children?: React.ReactNode;
}

export function AuthenticatedLayout({ children }: Props) {
  return (
    <LanguageProvider>
      <SearchProvider>
        <div className="min-h-screen bg-background dark:bg-[#000000] text-foreground flex flex-col font-sans transition-colors duration-200">
          {/* Yeni IMDb Tarzı Navbarımız */}
          <Header />

          {/* Ortalanmış Kapsayıcı (Container) - IMDb gibi sağdan soldan hizalı alan */}
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-12">
            {children ? children : <Outlet />}
          </main>

          <Footer />
        </div>
      </SearchProvider>
    </LanguageProvider>
  );
}
