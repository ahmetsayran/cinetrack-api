import { useState } from 'react';
import { Star, Plus, Check, MessageSquare } from 'lucide-react';
import { Button } from '#/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '#/components/ui/dialog';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '#/components/ui/tooltip';
import { Textarea } from '#/components/ui/textarea';
import { useLanguage } from '#/context/language-context';

// Mock data for the movie grid
const MOCK_MOVIES = [
    {
        id: 101, title: 'The Pursuit of Happyness', posterUrl: 'https://image.tmdb.org/t/p/w500/5aGhaI4gSFA02aC1L69iA0n0Jd3.jpg', rating: 8.0,
        year: 2006, genre: 'Dram, Biyografi', director: 'Gabriele Muccino', runtime: '117 dk',
        overview: 'Maddi zorluklar ve evsizlikle mücadele eden bekar bir babanın, oğluna iyi bir hayat sunabilmek için borsacı olma hayalinin peşinden gitmesini konu alan yürek burkan gerçek bir hikaye.'
    },
    {
        id: 102, title: 'Fight Club', posterUrl: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg', rating: 8.8,
        year: 1999, genre: 'Dram, Gerilim', director: 'David Fincher', runtime: '139 dk',
        overview: 'Uykusuzluk hastalığından (insomnia) muzdarip olan sıradan bir ofis çalışanı, gizemli ve karizmatik sabun satıcısı Tyler Durden ile tanıştıktan sonra bir yeraltı dövüş kulübü kurar.'
    },
    {
        id: 103, title: 'Pulp Fiction', posterUrl: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPbOYKQwG2l.jpg', rating: 8.9,
        year: 1994, genre: 'Suç, Dram', director: 'Quentin Tarantino', runtime: '154 dk',
        overview: 'İki tetikçi, bir boksör, bir gangster ve karısının kesişen, doğrusal olmayan hikayelerini anlatan Tarantino başyapıtı şiddet ve pop kültürü şöleni.'
    },
    {
        id: 104, title: 'Forrest Gump', posterUrl: 'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg', rating: 8.8,
        year: 1994, genre: 'Dram, Romantik', director: 'Robert Zemeckis', runtime: '142 dk',
        overview: 'Düşük zekalı ama altın gibi bir kalbe sahip olan Forrest Gump, bilmeden ABD tarihindeki en önemli olayların merkezinde yer alır ve çocukluk aşkı Jenny’i aramaya devam eder.'
    },
    {
        id: 105, title: 'The Dark Knight', posterUrl: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', rating: 9.0,
        year: 2008, genre: 'Aksiyon, Suç', director: 'Christopher Nolan', runtime: '152 dk',
        overview: 'Batman (Bruce Wayne), Gotham şehrini kaosa ve anarşiye sürüklemek isteyen psikopat suç dehası Joker ile yüzleşirken kendi ahlaki sınırlarını zorlar.'
    },
    {
        id: 106, title: 'Interstellar', posterUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MvrIdlsR.jpg', rating: 8.6,
        year: 2014, genre: 'Bilim Kurgu, Dram', director: 'Christopher Nolan', runtime: '169 dk',
        overview: 'Dünya’nın sonu yaklaşırken, insanlığın hayatta kalabilmesi için yeni bir yaşanabilir evren bulmak amacıyla solucan deliğinden geçen bir grup astronotun zaman ve mekan ötesi hikayesi.'
    },
    {
        id: 107, title: 'The Godfather', posterUrl: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg', rating: 9.2,
        year: 1972, genre: 'Suç, Dram', director: 'Francis Ford Coppola', runtime: '175 dk',
        overview: 'New York\'taki güçlü bir İtalyan mafya ailesinin yaşlı reisi Vito Corleone, imparatorluğunun kontrolünü isteksiz ve idealist en küçük oğlu Michael\'a devreder.'
    },
    {
        id: 108, title: 'The Matrix', posterUrl: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GvwBZZ4Zcz.jpg', rating: 8.7,
        year: 1999, genre: 'Bilim Kurgu, Aksiyon', director: 'Wachowski Kardeşler', runtime: '136 dk',
        overview: 'Sıradan bir hacker olan Neo, yaşadığı dünyanın aslında makineler tarafından yaratılmış bir simülasyon olduğunu keşfeder ve insanlığın kurtuluşu için isyana katılır.'
    },
    {
        id: 109, title: 'Inception', posterUrl: 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg', rating: 8.8,
        year: 2010, genre: 'Bilim Kurgu, Gerilim', director: 'Christopher Nolan', runtime: '148 dk',
        overview: 'İnsanların rüyalarına girerek bilinçaltlarından sır çalan yetenekli bir hırsız, bu kez bir zihne fikir yerleştirmek (Inception) şeklindeki imkansız bir görevi kabul eder.'
    },
    {
        id: 110, title: 'The Lord of the Rings: The Return of the King', posterUrl: 'https://image.tmdb.org/t/p/w500/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg', rating: 9.0,
        year: 2003, genre: 'Fantastik, Macera', director: 'Peter Jackson', runtime: '201 dk',
        overview: 'Orta Dünya\'nın nihai savaşı başlarken Frodo ve Sam, Sauron\'u sonsuza dek yok etmek amacıyla Tek Yüzük\'ü Hüküm Dağı\'nın ateşlerine atmak için ölümcül bir yolculuğa çıkar.'
    },
    {
        id: 111, title: 'Star Wars: Episode V', posterUrl: 'https://image.tmdb.org/t/p/w500/7BuH8itoSrLExs2GIrS21dccSQ.jpg', rating: 8.7,
        year: 1980, genre: 'Bilim Kurgu, Macera', director: 'Irvin Kershner', runtime: '124 dk',
        overview: 'İmparatorluk güçleri Asiler\'e acımasızca saldırırken, genç Luke Skywalker gizemli Jedi Ustası Yoda\'dan eğitim almak üzere zorlu bir maceraya atılır.'
    },
    {
        id: 112, title: 'Goodfellas', posterUrl: 'https://image.tmdb.org/t/p/w500/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg', rating: 8.7,
        year: 1990, genre: 'Suç, Dram', director: 'Martin Scorsese', runtime: '145 dk',
        overview: 'Henry Hill adındaki İrlandalı-İtalyan kökenli bir adamın, New York mafya hiyerarşisinde şiddet ve lüksle dolu yükselişinin ardından dramatik çöküşünü konu alır.'
    },
    {
        id: 113, title: 'Se7en', posterUrl: 'https://image.tmdb.org/t/p/w500/6yoghtyTpznpBik8EngEmJskVPh.jpg', rating: 8.6,
        year: 1995, genre: 'Polisiye, Gerilim', director: 'David Fincher', runtime: '127 dk',
        overview: 'Biri tecrübeli diğeri yeni yetme iki dedektif, kurbanlarını Yedi Ölümcül Günah\'a göre seçen ve öldüren vahşi bir seri katilin peşine düşer.'
    },
    {
        id: 114, title: 'The Silence of the Lambs', posterUrl: 'https://image.tmdb.org/t/p/w500/uS9m8OBk1A8eM9I042bx8XXpqAq.jpg', rating: 8.6,
        year: 1991, genre: 'Gerilim, Polisiye', director: 'Jonathan Demme', runtime: '118 dk',
        overview: 'Genç bir FBI ajanı, "Buffalo Bill" ismindeki tehlikeli bir seri katili yakalayabilmek için, hapiste yatan dahi yamyam psikiyatrist Dr. Hannibal Lecter\'ın yardımına başvurur.'
    },
    {
        id: 115, title: 'Gladiator', posterUrl: 'https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRlsgwv4B.jpg', rating: 8.5,
        year: 2000, genre: 'Tarihi, Aksiyon', director: 'Ridley Scott', runtime: '155 dk',
        overview: 'Başarılı ve dürüst Romalı General Maximus, yozlaşmış yeni imparator tarafından ihanete uğratılıp ailesi katledildikten sonra gladyatör olarak intikam için Colosseum\'a döner.'
    },
    {
        id: 116, title: 'The Departed', posterUrl: 'https://image.tmdb.org/t/p/w500/zj1f0R2oPZ3Y2R84qAn2pEMkEAn.jpg', rating: 8.5,
        year: 2006, genre: 'Suç, Aksiyon', director: 'Martin Scorsese', runtime: '151 dk',
        overview: 'Güney Boston\'da geçen hikayede; mafyanın içine sızan bir gizli polis ile polis teşkilatının içine sızan bir köstebeğin hayatta kalabilmek için birbirlerini ifşa etme yarışı.'
    },
    {
        id: 117, title: 'The Prestige', posterUrl: 'https://image.tmdb.org/t/p/w500/tK1zy5BsCt1J4OzoDicXmr0UTFH.jpg', rating: 8.5,
        year: 2006, genre: 'Gizem, Bilim Kurgu', director: 'Christopher Nolan', runtime: '130 dk',
        overview: 'Victoria dönemi İngiltere\'sinde, bir zamanlar dost olan iki illüzyonist arasında ölümcül bir trajediyle başlayan sakatat edici, takıntı dolu bir rekabet ve sır mücadelesi.'
    },
    {
        id: 118, title: 'Memento', posterUrl: 'https://image.tmdb.org/t/p/w500/ywtZ27LgEX4aetw2b1Xb5N2P4A.jpg', rating: 8.4,
        year: 2000, genre: 'Gizem, Gerilim', director: 'Christopher Nolan', runtime: '113 dk',
        overview: 'Kısa süreli hafıza kaybı yaşayan bir adam, vücudundaki dövmeleri ve çektiği polaroid fotoğrafları kullanarak karısının katilini bulmaya çalışır.'
    },
    {
        id: 119, title: 'The Pianist', posterUrl: 'https://image.tmdb.org/t/p/w500/2hF6iCQGgXxcKbpeUBvQEXOvkd9.jpg', rating: 8.5,
        year: 2002, genre: 'Dram, Savaş', director: 'Roman Polanski', runtime: '150 dk',
        overview: 'İkinci Dünya Savaşı sırasında Nazi işgali altındaki Varşova\'da hayatta kalmaya çalışan ve müzik tutkusuyla nefes alan Polonyalı Yahudi bir yetenekli piyanistin destansı öyküsü.'
    },
    {
        id: 120, title: 'Parasite', posterUrl: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg', rating: 8.5,
        year: 2019, genre: 'Gerilim, Komedi', director: 'Bong Joon Ho', runtime: '132 dk',
        overview: 'Yoksulluk içinde yaşayan kurnaz bir ailenin üyeleri, son derece zengin bir ailenin hayatına sızarak yavaş yavaş evdeki hizmetçilerin yerlerini entrikalarla işgal etmeye başlar.'
    }
];

