import { useRef, useState } from "react";
import { ChatConversations } from "./ChatConversations";
import { ChatInput } from "./ChatInput";
import { IChatUIProps } from "../../types";
import {Select } from "react-daisyui";

export const ChatUI = ({
  disabled,
  conversations,
  isQuerying,
  customSubmitIcon,
  placeholder,
  onSubmit,
}: IChatUIProps) => {
  const chatConversationsContainerRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState('groq');
  const selectRef = useRef<HTMLSelectElement>(null); // Crea una reference per Select

  return (
    <div style={{ height: "calc(100vh - 68px)" }}>
      <div className="flex w-full component-preview p-4 items-center justify-center gap-2 font-sans">
      <Select ref={selectRef} value={value} onChange={event => {setValue(event.target.value)}}>
        <Select.Option value={'default'} disabled>
          Select model host
        </Select.Option>
        <Select.Option value={'ollama'}>ollama</Select.Option>
        <Select.Option value={'groq'}>groq</Select.Option>
      </Select>
    </div>
      <div
        ref={chatConversationsContainerRef}
        className="flex w-full justify-center overflow-y-auto pb-8"
        style={{ maxHeight: "calc(100vh - 250px)" }}
      >
        <ChatConversations
          conversations={conversations}
          isQuerying={isQuerying}
          chatConversationsContainerRef={chatConversationsContainerRef}
        />
      </div>
      <div className="absolute bottom-12 left-0 w-full">
        <ChatInput
          disabled={disabled}
          customSubmitIcon={customSubmitIcon}
          onSubmit={onSubmit}
          selectRef={selectRef}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};
