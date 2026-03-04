import { Link } from '@tanstack/react-router';
import {
    IconBrandInstagram,
    IconBrandTwitterFilled,
    IconBrandYoutubeFilled,
    IconBrandFacebookFilled
} from '@tabler/icons-react';
import { useLanguage } from '#/context/language-context';

export function Footer() {
    const { language } = useLanguage();

    return (
        <footer className="w-full bg-[#121212] py-12 text-center text-sm text-white/70 mt-auto border-t border-[#333333]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">

                {/* Left Side: Brand and Copyright */}
                <div className="flex flex-col items-center md:items-start gap-2">
                    <Link to="/" className="text-[#E5B509] font-extrabold text-2xl tracking-tighter hover:text-white transition-colors">
                        FilmLog
                    </Link>
                    <p className="text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} FilmLog. {language === 'TR' ? 'Tüm hakları saklıdır.' : 'All rights reserved.'}
                    </p>
                </div>

                {/* Center: Social Media */}
                <div className="flex flex-col items-center gap-3">
                    <span className="font-semibold text-gray-400 uppercase tracking-widest text-xs">
                        {language === 'TR' ? 'Bizi Takip Edin' : 'Follow Us'}
                    </span>
                    <div className="flex items-center gap-4">
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-[#E1306C] hover:text-white transition-all duration-300">
                            <IconBrandInstagram size={20} stroke={2} />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-[#1DA1F2] hover:text-white transition-all duration-300">
                            <IconBrandTwitterFilled size={20} />
                        </a>
                        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-[#FF0000] hover:text-white transition-all duration-300">
                            <IconBrandYoutubeFilled size={20} />
                        </a>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-[#1877F2] hover:text-white transition-all duration-300">
                            <IconBrandFacebookFilled size={20} />
                        </a>
                    </div>
                </div>

                {/* Right Side: Contact */}
                <div className="flex flex-col items-center md:items-end gap-2">
                    <span className="font-semibold text-gray-400 uppercase tracking-widest text-xs">
                        {language === 'TR' ? 'İletişim' : 'Contact'}
                    </span>
                    <a href="mailto:contact@filmlog.com" className="text-base text-gray-300 hover:text-[#E5B509] transition-colors font-medium">
                        contact@filmlog.com
                    </a>
                    <a href="tel:+905551234567" className="text-sm text-gray-500 hover:text-[#E5B509] transition-colors">
                        +90 (555) 123 45 67
                    </a>
                </div>

            </div>
        </footer>
    );
}
