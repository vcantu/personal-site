import { cn } from '@/lib/utils';

interface BrutalistCardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  tilt?: '-rotate-1' | 'rotate-1' | '-rotate-2' | 'rotate-2';
  onClick?: () => void;
  'data-testid'?: string;
}

export function BrutalistCard({
  children,
  className,
  hoverable = false,
  tilt,
  onClick,
  'data-testid': testId,
}: BrutalistCardProps) {
  return (
    <div
      onClick={onClick}
      data-testid={testId}
      className={cn(
        'bg-cream border-[3px] border-ink shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] transition-all duration-200',
        hoverable && 'cursor-pointer hover:shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] hover:translate-x-[2px] hover:translate-y-[2px]',
        hoverable && tilt && `hover:${tilt}`,
        className
      )}
    >
      {children}
    </div>
  );
}
