import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

async function seedData() {
    await prisma.cat.deleteMany();
    await prisma.dog.deleteMany();
    await prisma.cat.createMany({
        data: [
            { name: 'Whiskers1', age: 4, breed: 'American Shorthair' },
            { name: 'Whiskers2', age: 5, breed: 'Bengal' },
            { name: 'Whiskers3', age: 6, breed: 'Siamese' },
            { name: 'Whiskers4', age: 7, breed: 'Maine Coon' },
            { name: 'Whiskers5', age: 3, breed: 'Abyssinian' },
        ],
    });

    await prisma.dog.createMany({
        data: [
            { name: 'Buddy1', age: 5, breed: 'Golden Retriever' },
            { name: 'Buddy2', age: 6, breed: 'German Shephard' },
            { name: 'Buddy3', age: 7, breed: 'Shiba' },
            { name: 'Buddy4', age: 8, breed: 'French Bulldog' },
            { name: 'Buddy5', age: 9, breed: 'Labrador Retriever' }
        ],
    });

    console.log('Data seeded successfully!');
}



seedData()
    .catch((error) => {
        console.error('Error seeding data:', error);
    })
    .finally(() => {
        prisma.$disconnect();
    });
