"use client";

import { FC } from "react";
import { useChatContext } from "./chat-context";
import { ChatMessageEmptyState } from "./chat-empty-state/chat-message-empty-state";
import ChatInput from "./chat-input/chat-input";
import { ChatMessageContainer } from "./chat-message-container";

interface Prop {}

const PDFFileViewer: FC = () => {
  const { chatBody, messages } = useChatContext();

  if (chatBody.chatType !== "data" || messages.length === 0) {
    return null;
  }

  return (
    <div className="flex-1 w-full">
      <object
        data={`/api/file/${chatBody.chatOverFileName}`}
        type="application/pdf"
        width="100%"
        height="100%"
      >
        <p>
          Unable to display PDF file. <a href="sample.pdf">Download</a> instead.
        </p>
      </object>
    </div>
  );
};

export const ChatUI: FC<Prop> = () => {
  const { messages } = useChatContext();

  return (
    <div className="flex w-full">
      <div className="h-full relative overflow-hidden bg-card rounded-md shadow-md flex-1">
        {messages.length !== 0 ? (
          <>
            <ChatMessageContainer />
          </>
        ) : (
          <ChatMessageEmptyState />
        )}
        <ChatInput />
      </div>
      <PDFFileViewer />
    </div>
  );
};
