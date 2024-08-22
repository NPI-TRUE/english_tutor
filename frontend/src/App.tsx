import { useCallback, useState } from "react";
import { MessageRole } from "./enums/MessageRole";
import { Conversations } from "./types";
import { ChatUI } from "./components/chat-ui/ChatUI";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMailReply } from "@fortawesome/free-solid-svg-icons";

const TEST_USER_INFO = { firstName: "Test", lastName: "User" };
function App() {
  const url = 'http://localhost:5000'
  const [isQuerying, setIsQuerying] = useState<boolean>(false);

  const [chatConversations, setChatConversations] = useState<Conversations>([
    {
      id: "1",
      role: MessageRole.ASSISTANT,
      message:
        "I am a sample chat ui made by Kevin Wong (@pragmaticgeek).  This is a demo on how to build a simple React chat ui from scratch.",
    }
  ]);

  const create_audio = useCallback(async (val: string, id: string) => {
    const res_audio = await fetch(url + '/api/v1/audio', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: val }),
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

  const handleSubmit = useCallback(async (value: string) => {
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

    const res = await fetch(url + '/api/v1/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: value }),
    });

    const val = await res.text()

    setIsQuerying(false);
    const new_id = (Date.now()).toString();
    
    setChatConversations((conversations) => [
      ...conversations,
      {
        id: new_id,
        role: MessageRole.ASSISTANT,
        message: String(val),
        audioQuerying: true,
      },
    ]);

    create_audio(val, new_id);
  }, []);

  return (
    <ChatUI
      isQuerying={isQuerying}
      onSubmit={handleSubmit}
      placeholder="Type here to interact with this demo"
      disabled={isQuerying}
      conversations={chatConversations}
      customSubmitIcon={<FontAwesomeIcon icon={faMailReply} />}
    />
  );
}

export default App;
