import { useEffect, useState } from 'react';
import { LogOut, User, Users } from 'lucide-react';
import { useAuth, isDevMode, getDevUser, switchDevUser, listDevUsers } from '@/lib/auth';
import type { AuthUser } from '@/lib/auth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

function userInitials(user: AuthUser): string {
  if (user.displayName) {
    return user.displayName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
  return user.email.slice(0, 2).toUpperCase();
}

export function UserMenu() {
  const { user, logout } = useAuth();
  const [devUsers, setDevUsers] = useState<AuthUser[]>([]);
  const showDevSwitcher = isDevMode() && !!getDevUser();

  useEffect(() => {
    if (!showDevSwitcher) return;
    listDevUsers()
      .then(setDevUsers)
      .catch(() => {
        // Dev users endpoint not available
      });
  }, [showDevSwitcher]);

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar className="size-8">
            <AvatarFallback className="text-xs">
              {userInitials(user)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-1">
            {user.displayName && (
              <p className="text-sm font-medium leading-none">
                {user.displayName}
              </p>
            )}
            <p className="text-muted-foreground text-xs leading-none">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {showDevSwitcher && devUsers.length > 0 && (
          <>
            <DropdownMenuGroup>
              <DropdownMenuLabel className="flex items-center gap-2 text-xs">
                <Users className="size-3" />
                Switch user
              </DropdownMenuLabel>
              {devUsers.map((u) => (
                <DropdownMenuItem
                  key={u.id}
                  onClick={() => switchDevUser(u.email, u.role)}
                >
                  <User className="size-4" />
                  <span className="truncate">{u.email}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuItem onClick={logout}>
          <LogOut className="size-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
