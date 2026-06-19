import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'Inception Launchpad',
  description: 'AI-powered tools to kick-start your brokerage project',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        {/* Navigation header */}
        <header className="sticky top-0 z-50 bg-navy shadow-md">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              {/* Logo / Brand */}
              <Link href="/" className="flex items-center gap-3 group">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold text-white font-bold text-sm">
                  IL
                </div>
                <div>
                  <span className="text-white font-bold text-base leading-tight block">
                    Inception Launchpad
                  </span>
                  <span className="text-navy-200 text-xs leading-tight block opacity-80">
                    Brokerage AI Registry
                  </span>
                </div>
              </Link>

              {/* Nav links */}
              <nav className="hidden sm:flex items-center gap-1">
                <Link
                  href="/"
                  className="rounded-md px-3 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/agents"
                  className="rounded-md px-3 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                >
                  All Agents
                </Link>
                <Link
                  href="/agents/orchestrator"
                  className="ml-2 rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gold-500 transition-colors"
                >
                  ⚡ Run Full Package
                </Link>
              </nav>

              {/* Mobile menu button — simplified, no JS toggle needed for scaffold */}
              <div className="sm:hidden">
                <Link
                  href="/agents"
                  className="rounded-md px-3 py-2 text-sm font-medium text-white/80 hover:text-white"
                >
                  Agents
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="bg-navy mt-auto">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-white/60 text-sm">
                &copy; {new Date().getFullYear()} Inception Launchpad — Internal
                AI Capability Registry
              </div>
              <div className="flex items-center gap-4 text-sm text-white/60">
                <Link
                  href="/agents"
                  className="hover:text-white transition-colors"
                >
                  Browse Agents
                </Link>
                <span>·</span>
                <Link
                  href="/agents/orchestrator"
                  className="hover:text-white transition-colors"
                >
                  Full Package
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
