import { useRef, useState, useEffect } from "react";
import { ChatConversations } from "./ChatConversations";
import { ChatInput } from "./ChatInput";
import { IChatUIProps } from "../../types";
import { Select } from "react-daisyui";

export const ChatUI = ({
  disabled,
  setIsQuerying,
  conversations,
  isQuerying,
  customSubmitIcon,
  placeholder,
  onSubmit,
  url,
}: IChatUIProps) => {
  const chatConversationsContainerRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState('groq');
  const selectRef = useRef<HTMLSelectElement>(null); // Crea una reference per Select
  const [ollamaModel, setOllamaModel] = useState<string[]>([]);

  const fetch_ollama_model = () => {
    fetch("http://192.168.1.145:11434/api/tags")
    .then(response => response.json())
    .then(data => {
      data.models.forEach((model: { name: string }) => {
        setOllamaModel(prevOllamaModel => {
          if (!prevOllamaModel.includes(model.name)) {
            return [...prevOllamaModel, model.name];
          } else return prevOllamaModel;
        });
      });
    });
  }

  useEffect(() => {
    fetch_ollama_model();
  }, []);

  return (
    <div style={{ height: "calc(100vh - 68px)" }}>
      <div className="flex w-full component-preview p-4 items-center justify-center gap-2 font-sans">
      <Select ref={selectRef} value={value} onChange={event => {setValue(event.target.value)}}>
        <Select.Option value={'default'} disabled>
          Select model host
        </Select.Option>
        {
          ollamaModel.map((model) => {
            return <Select.Option value={model} key={model}>ollama/{model}</Select.Option>
          })
        }
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
          model_type={value}
          url={url}
        />
      </div>
      <div className="absolute bottom-12 left-0 w-full">
        <ChatInput
          disabled={disabled}
          setIsQuerying={setIsQuerying}
          customSubmitIcon={customSubmitIcon}
          onSubmit={onSubmit}
          selectRef={selectRef}
          placeholder={placeholder}
          url={url}
        />
      </div>
    </div>
  );
};
