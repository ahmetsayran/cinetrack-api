import prisma from "@onlyjs/db";

async function main() {
    console.log("Creating user...");
    const user = await prisma.user.create({
        data: {
            email: "test.user@example.com",
            firstName: "Test",
            lastName: "User",
            name: "Test User",
            gender: "MALE",
            emailVerified: true,
        }
    });

    console.log("User created with ID:", user.id);

    console.log("Creating movie...");
    const movie = await prisma.movie.create({
        data: {
            title: "The Matrix",
            description: "A computer hacker learns from mysterious rebels about the true nature of his reality.",
            releaseYear: 1999
        }
    });

    console.log("Movie created with ID:", movie.id);

    console.log("Done!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
