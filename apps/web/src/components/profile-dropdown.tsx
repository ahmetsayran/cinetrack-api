import { Link } from '@tanstack/react-router';
import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar';
import { User } from 'lucide-react';
import { Button } from '#/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu';
import { useNavUser } from '#/hooks/use-nav-user';
import { useLanguage } from '#/context/language-context';

export function ProfileDropdown() {
  const { userName, userEmail, userAvatar, handleLogout } = useNavUser();
  const { t } = useLanguage();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-11 w-11 rounded-full hover:bg-white/10 p-0 flex items-center justify-center">
          <Avatar className="h-11 w-11 bg-transparent flex items-center justify-center">
            <AvatarImage src={userAvatar || undefined} alt={userName} />
            <AvatarFallback className="bg-transparent text-white flex items-center justify-center w-full h-full">
              <User className="h-8 w-8" strokeWidth={2} />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm leading-none font-medium">{userName}</p>
            <p className="text-muted-foreground text-xs leading-none">{userEmail}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to="/demo/settings">
              {t('profile')}
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/demo/settings">
              {t('billing')}
              <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/demo/settings">
              {t('settings')}
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>{t('newTeam')}</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          {t('logout')}
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
