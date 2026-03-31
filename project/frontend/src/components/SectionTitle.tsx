interface SectionTitleProps {
  emoji: string;
  title: string;
  id?: string;
}

export function SectionTitle({ emoji, title, id }: SectionTitleProps) {
  return (
    <h2
      id={id}
      className="font-display font-bold text-2xl sm:text-3xl mb-6 flex items-center gap-3"
    >
      <span className="text-3xl sm:text-4xl" aria-hidden="true">
        {emoji}
      </span>
      {title}
    </h2>
  );
}
