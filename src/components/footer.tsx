import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface mt-12">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-8">
          <div>
            <p className="text-lg font-bold text-brand">
              Deal<span className="text-accent">Hive</span>
            </p>
            <p className="text-xs text-muted mt-1 max-w-xs">
              Live deals from Pakistan&apos;s top brands, updated daily.
            </p>
          </div>

          <nav className="flex gap-6 text-sm">
            <Link href="/about" className="text-muted hover:text-brand transition-colors">
              How It Works
            </Link>
            <Link href="/faq" className="text-muted hover:text-brand transition-colors">
              FAQ
            </Link>
          </nav>
        </div>

        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-xs text-muted text-center">
            © {new Date().getFullYear()} DealHive. DealHive is an
            independent deals aggregator and is not affiliated with the
            brands listed. All product links redirect to official brand
            websites.
          </p>
        </div>
      </div>
    </footer>
  );
}