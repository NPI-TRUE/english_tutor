import { RefObject } from "react";

/** defining data types **/

export type User = {
  firstName: string;
  lastName: string;
  avatarUrl?: string;
};

export type Message = {
  id: string;
  role: MessageRole;
  message: string;
  userInfo?: User;
  audioFile?: File | Blob;
  audioQuerying?: boolean;
};

export type Conversations = Array<Message>;

/** defining component interfaces **/

export interface IChatUIProps {
  isQuerying: boolean;
  onSubmit: (value: string, model_type: string) => Promise<void>;
  placeholder: string;
  disabled: boolean;
  conversations: Conversations;
  customSubmitIcon?: ReactNode;
  url: string;
}

export interface IChatInputProps {
  disabled: boolean;
  onSubmit: (value: string, model_type: string) => Promise<void>
  placeholder: string;
  customSubmitIcon?: ReactNode;
  selectRef: RefObject<HTMLSelectElement>;
}

export interface IChatConversationsProps {
  conversations: Conversations;
  isQuerying: boolean;
  chatConversationsContainerRef: RefObject<HTMLDivElement>;
  model_type: string;
  url: string;
}

export interface IChatMessageProps {
  message: Message;
  model_type: string;
  url: string;
}
