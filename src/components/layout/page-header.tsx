import { cn } from "@/lib/utils";

type PageHeaderProps = {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
};

export function PageHeader({
  title,
  description,
  children,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div>
        <h1 className="text-3xl font-medium tracking-tight text-zinc-100">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 text-sm leading-6 text-zinc-400">{description}</p>
        ) : null}
      </div>
      {children ? (
        <div className="relative z-30 flex flex-wrap gap-2 isolate">{children}</div>
      ) : null}
    </div>
  );
}
