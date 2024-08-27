import { useRef, useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Loading, Avatar, Button, Modal, } from "react-daisyui";
import {
  faClipboard,
  faRobot,
  faUser,
  faPlay,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { IChatMessageProps } from "../../types";
import { MessageRole } from "../../enums/MessageRole";
import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";

export const ChatMessage = ({ message, model_type, url }: IChatMessageProps) => {
  const messageRef = useRef<HTMLDivElement>(null);
  const [, copy] = useCopyToClipboard();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ref_modal = useRef<HTMLDialogElement>(null);
  const [modalContent, setModalContent] = useState<string>("");
  const [hasCheckedText, setHasCheckedText] = useState(false);

  const handleShow = useCallback(() => {
    ref_modal.current?.showModal();

    console.log(modalContent);

    if (!hasCheckedText) {
      check_text();
      setHasCheckedText(true);
    }
  }, [ref_modal, hasCheckedText]);


  const check_text = async () => {
    const res = await fetch(`${url}/api/v1/message/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: messageRef.current?.innerHTML, model_type: model_type }),
    });

    const text = await res.text();

    setModalContent(text);
  }

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

        {
          !isBot && <Button className="mt-4" size="sm" shape="square" color="ghost" onClick={handleShow}><FontAwesomeIcon icon={faCheck}/></Button>
        }
      </div>

      <div className="font-sans">
      
      <Modal ref={ref_modal}>
        <Modal.Header className="font-bold">Correction</Modal.Header>
        <Modal.Body>
          {modalContent != "" ? modalContent :  <Loading className="mt-4 ml-16" variant="dots" size="md" />}
        </Modal.Body>
        <Modal.Actions>
          <form method="dialog">
            <Button>Close</Button>
          </form>
        </Modal.Actions>
      </Modal>
    </div>

    </div>
  );
};
