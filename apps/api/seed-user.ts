import { PrismaClient } from '@onlyjs/db/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst();
  let userId;

  if (!user) {
    const newUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        name: 'Test User',
        gender: 'MALE',
        emailVerified: true
      }
    });
    userId = newUser.id;
    console.log('Created user:', userId);
  } else {
    userId = user.id;
    console.log('Found user:', userId);
  }

  const movie = await prisma.movie.findFirst();
  let movieId;

  if (!movie) {
    const newMovie = await prisma.movie.create({
      data: {
        title: 'The Matrix',
        description: 'A computer hacker learns from mysterious rebels about the true nature of his reality.',
        releaseYear: 1999
      }
    });
    movieId = newMovie.id;
    console.log('Created movie:', movieId);
  } else {
    movieId = movie.id;
    console.log('Found movie:', movieId);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
