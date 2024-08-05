import ChatComponent from "@/components/ChatComponent";
import PDFViewer from "@/components/PDFViewer";
import React from "react";
import { prisma } from '@/lib/db';

type Props = {
  params: {
    chatId: string;
  };
};

const ChatPage = async ({ params: { chatId } }: Props) => {

    const currentChat = await prisma.chat.findUnique({
        where: {
          id: parseInt(chatId)
        }
      });
    
      if (!currentChat) {
        return <div>Chat not found</div>;
      }

  return (
    <div className="flex max-h-screen overflow-scroll">
      <div className="flex w-full max-h-screen overflow-scroll">
        {/* pdf viewer */}
        <div className="max-h-screen p-4 oveflow-scroll flex-[5]">
          <PDFViewer pdf_url={currentChat?.pdfUrl || ""} />
        </div>
        {/* chat component */}
        <div className="flex-[3] border-l-4 border-l-slate-200">
          <ChatComponent chatId={parseInt(chatId)} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;