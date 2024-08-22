import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Loading } from "react-daisyui";
import {
  faClipboard,
  faRobot,
  faUser,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import { Avatar, Button } from "react-daisyui";
import { IChatMessageProps } from "../../types";
import { MessageRole } from "../../enums/MessageRole";
import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";

export const ChatMessage = ({ message }: IChatMessageProps) => {
  const messageRef = useRef<HTMLDivElement>(null);
  const [, copy] = useCopyToClipboard();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const isBot = message.role !== MessageRole.USER;

  const play_audio = (audioFile: Blob) => {
    if (!audioRef.current) {
      const audioURL = URL.createObjectURL(audioFile);
      audioRef.current = new Audio(audioURL);
    }

    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="mt-4">
      <div className="flex items-center">
        <Avatar shape="circle" className="mr-4">
          <div className="bg-neutral text-neutral-content h-10 w-10">
            {isBot ? (
              <FontAwesomeIcon icon={faRobot} />
            ) : message.userInfo?.firstName && message.userInfo?.lastName ? (
              <span>{`${message.userInfo.firstName.charAt(
                0
              )}${message.userInfo.lastName.charAt(0)}`}</span>
            ) : (
              <FontAwesomeIcon icon={faUser} />
            )}
          </div>
        </Avatar>
        <h4 className="font-semibold select-none">{isBot ? "Robot" : "You"}</h4>
      </div>
      <div className="ml-16 mt-4">
        <div ref={messageRef}>{message.message}</div>
        {isBot && (
          <div className="mt-4">
            <Button size="sm" shape="square" color="ghost">
              <FontAwesomeIcon
                icon={faClipboard}
                onClick={() => copy(messageRef?.current?.innerHTML || "")}
              />
            </Button>
            {!message.audioQuerying && <Button size="sm" shape="square" color="ghost">
              <FontAwesomeIcon
                icon={faPlay}
                onClick={() => {
                  if (message.audioFile) {
                    play_audio(message.audioFile);
                  } else {
                    console.error("Audio file is not defined");
                  }
                }}
              />
            </Button>}
            {
              message.audioQuerying && <Loading className="mt-4 ml-16" variant="dots" size="sm" />
            }
          </div>
        )}
      </div>
    </div>
  );
};
