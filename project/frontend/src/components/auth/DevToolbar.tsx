import { useEffect, useState } from 'react';
import { Bot, Bug, User } from 'lucide-react';
import {
  isDevMode,
  getDevUser,
  getDevRole,
  switchDevUser,
  listDevUsers,
  useAuth,
} from '@/lib/auth';
import type { AuthUser } from '@/lib/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const DEFAULT_DEV_USERS = [
  { email: 'alice@test.com', role: 'admin' },
  { email: 'bob@test.com', role: 'member' },
];

/**
 * Dev-only toolbar that shows the current dev user and provides a quick
 * user switcher. Only renders when `import.meta.env.DEV` is true.
 */
export function DevToolbar() {
  const { user } = useAuth();
  const [devUsers, setDevUsers] = useState<AuthUser[]>([]);
  const [hasAgentBackend, setHasAgentBackend] = useState(false);

  useEffect(() => {
    if (!isDevMode()) return;
    listDevUsers()
      .then(setDevUsers)
      .catch(() => {
        // Endpoint not available yet; that's fine
      });
    // Probe for the agent backend: non-404 (including 401) means the
    // route exists, so show the /_agents link. The dev list route skips
    // requireAuth() when NODE_ENV=development so bare fetch works.
    fetch('/api/agent/sessions', { credentials: 'include' })
      .then((r) => setHasAgentBackend(r.status !== 404))
      .catch(() => setHasAgentBackend(false));
  }, []);

  if (!isDevMode()) return null;

  const currentDevUser = getDevUser();
  const currentDevRole = getDevRole();

  return (
    <div className="bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400 fixed bottom-3 left-3 z-50 flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs shadow-md backdrop-blur">
      <Bug className="size-3.5" />
      <span className="font-medium">DEV</span>
      <span className="bg-amber-500/20 h-4 w-px" />
      {currentDevUser ? (
        <span className="max-w-[160px] truncate">
          {user?.displayName ?? currentDevUser}
          <span className="text-amber-600/60 dark:text-amber-500/60 ml-1">
            ({currentDevRole})
          </span>
        </span>
      ) : (
        <span className="text-amber-600/60 dark:text-amber-500/60">
          No user set
        </span>
      )}
      {hasAgentBackend && (
        <>
          <span className="bg-amber-500/20 h-4 w-px" />
          <a
            href="/_agents"
            className="flex items-center gap-1 hover:underline"
            title="Agent sessions (dev)"
          >
            <Bot className="size-3.5" />
            Agents
          </a>
        </>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-amber-700 hover:bg-amber-500/20 dark:text-amber-400 size-6"
          >
            <User className="size-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" side="top">
          <DropdownMenuLabel className="text-xs">
            Switch dev user
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {devUsers.length > 0
            ? devUsers.map((u) => (
                <DropdownMenuItem
                  key={u.id}
                  onClick={() => switchDevUser(u.email, u.role)}
                >
                  <User className="size-3.5" />
                  <span className="truncate">{u.email}</span>
                  <span className="text-muted-foreground ml-auto text-xs">
                    {u.role}
                  </span>
                </DropdownMenuItem>
              ))
            : DEFAULT_DEV_USERS.map((u) => (
                <DropdownMenuItem
                  key={u.email}
                  onClick={() => switchDevUser(u.email, u.role)}
                >
                  <User className="size-3.5" />
                  <span className="truncate">{u.email}</span>
                  <span className="text-muted-foreground ml-auto text-xs">
                    {u.role}
                  </span>
                </DropdownMenuItem>
              ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
