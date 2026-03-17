import Link from 'next/link';

interface CTAButtonProps {
  href: string;
  label: string;
}

export default function CTAButton({ href, label }: CTAButtonProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 shadow-lg shadow-emerald-500/30 transition-all duration-200 hover:scale-105 hover:shadow-emerald-500/50"
    >
      {label}
    </Link>
  );
}
