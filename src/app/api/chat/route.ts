import { Configuration, OpenAIApi } from "openai-edge";
import { Message} from "ai";
import { getContext } from "@/lib/context";
import { NextResponse } from "next/server";
import { prisma } from '@/lib/db';
export const runtime = "edge";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

export async function POST(req: Request) {
  try {
    const { messages, chatId} = await req.json();

    const chat = await prisma.chat.findUnique({
        where: { id: chatId },
        select: { fileKey: true }
    });
  
    if (!chat) {
    return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }
  
    const { fileKey } = chat;


    const lastMessage = messages[messages.length - 1];
    const context = await getContext(lastMessage.content, fileKey);

    const prompt = {
      role: "system",
      content: `AI assistant is a brand new, powerful, human-like artificial intelligence.
      The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
      START CONTEXT BLOCK
      ${context}
      END OF CONTEXT BLOCK
      AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
      If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
      AI assistant will not invent anything that is not drawn directly from the context.
      `,
    };

    const response = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: [
        prompt,
        ...messages.filter((message: Message) => message.role === "user"),
      ],
      stream: true,
    });
    
    
    return response;
  } catch (error) {
    console.error("Error in chat completion:", error);
    return NextResponse.json({ error: "An error occurred during chat completion" }, { status: 500 });
  }
}