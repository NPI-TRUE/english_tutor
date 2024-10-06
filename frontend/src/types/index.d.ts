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
  audioName?: string;
  audioQuerying?: boolean;
  audioFetch?: boolean;
};

export type Conversations = Array<Message>;

/** defining component interfaces **/

export interface IChatUIProps {
  isQuerying: boolean;
  setIsQuerying: (isQuerying: boolean) => void;
  onSubmit: (value: string, model_type: string) => Promise<void>;
  placeholder: string;
  disabled: boolean;
  conversations: Conversations;
  customSubmitIcon?: ReactNode;
  toggle: boolean;
  setToggle: (toggle: boolean) => void;
}

export interface IChatInputProps {
  disabled: boolean;
  setIsQuerying: (isQuerying: boolean) => void;
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
  toggle: boolean;
}

export interface IChatMessageProps {
  message: Message;
  model_type: string;
  toggle: boolean;
}
