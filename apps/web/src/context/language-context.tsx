import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'TR' | 'EN';

export interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const translations = {
    TR: {
        movies: 'Filmler',
        shows: 'Diziler',
        watchlist: 'İzleme Listesi',
        home: 'Ana Sayfa',
        searchPlaceholder: 'Film, Dizi veya Yönetmen Ara...',
        profile: 'Profil',
        billing: 'Faturalandırma',
        settings: 'Ayarlar',
        newTeam: 'Yeni Takım',
        logout: 'Çıkış Yap',
        light: 'Açık',
        dark: 'Koyu',
        system: 'Sistem',
        toggleTheme: 'Tema Değiştir',
        featured: 'Öne Çıkanlar',
        popularMovies: 'Popüler Filmler',
        addToWatchlist: 'İzleme Listesi',
        addedToWatchlist: 'Listede',
        comments: 'Yorumlar',
        writeComment: 'Yorum Yaz',
        submitComment: 'Gönder',
        yourComment: 'Bu film hakkında ne düşünüyorsun...',
        action: 'Aksiyon',
        comedy: 'Komedi',
        horror: 'Korku',
        scifi: 'Bilim Kurgu',
        romance: 'Romantik',
    },
    EN: {
        movies: 'Movies',
        shows: 'TV Shows',
        watchlist: 'Watchlist',
        home: 'Home',
        searchPlaceholder: 'Search for Movies, TV Shows or Directors...',
        profile: 'Profile',
        billing: 'Billing',
        settings: 'Settings',
        newTeam: 'New Team',
        logout: 'Log out',
        light: 'Light',
        dark: 'Dark',
        system: 'System',
        toggleTheme: 'Toggle theme',
        featured: 'Featured',
        popularMovies: 'Popular Movies',
        addToWatchlist: 'Watchlist',
        addedToWatchlist: 'Added',
        comments: 'Reviews',
        writeComment: 'Write a Review',
        submitComment: 'Submit',
        yourComment: 'What do you think about this movie...',
        action: 'Action',
        comedy: 'Comedy',
        horror: 'Horror',
        scifi: 'Sci-Fi',
        romance: 'Romance',
    }
} as const;

type TranslationKey = keyof typeof translations.TR;

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>('TR');

    useEffect(() => {
        const saved = localStorage.getItem('filmlog-language') as Language;
        if (saved === 'TR' || saved === 'EN') {
            setLanguageState(saved);
        }
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('filmlog-language', lang);
    };

    const t = (key: string) => {
        return translations[language][key as TranslationKey] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
