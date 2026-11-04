import Link from "next/link";

interface QuickLinksProps {
  links: { label: string; href: string }[];
}

const QuickLinks = ({ links }: QuickLinksProps) => {
  return (
    <nav
      aria-label="Atalhos"
      className="bg-foreground border-background/10 border-t"
    >
      <ul className="flex gap-3 overflow-x-auto px-5 py-5 [scrollbar-width:none] md:flex-wrap md:justify-center md:gap-4 md:py-6 [&::-webkit-scrollbar]:hidden">
        {links.map((link) => (
          <li key={link.href} className="shrink-0">
            <Link
              href={link.href}
              className="border-background text-background hover:bg-background hover:text-foreground flex h-12 min-w-40 items-center justify-center border-2 px-6 text-sm font-bold whitespace-nowrap transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default QuickLinks;
