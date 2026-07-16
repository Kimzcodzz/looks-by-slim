import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const appointment = await prisma.appointment.create({
      data: {
        service: body.service,
        date: new Date(body.date),
        time: body.time,
        fullName: body.fullName,
        phone: body.phone,
        email: body.email,
        instagram: body.instagram,
        notes: body.notes,
      },
    });

    return NextResponse.json(
      {
        success: true,
        appointment,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to create appointment",
      },
      { status: 500 }
    );
  }
}