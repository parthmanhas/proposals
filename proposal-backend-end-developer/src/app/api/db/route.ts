import { NextResponse } from 'next/server';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const bodySchema = z.array(
    z.object({
        table: z.union([z.literal('cat'), z.literal('dog')]),
        action: z.object({
            create: z.array(z.object({
                name: z.string().min(3),
                age: z.number().min(0),
                breed: z.string().min(3)
            })).min(1).optional(),
            delete: z.array(z.object({
                id: z.number().min(0)
            })).min(1).optional(),
            update: z.array(z.object({
                id: z.number().min(0),
                name: z.string().min(3).optional(),
                age: z.number().min(0).optional(),
                breed: z.string().min(3).optional()
            })).min(1).optional(),
        }).refine(
            (action) => action.create || action.delete || action.update,
            {
                message: "At least one action (create, delete, or update) must be present",
            }
        ),
    })
);
type BodySchema = z.infer<typeof bodySchema>;

async function performAction(validatedBody: BodySchema) {
    for (const { table, action } of validatedBody) {
        if (action.create && action.create.length > 0) {
            await prisma[table].createMany({
                data: action.create
            });
        }
        if (action.delete && action.delete.length > 0) {
            for (const payload of action.delete) {
                table === 'cat' && await prisma.cat.delete({
                    where: {
                        id: payload.id
                    }
                });
                table === 'dog' && await prisma.dog.delete({
                    where: {
                        id: payload.id
                    }
                })
            }
        }
        if (action.update && action.update.length > 0) {
            for (const payload of action.update) {
                table === 'cat' && await prisma.cat.update({
                    data: payload,
                    where: {
                        id: payload.id
                    }
                });
                table === 'dog' && await prisma.dog.update({
                    data: payload,
                    where: {
                        id: payload.id
                    }
                })
            }
        }
    }
}

export async function POST(request: Request, response: Response) {

    try {
        const body = await request.json();
        const validatedBody = bodySchema.parse(body);
        performAction(validatedBody);
        return NextResponse.json({ message: 'action performed' }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}