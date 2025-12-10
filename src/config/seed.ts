import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    const data = [
        {
            courier_code: "sicepat",
            name: "Sicepat Express",
            description: "Minimal fee: Rp. 2000",
            minimal_fee: 2000
        },
        {
            courier_code: "pos",
            name: "POS IND",
            description: "Minimal fee: Rp. 2000",
            minimal_fee: 2000
        },
    ];

    for (const item of data) {
        await prisma.special_expedition.upsert({
            where: { courier_code: item.courier_code },
            update: {
                name: item.name,
                description: item.description,
                minimal_fee: item.minimal_fee,
            },
            create: item
        });
    }
}

main()
    .then(async () => {
        console.log("Seeded successfully insert/update");
    })
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
