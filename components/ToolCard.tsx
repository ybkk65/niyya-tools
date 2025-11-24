import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface ToolCardProps {
  title: string;
  description: string;
  href: string;
  icon: IconDefinition;
}

export default function ToolCard({ title, description, href, icon }: ToolCardProps) {
  return (
    <Link
      href={href}
      prefetch={true}
      className="group relative block p-6 rounded-xl bg-white/5 border border-white/10 hover:border-niyya-lime/50 transition-all duration-200 hover:bg-white/[0.07]"
    >
      <div className="relative">
        {/* Icon */}
        <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-lg bg-niyya-lime/10 text-niyya-lime group-hover:bg-niyya-lime/20 transition-colors">
          <FontAwesomeIcon icon={icon} className="w-6 h-6" />
        </div>

        {/* Content */}
        <h3 className="text-base font-semibold text-white mb-2">
          {title}
        </h3>
        <p className="text-gray-500 text-xs leading-relaxed">
          {description}
        </p>
      </div>
    </Link>
  );
}
