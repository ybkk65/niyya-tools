"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Accueil", href: "/" },
  { name: "Outils", href: "/#outils" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-niyya-darker/80 backdrop-blur-md border-b border-white/5">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative w-10 h-10 transition-transform group-hover:scale-110">
                <Image
                  src="/images/logo_NIYYA_QR.webp"
                  alt="Niyya Agency"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold text-white hidden sm:block">
                Niyya <span className="text-niyya-lime">Tools</span>
              </span>
            </Link>
          </div>

          {/* Navigation centrale */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-niyya-lime ${
                  pathname === item.href
                    ? "text-niyya-lime"
                    : "text-gray-300"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <a
              href="https://www.niyya-agency.com/admin/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg border border-niyya-lime/30 text-niyya-lime hover:bg-niyya-lime/10 transition-all"
            >
              Dashboard
            </a>
            <a
              href="https://www.niyya-agency.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg bg-niyya-lime text-niyya-darker hover:bg-niyya-lime/90 transition-all hover:scale-105"
            >
              Site Web
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
