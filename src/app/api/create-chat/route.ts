import { NextResponse } from 'next/server';
import { loadS3IntoPinecone } from '@/lib/pinecone';
import { getS3Url } from '@/lib/s3';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { file_key, file_name, user_id } = body;
    console.log(file_key, file_name);
    await loadS3IntoPinecone(file_key);
    console.log("uploaded successfully to pinecone");

    const chat = await prisma.chat.create({
      data: {
        fileKey: file_key,
        pdfName: file_name,
        pdfUrl: getS3Url(file_key),
      },
    });

    return NextResponse.json(
      {
        chat_id: chat.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
}