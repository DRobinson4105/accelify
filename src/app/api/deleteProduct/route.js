import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
import cookie from 'cookie'


const prisma = new PrismaClient();

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'your-secret-key'

export async function POST(request){
    try {
        const { productName, companyID, Implemented} = await request.json();

        const query = await prisma.product.findFirst({
            where: {
                name : productName
            }})

        if(!query){
            return NextResponse.json(
                { error: "No Product Found" },
                { status: 400 }
                );
        }
        const delQuery = await prisma.productOnCompany.findFirst({
            where: {
                productId : query.id,
                companyId : companyID
            }});

        if(!delQuery){
            return NextResponse.json(
                { error: "No Company with that product." },
                { status: 400 }
              );
        }

        await prisma.productOnCompany.delete({
            where: {
                productId : query.id,
                companyId : companyID,
            }});

    } catch(err){
        console.error("deletion error");
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}