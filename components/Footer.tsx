import React from "react";
import Link from "next/link";
import { FaInstagram, FaTwitter, FaFacebook } from "react-icons/fa";

interface CategoryCard {
  name: string;
  href: string;
}

interface FooterProps {
  categoryCards: CategoryCard[];
}

function Footer({ categoryCards }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black pt-24 pb-12 border-t border-slate-800">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-20">
          <div className="col-span-2">
            <div className="text-3xl text-white font-black mb-6 tracking-tighter">
              Luxora<span className="text-orange-500">.</span>
            </div>
            <p className="text-slate-300 max-w-xs mb-8">
              Redefining the digital shopping experience through curated
              collections and premium service since 2024.
            </p>
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-slate-800 text-slate-200 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors cursor-pointer"
              >
                <FaInstagram size={18} />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-slate-800 text-slate-200 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors cursor-pointer"
              >
                <FaTwitter size={18} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-slate-800 text-slate-200 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors cursor-pointer"
              >
                <FaFacebook size={18} />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-slate-500">
              Shop
            </h4>
            <ul className="flex flex-col space-y-4 font-medium text-slate-200">
              {categoryCards.slice(0, 3).map((categoryItem) => (
                <Link
                  key={categoryItem.name}
                  href={categoryItem.href}
                  className="hover:text-orange-400 cursor-pointer transition-colors"
                >
                  {categoryItem.name}
                </Link>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-slate-500">
              Support
            </h4>
            <ul className="flex flex-col space-y-4 font-medium text-slate-200">
              <Link
                href="/profile"
                className="hover:text-orange-400 cursor-pointer transition-colors"
              >
                Shipping
              </Link>
              <Link
                href="/profile"
                className="hover:text-orange-400 cursor-pointer transition-colors"
              >
                Returns
              </Link>
              <Link
                href="/profile"
                className="hover:text-orange-400 cursor-pointer transition-colors"
              >
                Contact
              </Link>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-slate-500">
              Legal
            </h4>
            <ul className="flex flex-col space-y-4 font-medium text-slate-200">
              <Link
                href="/"
                className="hover:text-orange-400 cursor-pointer transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/"
                className="hover:text-orange-400 cursor-pointer transition-colors"
              >
                Terms
              </Link>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-sm font-medium">
          <p>© {currentYear} Luxora Commerce Inc. All rights reserved.</p>
          <div className="flex gap-8">
            <Link
              href="/"
              aria-disabled="true"
              className="hover:text-white cursor-pointer transition-colors"
            >
              System Status
            </Link>
            <Link
              href="/"
              className="hover:text-white cursor-pointer transition-colors"
            >
              Cookies Settings
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
