import Link from "next/link";

interface ToolCardProps {
  title: string;
  description: string;
  href: string;
  icon: string;
}

export default function ToolCard({ title, description, href, icon }: ToolCardProps) {
  return (
    <Link
      href={href}
      className="group relative block p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-niyya-lime/50 transition-all duration-300 hover:scale-105"
    >
      {/* Effet de glow au hover */}
      <div className="absolute inset-0 rounded-2xl bg-niyya-lime/0 group-hover:bg-niyya-lime/5 transition-all duration-300" />
      
      <div className="relative">
        {/* Icon */}
        <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-xl bg-niyya-lime/10 text-niyya-lime text-3xl group-hover:scale-110 transition-transform">
          {icon}
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-niyya-lime transition-colors">
          {title}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed">
          {description}
        </p>

        {/* Arrow */}
        <div className="mt-6 flex items-center text-niyya-lime font-semibold text-sm">
          <span className="group-hover:translate-x-1 transition-transform">
            Utiliser l'outil
          </span>
          <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </div>
    </Link>
  );
}
