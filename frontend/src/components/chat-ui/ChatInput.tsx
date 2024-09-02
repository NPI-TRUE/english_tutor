import { faMagicWandSparkles, faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { useCallback, useRef, useState, useEffect } from "react";
import { Button, Textarea } from "react-daisyui";
import { IChatInputProps } from "../../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const ChatInput = ({
  disabled,
  setIsQuerying,
  onSubmit,
  placeholder,
  customSubmitIcon,
  selectRef,
  url,
}: IChatInputProps) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      console.log('getUserMedia supportato.');
  
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          const mediaRecorder = new MediaRecorder(stream);
          setMediaRecorder(mediaRecorder);
  
          // Inizializza chunks come un array vuoto
          let chunks: BlobPart[] = [];
  
          // Aggiungi un listener per l'evento dataavailable
          mediaRecorder.ondataavailable = (e) => {
            chunks.push(e.data);
          };
  
          mediaRecorder.onstop = async () => {
            const blob = new Blob(chunks, { type: 'audio/wav' });
            const audioFile = new File([blob], "audio.wav", { type: "audio/wav" });
  
            chunks = []

            setIsQuerying(true);

            const formData = new FormData();
            formData.append('file', audioFile);
            
            const res = await fetch(url + '/api/v1/uploads', {
              method: 'POST',
              body: formData,
            })

            const data = await res.json();

            if (data.transcription != "")
              onSubmit(data.transcription, selectRef.current?.value);

            setIsQuerying(false);
          };    
        })
        .catch(error => {
          console.error('Errore durante l\'accesso al microfono:', error);
        });
    }
  }, []);
  
  const startRecording = () => {
    console.log("Start recording...");
    setIsRecording(true);
    if (mediaRecorder) {
      mediaRecorder.start();
      console.log('Registrazione in corso...');
    }
  };
  
  const stopRecording = () => {
    console.log("Stop recording...");
  
    setIsRecording(false);
    if (mediaRecorder) {
      mediaRecorder.stop();
      console.log('Registrazione terminata.');
    }
  };

  const handleSubmit = useCallback(
    (e: React.SyntheticEvent) => {
      e.preventDefault();
      const textArea = textAreaRef?.current;
      if (textArea && textArea.value.trim().length > 0) {
        if (onSubmit) {
          onSubmit(textArea.value, selectRef.current?.value);
        }
        textArea.value = "";
      }
    },
    [onSubmit]
  );

  const handleEnterKey = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        handleSubmit(e);
      }
    },
    [handleSubmit]
  );

  return (
    <div className="flex justify-center items-center">
      <Textarea
        ref={textAreaRef}
        bordered
        className={`resize-none w-2/3 max-h-48 overflow-y-auto`}
        onKeyUp={handleEnterKey}
        placeholder={placeholder ? placeholder : "Type here to chat"}
        disabled={disabled}
      ></Textarea>
      <Button
        shape={"square"}
        className="absolute ml-[58%]"
        disabled={disabled}
        onClick={handleSubmit}
      >
        {customSubmitIcon ? (
          customSubmitIcon
        ) : (
          <FontAwesomeIcon icon={faMagicWandSparkles} />
        )}
      </Button>

      {
        isRecording ? 
        <Button className="absolute ml-[75%]" onClick={stopRecording} disabled={disabled}>stop</Button> : 
        <Button className="absolute ml-[75%]" onClick={startRecording} disabled={disabled}><FontAwesomeIcon icon={faMicrophone}/></Button>
      }
    </div>
  );
};
