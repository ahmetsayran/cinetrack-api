import { useState } from 'react';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '#/lib/utils';
import { useLanguage } from '#/context/language-context';

const sliderMovies = [
    {
        id: 1,
        title: 'The Pianist',
        backdrop: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=2070&auto=format&fit=crop', // Çalışan Unsplash Piyano Konsepti
    },
    {
        id: 2,
        title: 'The Shawshank Redemption',
        backdrop: 'https://image.tmdb.org/t/p/original/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg', // Çalışan TMDB
    },
    {
        id: 3,
        title: 'Forrest Gump',
        backdrop: 'https://image.tmdb.org/t/p/original/qdIMHd4sEfJSckfVJfKQvisL02a.jpg', // Çalışan TMDB
    },
    {
        id: 4,
        title: 'Inception',
        backdrop: 'https://image.tmdb.org/t/p/original/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg',
    },
    {
        id: 5,
        title: 'Interstellar',
        backdrop: 'https://image.tmdb.org/t/p/original/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg',
    },
    {
        id: 6,
        title: 'The Dark Knight',
        backdrop: 'https://image.tmdb.org/t/p/original/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg',
    },
    {
        id: 7,
        title: 'Spider-Man: No Way Home',
        backdrop: 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?q=80&w=2080&auto=format&fit=crop', // Çalışan Süper Kahraman
    },
];

export function HeroBanner() {
    const [activeIndex, setActiveIndex] = useState(2); // Ortadan başlatıyoruz
    const { t } = useLanguage();

    // Dairesel döngü için önceki ve sonraki fonksiyonları
    const handlePrev = () => {
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : sliderMovies.length - 1));
    };

    const handleNext = () => {
        setActiveIndex((prev) => (prev < sliderMovies.length - 1 ? prev + 1 : 0));
    };

    const getCardStyles = (index: number) => {
        // Toplam kart sayısını ve ortadaki aktif kartın indeksini alıyoruz
        const total = sliderMovies.length;
        // index - activeIndex dairesel mantıkta eksi veya artı kalabilir
        let diff = index - activeIndex;

        // Dairesel mesafeyi hesaplama
        if (diff > total / 2) diff -= total;
        if (diff < -total / 2) diff += total;

        // Uzaklığa göre z-index, scale, translate, translateX, opaklık ve brightness atamaları
        const isCenter = diff === 0;
        const isFirstLevel = Math.abs(diff) === 1;
        const isSecondLevel = Math.abs(diff) === 2;

        let zIndex = 10;
        let scale = 0;
        let translateX = '0%';
        let opacity = 0;
        let brightness = 'brightness-100';

        if (isCenter) {
            zIndex = 30;
            scale = 100;
            translateX = '0%';
            opacity = 1;
            brightness = 'brightness-100';
        } else if (isFirstLevel) {
            zIndex = 20;
            scale = 80;
            translateX = diff > 0 ? '55%' : '-55%';
            opacity = 0.8;
            brightness = 'brightness-50';
        } else if (isSecondLevel) {
            zIndex = 10;
            scale = 65;
            translateX = diff > 0 ? '95%' : '-95%';
            opacity = 0.5;
            brightness = 'brightness-[0.25]';
        }

        return {
            zIndex,
            transform: `translateX(${translateX}) scale(${scale / 100})`,
            opacity: opacity,
            filter: brightness,
            transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            pointerEvents: isCenter || isFirstLevel || isSecondLevel ? 'auto' as 'auto' : 'none' as 'none',
        };
    };

    return (
        <div className="w-full mt-16 md:mt-24 mb-16 md:mb-24 pt-4 pb-8 overflow-hidden relative select-none">
            <h2 className="text-xl md:text-2xl font-bold mb-6 px-4 md:px-0">{t('featured')}</h2>

            {/* Slider Alanı Yüksekliği (Eskiden 500px'di, şimdi 350px gibi dar tutuldu) */}
            <div className="relative h-[250px] sm:h-[300px] md:h-[350px] w-full flex justify-center items-center">
                {/* Sol ve Sağ Oklar (Navigasyon Butonları) */}
                <button
                    onClick={handlePrev}
                    className="absolute left-2 md:left-4 z-40 p-2 rounded-full bg-black/40 text-white hover:bg-black/70 hover:text-[#F5C518] transition-colors backdrop-blur-sm"
                >
                    <ChevronLeft size={36} />
                </button>
                <button
                    onClick={handleNext}
                    className="absolute right-2 md:right-4 z-40 p-2 rounded-full bg-black/40 text-white hover:bg-black/70 hover:text-[#F5C518] transition-colors backdrop-blur-sm"
                >
                    <ChevronRight size={36} />
                </button>

                {/* Kartlar */}
                <div className="relative w-full max-w-4xl h-full flex justify-center items-center perspective-1000">
                    {sliderMovies.map((movie, index) => {
                        const styles = getCardStyles(index);
                        const isCenter = index === activeIndex;

                        return (
                            <div
                                key={movie.id}
                                onClick={() => !isCenter && setActiveIndex(index)}
                                className={cn(
                                    'absolute top-0 w-full md:w-[60%] lg:w-[65%] h-full rounded-2xl overflow-hidden shadow-2xl origin-center',
                                    !isCenter && 'cursor-pointer'
                                )}
                                style={{
                                    ...styles,
                                    // Inline filter requires a string, Tailwind output is classes.
                                    // We simulate brightness using a black overlay if not center.
                                }}
                            >
                                <img
                                    src={movie.backdrop}
                                    alt={movie.title}
                                    className="w-full h-full object-cover rounded-2xl"
                                    draggable={false}
                                />

                                {/* Karartma katmanı (Center hariç) */}
                                {!isCenter && (
                                    <div className="absolute inset-0 bg-black/50 transition-colors" />
                                )}

                                {/* Yalnızca Merkez (Front) Kartındaki İçerik */}
                                {isCenter && (
                                    <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 bg-gradient-to-t from-black via-black/30 to-transparent rounded-2xl shadow-inner">
                                        <h3 className="text-2xl md:text-4xl font-bold text-white mb-4 drop-shadow-md">
                                            {movie.title}
                                        </h3>
                                        {/* Merkezdeki Dev Play Butonu */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <button className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-white/10 hover:bg-[#F5C518]/90 backdrop-blur-md border border-white/20 text-white hover:text-black flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                                                <Play className="h-8 w-8 ml-1" fill="currentColor" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
