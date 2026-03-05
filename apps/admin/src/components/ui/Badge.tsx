const variants: Record<string, string> = {
  green: 'bg-green-500/20 text-green-400',
  red: 'bg-red-500/20 text-red-400',
  yellow: 'bg-yellow-500/20 text-yellow-400',
  blue: 'bg-blue-500/20 text-blue-400',
  purple: 'bg-purple-500/20 text-purple-400',
  gray: 'bg-gray-500/20 text-gray-400',
  cyan: 'bg-cyan-500/20 text-cyan-400',
  orange: 'bg-orange-500/20 text-orange-400',
  brand: 'bg-brand-500/20 text-brand-500',
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: keyof typeof variants;
  className?: string;
}

export function Badge({ children, variant = 'gray', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant] ?? variants.gray} ${className}`}
    >
      {children}
    </span>
  );
}
