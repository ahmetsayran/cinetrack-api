import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { MOCK_MOVIES, MOVIE_DATA, TOP_RATED_MOVIES, CATEGORY_MOVIES } from '#/features/dashboard/components/movie-grid';
import { Star, MessageSquare } from 'lucide-react';
import { useLanguage } from '#/context/language-context';

export const Route = createFileRoute('/_authenticated/watchlist')({
    component: WatchlistPage,
});

function WatchlistPage() {
    const { t } = useLanguage();
    const [watchlistIds, setWatchlistIds] = useState<number[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('filmlog_watchlist');
        if (saved) {
            setWatchlistIds(JSON.parse(saved));
        }
    }, []);

    // Tüm verileri birleştirerek watchlist kontrolünü yapalım
    const allMovies = [...MOCK_MOVIES, ...MOVIE_DATA, ...TOP_RATED_MOVIES, ...Object.values(CATEGORY_MOVIES).flat()];

    // İzleme listesine alınan filmleri benzersiz (unique) ID'lerine göre filtreleyelim
    const uniqueWatchlistIds = Array.from(new Set(watchlistIds));
    const savedMovies = uniqueWatchlistIds
        .map(id => allMovies.find(m => m.id === id))
        .filter((m): m is typeof allMovies[0] => m !== undefined);

    const removeFromWatchlist = (id: number) => {
        const newList = watchlistIds.filter(mId => mId !== id);
        setWatchlistIds(newList);
        localStorage.setItem('filmlog_watchlist', JSON.stringify(newList));
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl pt-24 min-h-[80vh]">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-[#F5C518] rounded-full inline-block"></span>
                {t('watchlist') || 'Sihirli Liste'}
            </h1>

            {savedMovies.length === 0 ? (
                <div className="text-center py-20 bg-[#121212] rounded-xl border border-[#222]">
                    <h2 className="text-xl font-semibold text-gray-300 mb-2">Listeniz şu an boş</h2>
                    <p className="text-gray-500">İzlemek istediğiniz filmleri anasayfadan <span className="text-[#F5C518]">+</span> butonuna basarak buraya ekleyebilirsiniz.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {savedMovies.map(movie => (
                        <div key={movie.id} className="flex flex-col bg-card dark:bg-[#1A1A1A] rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow group border border-border/40 relative">
                            <div className="relative aspect-[2/3] overflow-hidden">
                                <img
                                    src={movie.posterUrl}
                                    alt={movie.title}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                                <div
                                    className="absolute top-2 right-2 bg-black/60 text-white w-8 h-8 rounded-full flex items-center justify-center cursor-pointer hover:bg-black hover:text-red-500 transition-colors"
                                    onClick={() => removeFromWatchlist(movie.id)}
                                    title="Listeden Çıkar"
                                >
                                    <span className="text-xl font-bold leading-none mb-1">x</span>
                                </div>
                            </div>

                            <div className="p-3 flex flex-col flex-grow gap-2">
                                <h3 className="font-medium text-foreground text-sm line-clamp-1 text-left leading-tight">
                                    {movie.title}
                                </h3>

                                <div className="flex items-center gap-4 text-xs text-gray-400 font-medium pl-1 mb-1">
                                    <div className="flex items-center gap-1.5" title="IMDb Puanı">
                                        <Star className="fill-[#F5C518] text-[#F5C518]" size={15} />
                                        <span className="text-foreground">{movie.rating.toFixed(1)}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5" title="Yorumlar">
                                        <MessageSquare size={14} className="text-gray-400" />
                                        <span className="text-foreground">{Math.floor(movie.id / 3) || 12}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
