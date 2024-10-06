import { useCallback, useEffect, useState } from "react";
import { MessageRole } from "./enums/MessageRole";
import { Conversations } from "./types";
import { ChatUI } from "./components/chat-ui/ChatUI";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMailReply } from "@fortawesome/free-solid-svg-icons";
import { v4 as uuidv4 } from 'uuid';

const TEST_USER_INFO = { firstName: "Test", lastName: "User" };

interface ChatMessage {
  role: string;
  content: string;
}

function App() {
  const url = import.meta.env.VITE_REACT_APP_URL;
  const [isQuerying, setIsQuerying] = useState<boolean>(false);
  const [toggle, setToggle] = useState(true);

  const [chatConversations, setChatConversations] = useState<Conversations>([
    {
      id: "1",
      role: MessageRole.ASSISTANT,
      message: "Hi, I'm a chatbot programmed to help you learn English, start by asking me a question.",
    },
  ]);

  useEffect(() => {
    (async () => {
      const res = await await fetch(`${url}/api/v1/get_chat_history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      const val = await res.text();
      const jsonVal = JSON.parse(val);

      setChatConversations(jsonVal);
    })();
  }, []);

  const create_audio = useCallback(async (val: string, id: string, idChat: string) => {
    const res_audio = await fetch(`${url}/api/v1/audio/fast`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: val, idChat: idChat }),
      credentials: 'include',
    });

    const audioBlob = await res_audio.blob();

    setChatConversations((prevConversations) =>
      prevConversations.map((conversation) => {
        if (conversation.id === id) {
          return { ...conversation, audioFile: audioBlob, audioQuerying: false };
        }
        return conversation;
      })
    );
  }, []);

  const handleSubmit = useCallback(async (value: string, model_type: string) => {
    setIsQuerying(true);
    
    setChatConversations((conversations) => [
      ...conversations,
      {
        userInfo: TEST_USER_INFO,
        id: (conversations.length + 1).toString(),
        role: MessageRole.USER,
        message: value,
      },
    ]);

    const res = await fetch(`${url}/api/v1/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: value, model_type: model_type }),
      credentials: 'include',
    });

    const valText = await res.text()
    const val_real = JSON.parse(valText);
    const val = val_real.model_response;
    const id = val_real.id;

    setIsQuerying(false);
    const new_id = (uuidv4()).toString();

    setChatConversations((conversations) => [
      ...conversations,
      {
        id: new_id,
        role: MessageRole.ASSISTANT,
        message: String(val),
        audioQuerying: true,
      },
    ]);
    
    create_audio(val, new_id, id);
  }, []);

  

  return (
    <ChatUI
      isQuerying={isQuerying}
      setIsQuerying={setIsQuerying}
      onSubmit={handleSubmit}
      placeholder="Type here to interact with this demo"
      disabled={isQuerying}
      conversations={chatConversations}
      customSubmitIcon={<FontAwesomeIcon icon={faMailReply} />}
      toggle={toggle}
      setToggle={setToggle}
    />
  );
}

export default App;
