import { IconMoon, IconSun } from '@tabler/icons-react';
import { useEffect } from 'react';
import { Button } from '#/components/ui/button';
import { useTheme } from '#/context/theme-context';
import { useLanguage } from '#/context/language-context';

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();

  /* Update theme-color meta tag
   * when theme is updated */
  useEffect(() => {
    const themeColor = theme === 'dark' ? '#020817' : '#fff';
    const metaThemeColor = document.querySelector("meta[name='theme-color']");
    if (metaThemeColor) metaThemeColor.setAttribute('content', themeColor);
  }, [theme]);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="scale-95 rounded-full hover:bg-white/10 text-white"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      <IconSun className="size-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <IconMoon className="absolute size-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      <span className="sr-only">{t('toggleTheme')}</span>
    </Button>
  );
}
