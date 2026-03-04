import { useState, useRef } from 'react';
import { Star, Plus, Check, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
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
export const MOCK_MOVIES = [
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

export const MOVIE_DATA = [
    {
        id: 1, title: 'Inception', posterUrl: 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg', rating: 8.8, year: 2010, genre: 'Bilim Kurgu, Aksiyon', director: 'Christopher Nolan', runtime: '148 dk',
        overview: 'Yetenekli bir hırsız olan Dom Cobb, kurbanlarının en savunmasız oldukları rüya anında bilinçaltlarına girerek sırlarını çalmaktadır. Ona son bir şans verilir: bu sefer bir fikri çalmak yerine ekmektir.'
    },
    {
        id: 2, title: 'The Matrix', posterUrl: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GvwBZZ4Zcz.jpg', rating: 8.7, year: 1999, genre: 'Aksiyon, Bilim Kurgu', director: 'Lana Wachowski, Lilly Wachowski', runtime: '136 dk',
        overview: 'Bir bilgisayar korsanı, gizemli isyancılardan dünyasının doğası hakkındaki gerçeği ve onu kontrol edenlere karşı rolünü öğrenir.'
    },
    {
        id: 3, title: 'Interstellar', posterUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MvrIdlsR.jpg', rating: 8.6, year: 2014, genre: 'Macera, Dram, Bilim Kurgu', director: 'Christopher Nolan', runtime: '169 dk',
        overview: 'Bir grup kaşif, insanlığın hayatta kalmasını sağlamak amacıyla, yakın zamanda keşfedilen bir solucan deliğini kullanarak yıldızlararası bir yolculuğa çıkar.'
    },
    {
        id: 4, title: 'The Dark Knight', posterUrl: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', rating: 9.0, year: 2008, genre: 'Aksiyon, Suç, Dram', director: 'Christopher Nolan', runtime: '152 dk',
        overview: 'Batman, Gotham City\'de suçla mücadeleyi bir adım öteye taşıdığında, Joker adında kargaşa saçan bir dehayla yüzleşmek zorunda kalır.'
    },
    {
        id: 5, title: 'Pulp Fiction', posterUrl: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPbOYKQwG2l.jpg', rating: 8.9, year: 1994, genre: 'Suç, Dram', director: 'Quentin Tarantino', runtime: '154 dk',
        overview: 'İki mafya tetikçisi, bir boksör, bir mafya babasının karısı ve iki soyguncunun yolları şiddet ve kefaret dolu bir hikayede kesişir.'
    }
];

export const TOP_RATED_MOVIES = [
    {
        id: 201, title: 'The Shawshank Redemption', posterUrl: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg', rating: 9.3,
        year: 1994, genre: 'Dram', director: 'Frank Darabont', runtime: '142 dk',
        overview: 'Karısını ve aşığını öldürmek suçundan ömür boyu hapse mahkum edilen saygın bankacı Andy Dufresne\'in, Shawshank Hapishanesi\'ndeki umut dolu direnişi.'
    },
    {
        id: 202, title: 'Schindler\'s List', posterUrl: 'https://image.tmdb.org/t/p/w500/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg', rating: 9.0,
        year: 1993, genre: 'Biyografi, Dram, Tarih', director: 'Steven Spielberg', runtime: '195 dk',
        overview: 'Alman işadamı Oskar Schindler\'in II. Dünya Savaşı sırasında fabrikasında çalıştırarak binlerce Yahudi\'nin hayatını kurtarmasını anlatan gerçek bir başyapıt.'
    },
    {
        id: 203, title: '12 Angry Men', posterUrl: 'https://image.tmdb.org/t/p/w500/ow3wq89wM8qd5X7hWKxiRfsFf9C.jpg', rating: 9.0,
        year: 1957, genre: 'Suç, Dram', director: 'Sidney Lumet', runtime: '96 dk',
        overview: 'Bir cinayet davasında jüri üyelerinin karar verme sürecini ve adaletin sorgulanmasını ustalıkla işleyen tek mekanda geçen gerilim.'
    },
    {
        id: 204, title: 'The Lord of the Rings: The Fellowship of the Ring', posterUrl: 'https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg', rating: 8.8,
        year: 2001, genre: 'Aksiyon, Macera, Dram', director: 'Peter Jackson', runtime: '178 dk',
        overview: 'Sauron\'un Tek Yüzük\'ünü yok etmek üzere yola çıkan Frodo Baggins ve yüzük kardeşliğinin karanlığa karşı başlayan destansı macerası.'
    },
    {
        id: 205, title: 'Pulp Fiction', posterUrl: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPbOYKQwG2l.jpg', rating: 8.9,
        year: 1994, genre: 'Suç, Dram', director: 'Quentin Tarantino', runtime: '154 dk',
        overview: 'Suç şebekesinin içinde yer alan birbirinden farklı karakterlerin kesişen ve doğrusal olmayan zaman çizgisi eşliğinde anlatılan kült hikayesi.'
    },
    {
        id: 206, title: 'Forrest Gump', posterUrl: 'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg', rating: 8.8,
        year: 1994, genre: 'Dram, Romantik', director: 'Robert Zemeckis', runtime: '142 dk',
        overview: 'Zekasiyla dalga geçilen ama pırıl pırıl bir kalbe sahip olan Forrest\'ın, tesadüflerle dolu bir şekilde Amerika tarihine damga vuruşu.'
    },
    {
        id: 207, title: 'Fight Club', posterUrl: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg', rating: 8.8,
        year: 1999, genre: 'Dram', director: 'David Fincher', runtime: '139 dk',
        overview: 'Uykusuzluk ve tüketim çılgınlığından bunalan bir adamın, sabun üreticisi karizmatik Tyler Durden ile tanıştıktan sonra bir yeraltı örgütü kurması.'
    },
    {
        id: 208, title: 'Inception', posterUrl: 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg', rating: 8.8,
        year: 2010, genre: 'Aksiyon, Macera, Bilim Kurgu', director: 'Christopher Nolan', runtime: '148 dk',
        overview: 'Uzman rüya hırsızı Dom Cobb ve ekibinin, bu defa hırsızlık yapmak yerine bir kişinin zihnine fikir ekmeye çalışması.'
    },
    {
        id: 209, title: 'The Lord of the Rings: The Two Towers', posterUrl: 'https://image.tmdb.org/t/p/w500/5VTN0pR8gcqV3EPUHHfMGnJYN9L.jpg', rating: 8.8,
        year: 2002, genre: 'Aksiyon, Macera, Dram', director: 'Peter Jackson', runtime: '179 dk',
        overview: 'Dağılan yüzük kardeşliği üyeleri farklı yönlerde karanlık güçlere karşı savaşırken, Frodo ve Sam yüzüğü Mordor\'a götürmek için Gollum ile yollarına devam eder.'
    },
    {
        id: 210, title: 'Star Wars: Episode V - The Empire Strikes Back', posterUrl: 'https://image.tmdb.org/t/p/w500/7BuH8itoSrLExs2GIrS21dccSQ.jpg', rating: 8.7,
        year: 1980, genre: 'Aksiyon, Macera, Fantastik', director: 'Irvin Kershner', runtime: '124 dk',
        overview: 'Asiler galaksinin ücra köşelerine saklanırken İmparatorluk amansız takibine devam eder; Luke Skywalker ise Yoda\'yı bulup eğitimini ilerletmeye çalışır.'
    },
    {
        id: 211, title: 'The Matrix', posterUrl: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GvwBZZ4Zcz.jpg', rating: 8.7,
        year: 1999, genre: 'Aksiyon, Bilim Kurgu', director: 'Wachowski Br.', runtime: '136 dk',
        overview: 'Yaşadığı dünyanın tamamen makineler ve yazılımlar tarafından simüle edildiğini öğrenen Hacker Neo\'nun gerçeğe ve isyana uyanışı.'
    },
    {
        id: 212, title: 'Goodfellas', posterUrl: 'https://image.tmdb.org/t/p/w500/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg', rating: 8.7,
        year: 1990, genre: 'Biyografi, Suç, Dram', director: 'Martin Scorsese', runtime: '145 dk',
        overview: 'Çocukluğundan beri mafya içinde yükselme hayali kuran Henry Hill\'in, New York mafyasındaki yükselişi ve kaçınılmaz dramatik düşüşü.'
    },
    {
        id: 213, title: 'One Flew Over the Cuckoo\'s Nest', posterUrl: 'https://image.tmdb.org/t/p/w500/3jcbjzN2b8E1Bqu8fA7FmJ3W8zV.jpg', rating: 8.7,
        year: 1975, genre: 'Dram', director: 'Milos Forman', runtime: '133 dk',
        overview: 'Cezaevinden kurtulmak için deli taklidi yapıp akıl hastanesine yatan McMurphy\'nin, otoriter Hemşire Ratched ile giriştiği efsanevi ego ve özgürlük mücadelesi.'
    },
    {
        id: 214, title: 'Se7en', posterUrl: 'https://image.tmdb.org/t/p/w500/6yoghtyTpznpBik8EngEmJskVPh.jpg', rating: 8.6,
        year: 1995, genre: 'Suç, Dram, Gizem', director: 'David Fincher', runtime: '127 dk',
        overview: 'Yedi ölümcül günah algısını temel alan zeki bir seri katili yakalamaya çalışan kibirli yeni bir dedektif ile tecrübeli ve bıkkın bir dedektifin kasvetli hikayesi.'
    },
    {
        id: 215, title: 'City of God', posterUrl: 'https://image.tmdb.org/t/p/w500/k7eYdWvhYQyRQoU233Aiy9M3F1s.jpg', rating: 8.6,
        year: 2002, genre: 'Suç, Dram', director: 'Fernando Meirelles', runtime: '130 dk',
        overview: 'Rio de Janeiro\'nun şiddet ve yoksulluk dolu varoşlarında büyüyen iki arkadaştan birinin fotoğrafçı, diğerinin acımasız bir uyuşturucu baronu olma yolu.'
    },
    {
        id: 216, title: 'Silence of the Lambs', posterUrl: 'https://image.tmdb.org/t/p/w500/uS9m8OBk1A8eM9I042bx8XXpqAq.jpg', rating: 8.6,
        year: 1991, genre: 'Suç, Dram, Gerilim', director: 'Jonathan Demme', runtime: '118 dk',
        overview: 'Genç bir FBI ajanı adayı olan Clarice Starling\'in, yeni bir seri katili yakalamak üzere tutuklu bulunan yamyam seri katil Dr. Hannibal Lecter\'dan yardım alması.'
    },
    {
        id: 217, title: 'It\'s a Wonderful Life', posterUrl: 'https://image.tmdb.org/t/p/w500/bSqt9rhDZx1Q7UZ86dBPKdNomp2.jpg', rating: 8.6,
        year: 1946, genre: 'Dram, Aile, Fantastik', director: 'Frank Capra', runtime: '130 dk',
        overview: 'Hayatındaki tüm olumsuzluklardan sonra intiharı düşünen dürüst bir adamın, melek Clarence tarafından hiç doğmasaydı dünyada nelerin eksik olacağını görmesi.'
    },
    {
        id: 218, title: 'Life Is Beautiful', posterUrl: 'https://image.tmdb.org/t/p/w500/mfnkSeeVOBVheuyn2lo4tfmOPQb.jpg', rating: 8.6,
        year: 1997, genre: 'Komedi, Dram, Romantik', director: 'Roberto Benigni', runtime: '116 dk',
        overview: 'II. Dünya Savaşı sırasında toplama kampına götürülen Yahudi bir babanın, küçük oğlundan gerçekleri saklamak için her şeyi bir oyunmuş gibi yaşatması.'
    },
    {
        id: 219, title: 'The Usual Suspects', posterUrl: 'https://image.tmdb.org/t/p/w500/bbfpYp9vU13xJOWzylqZ5F5z8yD.jpg', rating: 8.5,
        year: 1995, genre: 'Suç, Gizem, Gerilim', director: 'Bryan Singer', runtime: '106 dk',
        overview: 'Büyük bir gemi yangını ve katliam sonrasında hayatta kalan tek tanık olan Verbal Kint\'in, efsanevi suçlu Keyser Söze figürüne dayanan karmaşık hikayesini anlatması.'
    },
    {
        id: 220, title: 'Spirited Away', posterUrl: 'https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkBg8lWOb.jpg', rating: 8.6,
        year: 2001, genre: 'Animasyon, Macera, Aile', director: 'Hayao Miyazaki', runtime: '125 dk',
        overview: 'Ailesiyle birlikte yeni bir kasabaya taşınan küçük Chihiro\'nun, terk edilmiş gibi görünen büyülü ve gizemli bir dünyada ailesini kurtarmaya çalışması.'
    }
];

export const CATEGORIES = ['Aksiyon', 'Komedi', 'Korku', 'Bilim Kurgu', 'Romantik'];

export const CATEGORY_MOVIES = {
    'Aksiyon': [
        { id: 301, title: 'Die Hard', posterUrl: 'https://image.tmdb.org/t/p/w500/yFihWxQcmOcaCRrjYRoM1k5I2qm.jpg', rating: 8.2, year: 1988, genre: 'Aksiyon, Gerilim', director: 'John McTiernan', runtime: '132 dk', overview: 'New York polisi John McClane, karısının çalıştığı Nakatomi Plaza\'yı ele geçiren teröristlere karşı tek başına savaşır.' },
        { id: 302, title: 'Mad Max: Fury Road', posterUrl: 'https://image.tmdb.org/t/p/w500/8tZYtuWezp8JbcsvHYO0O46tFbo.jpg', rating: 8.1, year: 2015, genre: 'Aksiyon, Macera, Bilim Kurgu', director: 'George Miller', runtime: '120 dk', overview: 'Kıyamet sonrası çorak topraklarda, zalim bir yöneticiden kaçan bir kadın ve yalnız bir yolcunun soluksuz kaçışı.' },
        { id: 303, title: 'John Wick', posterUrl: 'https://image.tmdb.org/t/p/w500/fZPSd91yGE9fCcgEXSGqbHIqaZa.jpg', rating: 7.4, year: 2014, genre: 'Aksiyon, Suç, Gerilim', director: 'Chad Stahelski', runtime: '101 dk', overview: 'Eski bir tetikçi olan John Wick, ölen karısından yadigar kalan köpeğinin öldürülmesi üzerine intikam için yeraltı dünyasına geri döner.' },
        { id: 304, title: 'Gladiator', posterUrl: 'https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg', rating: 8.5, year: 2000, genre: 'Aksiyon, Macera, Dram', director: 'Ridley Scott', runtime: '155 dk', overview: 'İhanete uğrayıp ailesi katledilen Romalı General Maximus\'un köleliğe düşmesi ve gladyatör olarak intikam arayışı.' },
        { id: 305, title: 'The Terminator', posterUrl: 'https://image.tmdb.org/t/p/w500/qvktm0BHcnmDpul4Hz01GIazWPr.jpg', rating: 8.1, year: 1984, genre: 'Aksiyon, Bilim Kurgu', director: 'James Cameron', runtime: '107 dk', overview: 'Gelecekten gelen yenilmez bir cyborg olan Terminatör, gelecekteki isyan liderini doğuracak kadını öldürmek için geçmişe gönderilir.' },
        { id: 306, title: 'Léon: The Professional', posterUrl: 'https://image.tmdb.org/t/p/w500/yI6X2csqO12br9XmS0E8860xM50.jpg', rating: 8.5, year: 1994, genre: 'Aksiyon, Suç, Dram', director: 'Luc Besson', runtime: '110 dk', overview: 'Ailesi yozlaşmış polisler tarafından öldürülen 12 yaşındaki Mathilda\'nın, komşusu olan profesyonel tetikçi Léon\'a sığınması.' },
        { id: 307, title: 'Kill Bill: Vol. 1', posterUrl: 'https://image.tmdb.org/t/p/w500/v7TaX8kXj6TTAkS7O8T088EaJ1b.jpg', rating: 8.2, year: 2003, genre: 'Aksiyon, Suç, Gerilim', director: 'Quentin Tarantino', runtime: '111 dk', overview: 'Düğün günü eski patronu ve suikastçı ekibi tarafından komaya sokulan "Gelin" lakaplı kadının intikam yolculuğu.' },
        { id: 308, title: 'Avengers: Endgame', posterUrl: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg', rating: 8.4, year: 2019, genre: 'Aksiyon, Macera, Bilim Kurgu', director: 'Anthony Russo, Joe Russo', runtime: '181 dk', overview: 'Thanos\'un evrenin yarısını yok etmesinden sonra geride kalan Yenilmezler\'in, her şeyi geri döndürmek için son bir çaba göstermesi.' },
        { id: 309, title: 'The Bourne Identity', posterUrl: 'https://image.tmdb.org/t/p/w500/1XbHwR8XvM0hR3c2iK76Q5U2fI9.jpg', rating: 7.9, year: 2002, genre: 'Aksiyon, Gizem, Gerilim', director: 'Doug Liman', runtime: '119 dk', overview: 'Hafızasını kaybeden ve çeşitli suikastçı becerilerine sahip olduğunu fark eden Jason Bourne\'un kimliğini arayışı.' },
        { id: 310, title: 'Mission: Impossible - Fallout', posterUrl: 'https://image.tmdb.org/t/p/w500/AkJQpZp9yWFSP9X5amakJ8UXYB.jpg', rating: 7.7, year: 2018, genre: 'Aksiyon, Macera, Gerilim', director: 'Christopher McQuarrie', runtime: '147 dk', overview: 'Ethan Hunt ve IMF ekibinin, ters giden bir görevin ardından plütonyum çekirdeklerini geri alma yarışı.' },
    ],
    'Komedi': [
        { id: 401, title: 'The Big Lebowski', posterUrl: 'https://image.tmdb.org/t/p/w500/pE0E7k2vBtsu1IerWzUjR3QOtsR.jpg', rating: 8.1, year: 1998, genre: 'Komedi, Suç', director: 'Joel Coen, Ethan Coen', runtime: '117 dk', overview: '"The Dude" Lebowski, aynı adı taşıyan bir milyonerle karıştırılır ve işler çığrından çıkar.' },
        { id: 402, title: 'Superbad', posterUrl: 'https://image.tmdb.org/t/p/w500/ek8e8txUyUwd2BNqj6lFEerwH9U.jpg', rating: 7.6, year: 2007, genre: 'Komedi', director: 'Greg Mottola', runtime: '113 dk', overview: 'Liseyi bitirmek üzere olan iki arkadaşın, bir partiye alkol sokma çabası ve absürt olaylar silsilesi.' },
        { id: 403, title: 'Dumb and Dumber', posterUrl: 'https://image.tmdb.org/t/p/w500/z0I5gBsvtdWki0S5C1a2Nl28JzF.jpg', rating: 7.3, year: 1994, genre: 'Komedi', director: 'Peter Farrelly, Bobby Farrelly', runtime: '107 dk', overview: 'İyi niyetli ama son derece aptal iki arkadaş, bir çanta dolusu parayı sahibine ulaştırmak için ülkeyi baştan başa geçerler.' },
        { id: 404, title: 'The Grand Budapest Hotel', posterUrl: 'https://image.tmdb.org/t/p/w500/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg', rating: 8.1, year: 2014, genre: 'Komedi, Dram', director: 'Wes Anderson', runtime: '99 dk', overview: 'Ünlü bir Avrupa otelinin efsanevi concierge\'i ve onun en güvendiği genç çalışanı etrafında dönen renkli ve absürt bir hikaye.' },
        { id: 405, title: 'Shaun of the Dead', posterUrl: 'https://image.tmdb.org/t/p/w500/xW1hPBBEnmD9fIqSjVq7hC83B8e.jpg', rating: 7.9, year: 2004, genre: 'Komedi, Korku', director: 'Edgar Wright', runtime: '99 dk', overview: 'Hayatında amacı olmayan Shaun\'un, zombi kıyameti sırasında sevdiklerini korumaya çalışma çabası.' },
        { id: 406, title: 'Monty Python and the Holy Grail', posterUrl: 'https://image.tmdb.org/t/p/w500/yOpOpQk8B0qikRjO7I60SOf0wQ.jpg', rating: 8.2, year: 1975, genre: 'Komedi, Macera, Fantastik', director: 'Terry Gilliam, Terry Jones', runtime: '91 dk', overview: 'Kral Arthur ve şövalyelerinin Kutsal Kase\'yi bulmak için çıktıkları absürt ve komik fantastik macera.' },
        { id: 407, title: 'Anchorman: The Legend of Ron Burgundy', posterUrl: 'https://image.tmdb.org/t/p/w500/fR7D5f2tX8FjebTj0gHk9w4zZKT.jpg', rating: 7.1, year: 2004, genre: 'Komedi', director: 'Adam McKay', runtime: '94 dk', overview: '70\'lerin en popüler televizyon haber spikeri Ron Burgundy\'nin hayatı, kadın bir sunucunun ekibe katılmasıyla altüst olur.' },
        { id: 408, title: 'The Truman Show', posterUrl: 'https://image.tmdb.org/t/p/w500/vuSAJoqM1Tz14KIf2S1Tms0B8d.jpg', rating: 8.2, year: 1998, genre: 'Komedi, Dram', director: 'Peter Weir', runtime: '103 dk', overview: 'Hayatının devasa bir televizyon programı olduğunu bilmeden yaşayan Truman Burbank\'in gerçeği fark edişi.' },
        { id: 409, title: 'Tropic Thunder', posterUrl: 'https://image.tmdb.org/t/p/w500/aHkGBz2qRIVvP3R7BqZJ2hWdY2D.jpg', rating: 7.1, year: 2008, genre: 'Komedi, Aksiyon', director: 'Ben Stiller', runtime: '107 dk', overview: 'Savaş filmi çekimi sırasında aktörlerin gerçek bir tehlikenin içine düşerek hayatta kalma çabaları.' },
        { id: 410, title: 'Groundhog Day', posterUrl: 'https://image.tmdb.org/t/p/w500/xS12999eSIVZ8fiv1A1wZ2JpUWa.jpg', rating: 8.1, year: 1993, genre: 'Komedi, Dram, Fantastik', director: 'Harold Ramis', runtime: '101 dk', overview: 'Sürekli olarak aynı günü baştan yaşamak zorunda kalan kaba ve bıkkın bir hava durumu sunucusunun değişimi.' },
    ],
    'Korku': [
        { id: 501, title: 'The Shining', posterUrl: 'https://image.tmdb.org/t/p/w500/9fgh3Ns1iRzlFwTqD11Xy3mQ1Xo.jpg', rating: 8.4, year: 1980, genre: 'Korku, Gerilim', director: 'Stanley Kubrick', runtime: '146 dk', overview: 'Kışın kapalı olan bir otelde çalışmaya giden Jack Torrance ve ailesinin izolasyon içinde yaşadığı delilik ve doğaüstü kabus.' },
        { id: 502, title: 'Psycho', posterUrl: 'https://image.tmdb.org/t/p/w500/81d8oyEFgjJFaSlXjDDIKCj2i.jpg', rating: 8.5, year: 1960, genre: 'Korku, Gizem, Gerilim', director: 'Alfred Hitchcock', runtime: '109 dk', overview: 'Para çalıp kaçan bir sekreterin ıssız Bates Motel\'de duraklamasıyla gelişen rahatsız edici olaylar serisi.' },
        { id: 503, title: 'Alien', posterUrl: 'https://image.tmdb.org/t/p/w500/t0e56B8oDXXvS4M4F4K9t780F.jpg', rating: 8.5, year: 1979, genre: 'Korku, Bilim Kurgu', director: 'Ridley Scott', runtime: '117 dk', overview: 'Ticari bir uzay gemisi mürettebatının, bilinmeyen bir gezegende buldukları ölümcül uzaylı canlıya karşı yaşam mücadelesi.' },
        { id: 504, title: 'The Exorcist', posterUrl: 'https://image.tmdb.org/t/p/w500/8gVd4IfvX4p84K8E0zFp8A5eJ09.jpg', rating: 8.1, year: 1973, genre: 'Korku', director: 'William Friedkin', runtime: '122 dk', overview: 'Şeytan tarafından ele geçirilen 12 yaşındaki küçük bir kızın amansız kurtarılma mücadelesi.' },
        { id: 505, title: 'Get Out', posterUrl: 'https://image.tmdb.org/t/p/w500/tXxtXkY9I8wZ5R953qF2J1fUqW4.jpg', rating: 7.7, year: 2017, genre: 'Korku, Gizem, Gerilim', director: 'Jordan Peele', runtime: '104 dk', overview: 'Afrikalı Amerikalı bir genç adamın, beyaz kız arkadaşının ailesini ziyaret ettiği hafta sonunun kabusa dönüşmesi.' },
        { id: 506, title: 'Hereditary', posterUrl: 'https://image.tmdb.org/t/p/w500/4c4Gq17BivEwRymQ68J4FvdfH95.jpg', rating: 7.3, year: 2018, genre: 'Korku, Dram, Gizem', director: 'Ari Aster', runtime: '127 dk', overview: 'Ailenin büyüğü olan büyükannenin ölümünün ardından geride kalanların karanlık ve kaçınılmaz bir mirasla yüzleşmesi.' },
        { id: 507, title: 'A Nightmare on Elm Street', posterUrl: 'https://image.tmdb.org/t/p/w500/5s1Q1Z4bY6jX5D9rFfUfBqH8F.jpg', rating: 7.4, year: 1984, genre: 'Korku', director: 'Wes Craven', runtime: '91 dk', overview: 'Rüyalarda cinayet işleyerek gerçek hayatta da gençleri öldüren doğaüstü katil Freddy Krueger\'ın terörü.' },
        { id: 508, title: 'The Thing', posterUrl: 'https://image.tmdb.org/t/p/w500/wMymsEYZz8yKjWzS4TfX2sHlRQs.jpg', rating: 8.2, year: 1982, genre: 'Korku, Gizem, Bilim Kurgu', director: 'John Carpenter', runtime: '109 dk', overview: 'Antarktika\'da araştırma yapan bir ekibin, her şekle girebilen uzaylı bir organizmayla dehşet dolu kapana kısılmışlık hissi.' },
        { id: 509, title: 'Scream', posterUrl: 'https://image.tmdb.org/t/p/w500/aK9Wk1W0X7T9k3qO4gM8X5iG8E.jpg', rating: 7.4, year: 1996, genre: 'Korku, Gizem', director: 'Wes Craven', runtime: '111 dk', overview: 'Korku filmi klişelerini gerçeğe dönüştürerek gençleri hedef alan Ghostface kod adlı maskeli katilin etrafındaki olaylar.' },
        { id: 510, title: 'Halloween', posterUrl: 'https://image.tmdb.org/t/p/w500/z0I5gBsvtdWki0S5C1a2Nl28JzF.jpg', rating: 7.7, year: 1978, genre: 'Korku, Gerilim', director: 'John Carpenter', runtime: '91 dk', overview: 'Cadılar Bayramı gecesi ablasını öldürdükten 15 yıl sonra akıl hastanesinden kaçıp memleketine dönen Michael Myers\'ın dehşeti.' },
    ],
    'Bilim Kurgu': [
        { id: 601, title: 'Blade Runner 2049', posterUrl: 'https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg', rating: 8.0, year: 2017, genre: 'Bilim Kurgu, Dram, Aksiyon', director: 'Denis Villeneuve', runtime: '164 dk', overview: 'Genç bir Bıçak Sırtı ajanı (Blade Runner), eski bir efsane olan Rick Deckard\'a ulaşmasını gerektiren, uzun süredir saklı bir sırrı ortaya çıkarır.' },
        { id: 602, title: 'Dune: Part One', posterUrl: 'https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg', rating: 8.0, year: 2021, genre: 'Bilim Kurgu, Macera, Aksiyon', director: 'Denis Villeneuve', runtime: '155 dk', overview: 'Gelecekte aristokratik ailelerin galaksiyi yönettiği bir dönemde, çöl gezegeni Arrakis\'in kontrolünü sağlamak üzere yola çıkan soylu ailenin güç mücadelesi.' },
        { id: 603, title: 'Arrival', posterUrl: 'https://image.tmdb.org/t/p/w500/hE24GYjIQeD0T3WbEma2P6f3I.jpg', rating: 7.9, year: 2016, genre: 'Bilim Kurgu, Dram, Gizem', director: 'Denis Villeneuve', runtime: '116 dk', overview: 'Dünya\'nın çeşitli yerlerine devasa uzay gemileri inince, onlarla iletişim kurmak ve niyetlerini öğrenmek üzere bir dilbilimcinin askeri ekibe katılması.' },
        { id: 604, title: 'WALL·E', posterUrl: 'https://image.tmdb.org/t/p/w500/5kKVXEJ0Y2zC3P2eD9pZqJb8z2G.jpg', rating: 8.4, year: 2008, genre: 'Animasyon, Bilim Kurgu, Aile', director: 'Andrew Stanton', runtime: '98 dk', overview: 'İnsanlığın terk ettiği çöp dolu dünyada yalnız başına temizlik yapan bir robot olan WALL-E\'nin, EVE adında bir keşif robotunu takip ederek uzayda umut araması.' },
        { id: 605, title: 'Ex Machina', posterUrl: 'https://image.tmdb.org/t/p/w500/aHkGBz2qRIVvP3R7BqZJ2hWdY2D.jpg', rating: 7.7, year: 2014, genre: 'Bilim Kurgu, Psikolojik Gerilim', director: 'Alex Garland', runtime: '108 dk', overview: 'Zeki bir yazılımcının, CEO\'su olan dahi mucidin dağ evine davet edilmesiyle, dünyanın ilk yapay zekasına sahip dişi androidine uygulanan Turing testi.' },
        { id: 606, title: '2001: A Space Odyssey', posterUrl: 'https://image.tmdb.org/t/p/w500/5oZpI27o2tKj9w0h0h3F1Wb5b4e.jpg', rating: 8.3, year: 1968, genre: 'Bilim Kurgu, Macera', director: 'Stanley Kubrick', runtime: '149 dk', overview: 'İnsanlığın evrimine müdahale eden esrarengiz siyah monolitlerin keşfi sonrası, Jüpiter\'e düzenlenen ve HAL 9000 yapay zekasıyla çıkılan varoluşsal yolculuk.' },
        { id: 607, title: 'Back to the Future', posterUrl: 'https://image.tmdb.org/t/p/w500/7lyBcpYB0Qt8gYhXYaEZUNlNQpz.jpg', rating: 8.5, year: 1985, genre: 'Bilim Kurgu, Komedi, Macera', director: 'Robert Zemeckis', runtime: '116 dk', overview: 'Dr. Emmett Brown\'ın icat ettiği zaman makinesiyle 1955 yılına giden lise öğrencisi Marty McFly\'ın kendi varlığını kurtarma telaşı.' },
        { id: 608, title: 'Minority Report', posterUrl: 'https://image.tmdb.org/t/p/w500/m1NqRjQzP4g9P890A9gB7e3E21b.jpg', rating: 7.7, year: 2002, genre: 'Bilim Kurgu, Aksiyon, Suç', director: 'Steven Spielberg', runtime: '145 dk', overview: 'Suçların sezgilerle öngörülüp daha yaşanmadan durdurulduğu bir gelecekte, bu özel birliğin komutanının bir cinayet işleyeceğinin öngörülmesiyle kaşması.' },
        { id: 609, title: 'E.T. the Extra-Terrestrial', posterUrl: 'https://image.tmdb.org/t/p/w500/aK9Wk1W0X7T9k3qO4gM8X5iG8E.jpg', rating: 7.9, year: 1982, genre: 'Bilim Kurgu, Aile, Macera', director: 'Steven Spielberg', runtime: '115 dk', overview: 'Dünyada unutulan masum ve yalnız bir uzaylıya yardım ederek onu evine göndermeye çalışan bir çocuğun sevgi dolu macerası.' },
        { id: 610, title: 'Children of Men', posterUrl: 'https://image.tmdb.org/t/p/w500/8tZYtuWezp8JbcsvHYO0O46tFbo.jpg', rating: 7.9, year: 2006, genre: 'Bilim Kurgu, Dram, Gerilim', director: 'Alfonso Cuarón', runtime: '109 dk', overview: '2027 yılında insanlığın kısırlaştığı kaotik bir distopyada, mucizevi bir şekilde hamile kalmış tek kadını korumaya çalışan bıkkın bir bürokrat.' },
    ],
    'Romantik': [
        { id: 701, title: 'La La Land', posterUrl: 'https://image.tmdb.org/t/p/w500/uDO8zWDhfWwvFdKS4fqiXlc1h.jpg', rating: 8.0, year: 2016, genre: 'Romantik, Müzikal, Dram', director: 'Damien Chazelle', runtime: '128 dk', overview: 'Büyük hayaller kuran bir caz piyanisti ile oyuncu adayı bir kızın Los Angeles\'ta yollarının kesişmesi ve aşkla kariyerleri arasındaki amansız çekişme.' },
        { id: 702, title: 'Eternal Sunshine of the Spotless Mind', posterUrl: 'https://image.tmdb.org/t/p/w500/5MwkWH9tYOsTGZThwWg20G.jpg', rating: 8.3, year: 2004, genre: 'Romantik, Bilim Kurgu, Dram', director: 'Michel Gondry', runtime: '108 dk', overview: 'Bitmiş bir ilişkinin ardından acıdan kurtulmak için birbirlerini zihinlerinden sildirmeye çalışan bir çiftin parçalanan ve yeniden doğan hatıraları.' },
        { id: 703, title: 'The Notebook', posterUrl: 'https://image.tmdb.org/t/p/w500/6y0QWZQ6K02aRQO6qO5P04B8Dq.jpg', rating: 7.8, year: 2004, genre: 'Romantik, Dram', director: 'Nick Cassavetes', runtime: '123 dk', overview: 'II. Dünya Savaşı yıllarında başlayan, sosyal sınıfların karşı koyduğu büyük bir aşkın, yaşlı bir adamın anı defterinden okunan ölümsüz öyküsü.' },
        { id: 704, title: 'Before Sunrise', posterUrl: 'https://image.tmdb.org/t/p/w500/c7D6XqR728H7eLwD3M9Z4.jpg', rating: 8.1, year: 1995, genre: 'Romantik, Dram', director: 'Richard Linklater', runtime: '101 dk', overview: 'Avrupa treninde tesadüfen tanışan Amerikalı Jesse ve Fransız Céline\'in, Viyana sokaklarında aşka ve hayata dair sadece kelimelerle örülü sabahlık sohbetleri.' },
        { id: 705, title: 'Pride and Prejudice', posterUrl: 'https://image.tmdb.org/t/p/w500/1XbHwR8XvM0hR3c2iK76Q5U2fI9.jpg', rating: 7.8, year: 2005, genre: 'Romantik, Dram', director: 'Joe Wright', runtime: '129 dk', overview: '18. yüzyıl İngiltere\'sinde onurlu ama ön yargılı Elizabeth Bennet ile kibirli Bay Darcy\'nin sınıfsal farklılıklara karşı filizlenen yoğun çekimi.' },
        { id: 706, title: 'Titanic', posterUrl: 'https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg', rating: 7.9, year: 1997, genre: 'Romantik, Dram, Facia', director: 'James Cameron', runtime: '194 dk', overview: 'Batmaz denen ikonik geminin trajik ilk yolculuğunda asilzadelerden bunalmış Rose ile fakir ressam Jack arasında yaşanan yüzyılın aşk hikayesi.' },
        { id: 707, title: 'Notting Hill', posterUrl: 'https://image.tmdb.org/t/p/w500/hE24GYjIQeD0T3WbEma2P6f3I.jpg', rating: 7.2, year: 1999, genre: 'Romantik, Komedi', director: 'Roger Michell', runtime: '124 dk', overview: 'Londra\'da sıradan bir kitabevi sahibi olan William Thacker\'ın hayatının, dükkanına dünyanın en ünlü aktrisinin girmesiyle peri masalına dönüşmesi.' },
        { id: 708, title: 'Lost in Translation', posterUrl: 'https://image.tmdb.org/t/p/w500/6y0QWZQ6K02aRQO6qO5P04B8Dq.jpg', rating: 7.7, year: 2003, genre: 'Romantik, Dram, Komedi', director: 'Sofia Coppola', runtime: '102 dk', overview: 'Farklı yaş ve dünyalardan gelen iki yalnız Amerikalının, Tokyo\'nun kültürel yabancılığında, gecenin bitmez tükenmez saatlerinde buldukları melankolik yoldaşlık.' },
        { id: 709, title: 'About Time', posterUrl: 'https://image.tmdb.org/t/p/w500/2L2P.jpg', rating: 7.8, year: 2013, genre: 'Romantik, Dram, Fantastik', director: 'Richard Curtis', runtime: '123 dk', overview: 'Zamanda geriye yolculuk yapabilme yeteneğini keşfeden genç bir adamın, hayatını ve sevgilisiyle ilişkisini kusursuzlaştırma çabasının iç burkan gerçekleri.' },
        { id: 710, title: 'Amélie', posterUrl: 'https://image.tmdb.org/t/p/w500/mfnkSeeVOBVheuyn2lo4tfmOPQb.jpg', rating: 8.3, year: 2001, genre: 'Romantik, Komedi', director: 'Jean-Pierre Jeunet', runtime: '122 dk', overview: 'Paris\'te kendi masalsı ve saf dünyasında yaşayan garson Amélie\'nin, gizlice çevresindeki insanların hayatını düzeltirken kendi yalnızlığını da sarsacak aşkı bulması.' },
    ]
};

export function MovieGrid() {
    const { t } = useLanguage();
    const [watchlist, setWatchlist] = useState<number[]>(() => {
        try {
            const saved = localStorage.getItem('filmlog_watchlist');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            return [];
        }
    });

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const scrollTopRatedRef = useRef<HTMLDivElement>(null);
    const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    const toggleWatchlist = (id: number) => {
        setWatchlist(prev => {
            const newList = prev.includes(id)
                ? prev.filter(movieId => movieId !== id)
                : [...prev, id];
            localStorage.setItem('filmlog_watchlist', JSON.stringify(newList));
            return newList;
        });
    };

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -800, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 800, behavior: 'smooth' });
        }
    };

    const scrollTopRatedLeft = () => {
        if (scrollTopRatedRef.current) {
            scrollTopRatedRef.current.scrollBy({ left: -800, behavior: 'smooth' });
        }
    };

    const scrollTopRatedRight = () => {
        if (scrollTopRatedRef.current) {
            scrollTopRatedRef.current.scrollBy({ left: 800, behavior: 'smooth' });
        }
    };

    const scrollCategoryLeft = (category: string) => {
        if (categoryRefs.current[category]) {
            categoryRefs.current[category]?.scrollBy({ left: -800, behavior: 'smooth' });
        }
    };

    const scrollCategoryRight = (category: string) => {
        if (categoryRefs.current[category]) {
            categoryRefs.current[category]?.scrollBy({ left: 800, behavior: 'smooth' });
        }
    };

    return (
        <section className="w-full py-8 relative flex flex-col gap-6 z-10">
            <div className="w-full">
                <div className="flex items-center justify-between mb-6 px-4 md:px-0">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <span className="w-1 h-8 bg-[#F5C518] rounded-full inline-block"></span>
                        {t('popularMovies') || 'En Çok İzlenenler'}
                    </h2>
                </div>

                <div className="relative group px-4 md:px-0">
                    <button
                        onClick={scrollLeft}
                        className="absolute left-2 md:-left-5 top-[calc(50%-1.5rem)] -translate-y-1/2 z-40 p-2 md:p-3 rounded-full bg-black/50 text-white hover:bg-black/90 hover:text-[#F5C518] transition-all opacity-0 group-hover:opacity-100 backdrop-blur-md shadow-2xl disabled:opacity-0"
                    >
                        <ChevronLeft size={30} strokeWidth={2.5} />
                    </button>

                    <div
                        ref={scrollContainerRef}
                        className="flex overflow-x-auto gap-4 md:gap-6 pb-6 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                    >
                        {MOCK_MOVIES.map((movie) => {
                            const isAdded = watchlist.includes(movie.id);

                            return (
                                <div
                                    key={movie.id}
                                    className="flex-none w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-1rem)] md:w-[calc(25%-1.125rem)] lg:w-[calc(16.666%-1.25rem)] flex flex-col bg-card dark:bg-[#1A1A1A] rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow group border border-border/40 snap-start"
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

                                    <div className="p-3 flex flex-col flex-grow gap-2">
                                        {/* 1. SATIR: Film İsmi */}
                                        <TooltipProvider delayDuration={200}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <h3 className="font-medium text-foreground text-sm line-clamp-1 cursor-pointer hover:underline hover:text-[#F5C518] transition-colors text-left leading-tight">
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

                                        {/* 2. SATIR: Puanla (Click) ve Yorumla (Click) (Bilgi + Aksiyon Bir Arada) */}
                                        <div className="flex items-center gap-4 text-xs text-gray-400 font-medium mb-1 pl-1">
                                            {/* PUAN ve PUANLAMA (Click - Dialog) */}
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <div className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer" title="Puanlamak için tıklayın">
                                                        <Star className="fill-[#F5C518] text-[#F5C518]" size={15} />
                                                        <span className="text-foreground">{movie.rating.toFixed(1)}</span>
                                                    </div>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-md flex flex-col items-center justify-center p-8">
                                                    <DialogHeader className="w-full flex flex-col items-center text-center mb-4">
                                                        <Star className="fill-[#F5C518] text-[#F5C518] w-12 h-12 mx-auto mb-2" />
                                                        <h2 className="text-sm text-[#F5C518] font-semibold uppercase tracking-wider mb-1 text-center w-full">{t('rateThis') || 'BU FİLMİ PUANLA'}</h2>
                                                        <DialogTitle className="text-2xl font-bold text-white text-center w-full">
                                                            {movie.title}
                                                        </DialogTitle>
                                                    </DialogHeader>
                                                    <div className="flex flex-row-reverse justify-center w-full gap-1 group/rating py-6">
                                                        {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(star => (
                                                            <Star
                                                                key={star}
                                                                size={32}
                                                                className="text-gray-600 cursor-pointer transition-colors peer hover:fill-[#F5C518] hover:text-[#F5C518] peer-hover:fill-[#F5C518] peer-hover:text-[#F5C518]"
                                                            />
                                                        ))}
                                                    </div>
                                                    <Button className="mt-8 bg-[#333] hover:bg-[#444] text-white w-full max-w-[200px] h-12 rounded-full font-semibold transition-colors">
                                                        {t('rate') || 'Rate'}
                                                    </Button>
                                                </DialogContent>
                                            </Dialog>

                                            {/* YORUM SAYISI ve YORUM YAPMA (Tıklama) */}
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <div className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer" title="Yorumları Okuyun veya Yorum Yazın">
                                                        <MessageSquare size={14} className="text-sky-400" />
                                                        <span className="text-foreground">{Math.floor(movie.id / 3) || 12}</span>
                                                    </div>
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
                                </div>
                            );
                        })}
                    </div>

                    <button
                        onClick={scrollRight}
                        className="absolute right-2 md:-right-5 top-[calc(50%-1.5rem)] -translate-y-1/2 z-40 p-2 md:p-3 rounded-full bg-black/50 text-white hover:bg-black/90 hover:text-[#F5C518] transition-all opacity-0 group-hover:opacity-100 backdrop-blur-md shadow-2xl disabled:opacity-0"
                    >
                        <ChevronRight size={30} strokeWidth={2.5} />
                    </button>
                </div>
            </div>

            {/* TOP RATED (EN YÜKSEK PUANLILAR) SLİDER */}
            <div className="w-full pt-4">
                <div className="flex items-center justify-between mb-6 px-4 md:px-0">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <span className="w-1 h-8 bg-[#F5C518] rounded-full inline-block"></span>
                        {t('topRated') || 'En Yüksek Puanlılar'}
                    </h2>
                </div>

                <div className="relative group px-4 md:px-0">
                    <button
                        onClick={scrollTopRatedLeft}
                        className="absolute left-2 md:-left-5 top-[calc(50%-1.5rem)] -translate-y-1/2 z-40 p-2 md:p-3 rounded-full bg-black/50 text-white hover:bg-black/90 hover:text-[#F5C518] transition-all opacity-0 group-hover:opacity-100 backdrop-blur-md shadow-2xl disabled:opacity-0"
                    >
                        <ChevronLeft size={30} strokeWidth={2.5} />
                    </button>

                    <div
                        ref={scrollTopRatedRef}
                        className="flex overflow-x-auto gap-4 md:gap-6 pb-6 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                    >
                        {TOP_RATED_MOVIES.map((movie) => {
                            const isInWatchlist = watchlist.includes(movie.id);

                            return (
                                <div
                                    key={movie.id}
                                    className="flex-none w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-1rem)] md:w-[calc(25%-1.125rem)] lg:w-[calc(16.666%-1.25rem)] xl:w-[calc(16.666%-1.25rem)] flex flex-col bg-card dark:bg-transparent rounded-sm overflow-hidden group snap-start"
                                >
                                    {/* POSTER KISMI */}
                                    <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-[#222]">
                                        <img
                                            src={movie.posterUrl}
                                            alt={movie.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                                        {/* Watchlist İkonu (Sol Üst) */}
                                        <div
                                            className="absolute top-0 left-0 hover:bg-black/60 cursor-pointer p-0 m-0 z-20 group/watchlist overflow-hidden"
                                            onClick={() => toggleWatchlist(movie.id)}
                                            style={{
                                                width: '32px',
                                                height: '42px',
                                            }}
                                        >
                                            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 85%, 0 100%)' }}></div>
                                            <div className="absolute inset-x-0 top-0 bottom-0 text-white flex justify-center pt-2">
                                                {isInWatchlist ? (
                                                    <Check size={20} strokeWidth={2.5} className="text-white drop-shadow-md" />
                                                ) : (
                                                    <Plus size={20} strokeWidth={2.5} className="text-white drop-shadow-md group-hover/watchlist:scale-110 transition-transform" />
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* ALT BİLGİ KISMI - TEK SATIR (Film ismi), ALT SATIR (Puan + Yorum) */}
                                    <div className="pt-2 pb-1 flex flex-col gap-1 w-full relative group">
                                        <TooltipProvider delayDuration={300}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <h3 className="font-semibold text-foreground text-sm line-clamp-1 text-left w-full hover:underline decoration-1 cursor-pointer underline-offset-2">
                                                        {movie.title}
                                                    </h3>
                                                </TooltipTrigger>
                                                <TooltipContent side="bottom" align="start" className="w-[300px] p-0 border-[#333] shadow-xl bg-[#1A1A1A] z-[99]">
                                                    <div className="flex flex-col">
                                                        <div className="px-4 py-3 bg-[#2A2A2A] rounded-t-md border-b border-[#333]">
                                                            <div className="font-bold text-white text-base mb-1">{movie.title}</div>
                                                            <div className="text-xs text-gray-400 font-medium flex items-center gap-2">
                                                                <span>{movie.year}</span>
                                                                <span className="w-1 h-1 bg-gray-600 rounded-full inline-block"></span>
                                                                <span>{movie.runtime}</span>
                                                                <span className="w-1 h-1 bg-gray-600 rounded-full inline-block"></span>
                                                                <span>{movie.rating}</span>
                                                            </div>
                                                        </div>
                                                        <div className="px-4 py-3 pb-4">
                                                            <p className="text-sm text-gray-300 leading-relaxed font-normal mb-3">
                                                                {movie.overview}
                                                            </p>
                                                            <div className="flex text-xs flex-col gap-1">
                                                                <span className="text-gray-500 font-medium tracking-wide">Yönetmen</span>
                                                                <span className="text-xs text-gray-300 font-medium">{movie.director}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>

                                        {/* 2. SATIR: Puanla (Click) ve Yorumla (Click) (Bilgi + Aksiyon Bir Arada) */}
                                        <div className="flex items-center gap-4 text-xs text-gray-400 font-medium mb-1 pl-1">
                                            {/* PUAN ve PUANLAMA (Click - Dialog) */}
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <div className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer" title="Puanlamak için tıklayın">
                                                        <Star className="fill-[#F5C518] text-[#F5C518]" size={15} />
                                                        <span className="text-foreground">{movie.rating.toFixed(1)}</span>
                                                    </div>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-md flex flex-col items-center justify-center p-8">
                                                    <DialogHeader className="w-full flex flex-col items-center text-center mb-4">
                                                        <Star className="fill-[#F5C518] text-[#F5C518] w-12 h-12 mx-auto mb-2" />
                                                        <h2 className="text-sm text-[#F5C518] font-semibold uppercase tracking-wider mb-1 text-center w-full">{t('rateThis') || 'BU FİLMİ PUANLA'}</h2>
                                                        <DialogTitle className="text-2xl font-bold text-white text-center w-full">
                                                            {movie.title}
                                                        </DialogTitle>
                                                    </DialogHeader>
                                                    <div className="flex flex-row-reverse justify-center w-full gap-1 group/rating py-6">
                                                        {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(star => (
                                                            <Star
                                                                key={star}
                                                                size={32}
                                                                className="text-gray-600 cursor-pointer transition-colors peer hover:fill-[#F5C518] hover:text-[#F5C518] peer-hover:fill-[#F5C518] peer-hover:text-[#F5C518]"
                                                            />
                                                        ))}
                                                    </div>
                                                    <Button className="mt-8 bg-[#333] hover:bg-[#444] text-white w-full max-w-[200px] h-12 rounded-full font-semibold transition-colors">
                                                        {t('rate') || 'Puanla'}
                                                    </Button>
                                                </DialogContent>
                                            </Dialog>

                                            {/* YORUM SAYISI ve YORUM YAPMA (Tıklama) */}
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <div className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer" title="Yorumları Okuyun veya Yorum Yazın">
                                                        <MessageSquare size={14} className="text-sky-400" />
                                                        <span className="text-foreground">{Math.floor(movie.id / 3) || 12}</span>
                                                    </div>
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
                                </div>
                            );
                        })}
                    </div>

                    <button
                        onClick={scrollTopRatedRight}
                        className="absolute right-2 md:-right-5 top-[calc(50%-1.5rem)] -translate-y-1/2 z-40 p-2 md:p-3 rounded-full bg-black/50 text-white hover:bg-black/90 hover:text-[#F5C518] transition-all opacity-0 group-hover:opacity-100 backdrop-blur-md shadow-2xl disabled:opacity-0"
                    >
                        <ChevronRight size={30} strokeWidth={2.5} />
                    </button>
                </div>
            </div>

            {/* DİNAMİK KATEGORİ (CATEGORY_MOVIES) SLİDER'LARI */}
            {
                CATEGORIES.map(category => (
                    <div key={category} id={`category-${category}`} className="w-full pt-4 scroll-mt-24">
                        <div className="flex items-center justify-between mb-6 px-4 md:px-0">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <span className="w-1 h-8 bg-[#F5C518] rounded-full inline-block"></span>
                                {category}
                            </h2>
                        </div>

                        <div className="relative group px-4 md:px-0">
                            <button
                                onClick={() => scrollCategoryLeft(category)}
                                className="absolute left-2 md:-left-5 top-[calc(50%-1.5rem)] -translate-y-1/2 z-40 p-2 md:p-3 rounded-full bg-black/50 text-white hover:bg-black/90 hover:text-[#F5C518] transition-all opacity-0 group-hover:opacity-100 backdrop-blur-md shadow-2xl disabled:opacity-0"
                            >
                                <ChevronLeft size={30} strokeWidth={2.5} />
                            </button>

                            <div
                                ref={(el) => { categoryRefs.current[category] = el; }}
                                className="flex overflow-x-auto gap-4 md:gap-6 pb-6 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                            >
                                {CATEGORY_MOVIES[category as keyof typeof CATEGORY_MOVIES].map((movie) => {
                                    const isInWatchlist = watchlist.includes(movie.id);

                                    return (
                                        <div
                                            key={movie.id}
                                            className="flex-none w-[130px] md:w-[140px] lg:w-[140px] xl:w-[142px] snap-start flex flex-col bg-card dark:bg-transparent rounded-sm overflow-hidden group"
                                        >
                                            {/* POSTER KISMI */}
                                            <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-[#222]">
                                                <img
                                                    src={movie.posterUrl}
                                                    alt={movie.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    loading="lazy"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                                                {/* Watchlist İkonu (Sol Üst) */}
                                                <div
                                                    className="absolute top-0 left-0 hover:bg-black/60 cursor-pointer p-0 m-0 z-20 group/watchlist overflow-hidden"
                                                    onClick={() => toggleWatchlist(movie.id)}
                                                    style={{ width: '32px', height: '42px' }}
                                                >
                                                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 85%, 0 100%)' }}></div>
                                                    <div className="absolute inset-x-0 top-0 bottom-0 text-white flex justify-center pt-2">
                                                        {isInWatchlist ? (
                                                            <Check size={20} strokeWidth={2.5} className="text-white drop-shadow-md" />
                                                        ) : (
                                                            <Plus size={20} strokeWidth={2.5} className="text-white drop-shadow-md group-hover/watchlist:scale-110 transition-transform" />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* ALT BİLGİ KISMI - TEK SATIR (Film ismi), ALT SATIR (Puan + Yorum) */}
                                            <div className="pt-2 pb-1 flex flex-col gap-1 w-full relative group">
                                                <TooltipProvider delayDuration={300}>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <h3 className="font-semibold text-foreground text-sm line-clamp-1 text-left w-full hover:underline decoration-1 cursor-pointer underline-offset-2">
                                                                {movie.title}
                                                            </h3>
                                                        </TooltipTrigger>
                                                        <TooltipContent side="bottom" align="start" className="w-[300px] p-0 border-[#333] shadow-xl bg-[#1A1A1A] z-[99]">
                                                            <div className="flex flex-col">
                                                                <div className="px-4 py-3 bg-[#2A2A2A] rounded-t-md border-b border-[#333]">
                                                                    <div className="font-bold text-white text-base mb-1">{movie.title}</div>
                                                                    <div className="text-xs text-gray-400 font-medium flex items-center gap-2">
                                                                        <span>{movie.year}</span>
                                                                        <span className="w-1 h-1 bg-gray-600 rounded-full inline-block"></span>
                                                                        <span>{movie.runtime}</span>
                                                                        <span className="w-1 h-1 bg-gray-600 rounded-full inline-block"></span>
                                                                        <span>{movie.rating}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="px-4 py-3 pb-4">
                                                                    <p className="text-sm text-gray-300 leading-relaxed font-normal mb-3">
                                                                        {movie.overview}
                                                                    </p>
                                                                    <div className="flex text-xs flex-col gap-1">
                                                                        <span className="text-gray-500 font-medium tracking-wide">Yönetmen</span>
                                                                        <span className="text-xs text-gray-300 font-medium">{movie.director}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>

                                                {/* 2. SATIR: Puanla (Click) ve Yorumla (Click) (Bilgi + Aksiyon Bir Arada) */}
                                                <div className="flex items-center gap-4 text-xs text-gray-400 font-medium mb-1 pl-1">
                                                    {/* PUAN ve PUANLAMA (Click - Dialog) */}
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <div className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer" title="Puanlamak için tıklayın">
                                                                <Star className="fill-[#F5C518] text-[#F5C518]" size={15} />
                                                                <span className="text-foreground">{movie.rating.toFixed(1)}</span>
                                                            </div>
                                                        </DialogTrigger>
                                                        <DialogContent className="sm:max-w-md flex flex-col items-center justify-center p-8">
                                                            <DialogHeader className="w-full flex flex-col items-center text-center mb-4">
                                                                <Star className="fill-[#F5C518] text-[#F5C518] w-12 h-12 mx-auto mb-2" />
                                                                <h2 className="text-sm text-[#F5C518] font-semibold uppercase tracking-wider mb-1 text-center w-full">{t('rateThis') || 'BU FİLMİ PUANLA'}</h2>
                                                                <DialogTitle className="text-2xl font-bold text-white text-center w-full">
                                                                    {movie.title}
                                                                </DialogTitle>
                                                            </DialogHeader>
                                                            <div className="flex flex-row-reverse justify-center w-full gap-1 group/rating py-6">
                                                                {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(star => (
                                                                    <Star
                                                                        key={star}
                                                                        size={32}
                                                                        className="text-gray-600 cursor-pointer transition-colors peer hover:fill-[#F5C518] hover:text-[#F5C518] peer-hover:fill-[#F5C518] peer-hover:text-[#F5C518]"
                                                                    />
                                                                ))}
                                                            </div>
                                                            <Button className="mt-8 bg-[#333] hover:bg-[#444] text-white w-full max-w-[200px] h-12 rounded-full font-semibold transition-colors">
                                                                {t('rate') || 'Puanla'}
                                                            </Button>
                                                        </DialogContent>
                                                    </Dialog>

                                                    {/* YORUM SAYISI ve YORUM YAPMA (Tıklama) */}
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <div className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer" title="Yorumları Okuyun veya Yorum Yazın">
                                                                <MessageSquare size={14} className="text-sky-400" />
                                                                <span className="text-foreground">{Math.floor(movie.id / 3) || 12}</span>
                                                            </div>
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
                                        </div>
                                    );
                                })}
                            </div>

                            <button
                                onClick={() => scrollCategoryRight(category)}
                                className="absolute right-2 md:-right-5 top-[calc(50%-1.5rem)] -translate-y-1/2 z-40 p-2 md:p-3 rounded-full bg-black/50 text-white hover:bg-black/90 hover:text-[#F5C518] transition-all opacity-0 group-hover:opacity-100 backdrop-blur-md shadow-2xl disabled:opacity-0"
                            >
                                <ChevronRight size={30} strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>
                ))
            }

        </section >
    );
}
