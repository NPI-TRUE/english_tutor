import { useRef, useState, useEffect } from "react";
import { ChatConversations } from "./ChatConversations";
import { ChatInput } from "./ChatInput";
import { IChatUIProps } from "../../types";
import { Select, Toggle, Button } from "react-daisyui";

export const ChatUI = ({
  disabled,
  setIsQuerying,
  conversations,
  isQuerying,
  customSubmitIcon,
  placeholder,
  onSubmit,
  toggle,
  setToggle,
}: IChatUIProps) => {
  const url = import.meta.env.VITE_REACT_APP_URL;
  const chatConversationsContainerRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState('groq');
  const selectRef = useRef<HTMLSelectElement>(null); // Crea una reference per Select
  const [ollamaModel, setOllamaModel] = useState<string[]>([]);
  const [clear_session_loading, setClearSessionLoading] = useState(false);

  const fetch_ollama_model = async () => {
    let models: { tags: string[] } = JSON.parse(await (await fetch(url + "/api/v1/getOllamaTags")).text());
    setOllamaModel(models.tags);
  }

  useEffect(() => {
    fetch_ollama_model();
  }, []);

  const clear_session = async () => {
    setClearSessionLoading(true);
    await fetch(url + "/api/v1/clear_session", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
    });
    document.cookie = 'session_id=; Max-Age=0; path=/; domain=' + window.location.hostname;
    setClearSessionLoading(false);
    window.location.reload();
  }

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
      <label className="p-4">Autoplay</label>
      <Toggle onChange={() => setToggle(!toggle)} checked={toggle} style={{"marginLeft": "-10px"}} className="m-2" />
      <Button loading={clear_session_loading} onClick={() => clear_session()} style={{"marginLeft": "10%"}} color="error">
        Esci
      </Button>
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
          toggle={toggle}
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
        />
      </div>
    </div>
  );
};