export function MovieGrid() {
    const { t } = useLanguage();
    const [watchlist, setWatchlist] = useState<number[]>([]);

    const toggleWatchlist = (id: number) => {
        setWatchlist(prev =>
            prev.includes(id) ? prev.filter(movieId => movieId !== id) : [...prev, id]
        );
    };

    return (
        <section className="w-full py-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <span className="w-1 h-8 bg-[#F5C518] rounded-full inline-block"></span>
                    {t('popularMovies') || 'Popüler Filmler'}
                </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
                {MOCK_MOVIES.map((movie) => {
                    const isAdded = watchlist.includes(movie.id);

                    return (
                        <div
                            key={movie.id}
                            className="flex flex-col bg-card dark:bg-[#1A1A1A] rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow group border border-border/40"
                        >
                            <div className="relative aspect-[2/3] overflow-hidden cursor-pointer">
                                <img
                                    src={movie.posterUrl}
                                    alt={movie.title}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    loading="lazy"
                                />
                                <div
                                    className="absolute top-0 left-0 bg-black/50 text-white p-1 backdrop-blur-sm cursor-pointer hover:bg-black/70 transition-colors"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleWatchlist(movie.id);
                                    }}
                                >
                                    {isAdded ? (
                                        <Check size={24} className="text-[#F5C518]" />
                                    ) : (
                                        <Plus size={24} className="hover:text-[#F5C518] transition-colors" />
                                    )}
                                </div>
                            </div>

                            <div className="p-3 flex flex-col flex-grow">
                                <div className="flex items-center gap-1.5 mb-2 text-sm text-foreground space-y-0.5">
                                    <Star className="fill-[#F5C518] text-[#F5C518]" size={16} />
                                    <span className="font-semibold">{movie.rating.toFixed(1)}</span>
                                </div>

                                <div className="flex-grow mb-3 flex flex-col items-start">
                                    <TooltipProvider delayDuration={200}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <h3 className="font-medium text-foreground text-sm line-clamp-2 leading-snug cursor-pointer hover:underline hover:text-[#F5C518] transition-colors text-left">
                                                    {movie.title}
                                                </h3>
                                            </TooltipTrigger>
                                            <TooltipContent
                                                side="top"
                                                className="w-72 p-4 bg-[#1E1E1E] border border-[#333] shadow-2xl z-[100] rounded-xl"
                                            >
                                                <div className="space-y-3">
                                                    <div>
                                                        <h4 className="font-bold text-white text-base leading-tight mb-1">{movie.title}</h4>
                                                        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 font-medium">
                                                            <span>{movie.year}</span>
                                                            <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                                                            <span>{movie.runtime}</span>
                                                            <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                                                            <span>{movie.genre}</span>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-gray-300 leading-relaxed font-normal">
                                                        {movie.overview}
                                                    </p>
                                                    <div className="pt-2 border-t border-gray-700/50">
                                                        <span className="text-xs text-gray-500">Yönetmen: </span>
                                                        <span className="text-xs text-gray-300 font-medium">{movie.director}</span>
                                                    </div>
                                                </div>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>

                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="secondary"
                                            className="w-full bg-secondary/50 dark:bg-[#2C2C2C] hover:bg-secondary dark:hover:bg-[#3C3C3C] text-foreground text-xs font-semibold py-1 h-9 transition-colors flex items-center gap-2"
                                        >
                                            <MessageSquare size={16} /> {t('comments') || 'Yorumlar'}
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md">
                                        <DialogHeader>
                                            <DialogTitle className="text-xl flex items-center gap-2">
                                                {t('writeComment') || 'Yorum Yaz'}
                                                <span className="text-muted-foreground text-sm font-normal">({movie.title})</span>
                                            </DialogTitle>
                                        </DialogHeader>
                                        <div className="flex flex-col gap-4 py-4">
                                            <Textarea
                                                placeholder={t('yourComment') || 'Bu film hakkında ne düşünüyorsun...'}
                                                className="min-h-[120px] resize-none"
                                            />
                                        </div>
                                        <DialogFooter>
                                            <Button type="submit" className="bg-[#F5C518] text-black hover:bg-[#F5C518]/80 font-semibold">
                                                {t('submitComment') || 'Gönder'}
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
