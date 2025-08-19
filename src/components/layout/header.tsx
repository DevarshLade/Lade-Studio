import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Search, ShoppingCart, User, Menu, Feather } from "lucide-react";

const Logo = () => (
  <Link href="/" className="flex items-center gap-2">
    <Feather className="h-7 w-7 text-primary" />
    <span className="text-2xl font-headline font-bold">Lade Studio</span>
  </Link>
);

const navLinks = [
  { href: "/products?category=painting", label: "Painting" },
  { href: "/products?category=pots", label: "Pots" },
  { href: "/products?category=canvas", label: "Canvas" },
  { href: "/products?category=hand-painted-jewelry", label: "Hand Painted Jewelry" },
  { href: "/products?category=terracotta-pots", label: "Terracotta Pots" },
  { href: "/products?category=fabric-painting", label: "Fabric Painting" },
  { href: "/products?category=portrait", label: "Portrait" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const NavLinks = ({ className }: { className?: string }) => (
  <nav className={className}>
    {navLinks.map((link) => (
      <Button key={link.label} variant="ghost" asChild>
        <Link href={link.href}>{link.label}</Link>
      </Button>
    ))}
  </nav>
);

const HeaderActions = ({ className }: { className?: string }) => (
  <div className={className}>
    <Button variant="ghost" size="icon">
      <Search className="h-5 w-5" />
      <span className="sr-only">Search</span>
    </Button>
    <Button variant="ghost" size="icon" asChild>
      <Link href="/my-account">
        <User className="h-5 w-5" />
        <span className="sr-only">My Account</span>
      </Link>
    </Button>
    <Button variant="ghost" size="icon" asChild>
      <Link href="/cart">
        <ShoppingCart className="h-5 w-5" />
        <span className="sr-only">Shopping Cart</span>
      </Link>
    </Button>
  </div>
);

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Logo />
        <NavLinks className="hidden md:flex items-center gap-2" />
        <div className="flex items-center">
          <HeaderActions className="hidden md:flex items-center" />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col h-full">
                <div className="p-4 border-b">
                  <Logo />
                </div>
                <nav className="flex flex-col items-start gap-2 p-4">
                  {navLinks.map((link) => (
                    <Button key={link.label} variant="link" asChild className="text-lg">
                      <Link href={link.href}>{link.label}</Link>
                    </Button>
                  ))}
                </nav>
                <div className="mt-auto p-4 border-t">
                    <HeaderActions className="flex items-center justify-around" />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
