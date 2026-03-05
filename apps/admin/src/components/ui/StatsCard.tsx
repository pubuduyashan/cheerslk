interface StatsCardProps {
  label: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
}

export function StatsCard({ label, value, change, icon }: StatsCardProps) {
  return (
    <div className="rounded-xl bg-dark-800 border border-dark-700 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">{label}</p>
          <p className="mt-1 text-2xl font-bold text-white">{value}</p>
          {change !== undefined && (
            <p
              className={`mt-1 text-sm font-medium ${
                change >= 0 ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {change >= 0 ? '+' : ''}
              {change}% vs yesterday
            </p>
          )}
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-500/10 text-brand-500">
          {icon}
        </div>
      </div>
    </div>
  );
}
