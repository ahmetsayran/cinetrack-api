import { HeroBanner } from './components/hero-banner';
import { MovieGrid } from './components/movie-grid';

export default function Dashboard() {
  return (
    <>
      <div className="flex flex-col h-full w-full gap-8">
        <HeroBanner />
        <MovieGrid />
      </div>
    </>
  );
}