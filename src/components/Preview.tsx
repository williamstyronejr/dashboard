import {
  FC,
  useState,
  useRef,
  SyntheticEvent,
  useCallback,
  useEffect,
} from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import Head from "next/head";

function changeToTime(time: number) {
  return new Date(time * 1000).toISOString().substr(14, 5);
}

const ImageViewer: FC<{ data: any }> = ({ data }) => {
  return (
    <div className="h-full">
      <Image
        priority={true}
        layout="fill"
        objectFit="contain"
        src={data.originalLink || data.link}
        alt="Media"
      />
    </div>
  );
};
const AudioPlayer = ({ title, src }: { title: string; src: string }) => {
  const [playing, setPlaying] = useState(true);
  const [mute, setMute] = useState(false);
  const [volume, setVolume] = useState(50);
  const [seeking, setSeeking] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLInputElement>(null);

  const togglePlay = () => {
    setPlaying((old) => !old);

    if (!playing) {
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      setMute((old) => !old);
      audioRef.current.muted = !audioRef.current.muted;
    }
  };

  const onSeekingUp = (evt: SyntheticEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      setSeeking(false);
      audioRef.current.currentTime = parseInt(evt.currentTarget.value);
      if (audioRef.current.paused) togglePlay();
    }
  };

  const onSeekingDown = (evt: SyntheticEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      setSeeking(true);
      if (!audioRef.current.paused) togglePlay();
    }
  };

  const onSeeking = (evt: SyntheticEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      setCurrentTime(parseInt(evt.currentTarget.value));
    }
  };

  const onTimeUpdate = () => {
    if (!seeking && audioRef.current)
      setCurrentTime(audioRef.current.currentTime);
  };

  const onVolumeChange = useCallback(
    (evt: SyntheticEvent<HTMLInputElement>) => {
      if (audioRef.current) {
        const numVol = parseInt(evt.currentTarget.value);
        audioRef.current.volume = numVol / 100;
        setVolume(numVol);
      }
    },
    []
  );

  const onEnd = () => {
    setPlaying(false);
  };

  return (
    <>
      <div className="flex flex-col flex-nowrap justify-center items-center h-full">
        <div className="relative w-20 h-20">
          <Image
            className="rounded-lg"
            priority={true}
            layout="fill"
            src={
              "https://firebasestorage.googleapis.com/v0/b/bookshelf-7b723.appspot.com/o/15d3e7b274c30c13.png?alt=media&token=8a2436cd-15db-4f08-a36a-b0fa5d85df3a"
            }
            alt="Media Art"
          />
        </div>

        <div>{title}</div>

        <div className="flex flex-row flex-nowrap">
          <div className="mr-2">{changeToTime(currentTime)}</div>

          <input
            type="range"
            min="0"
            max={Math.floor(audioRef.current?.duration || 0)}
            ref={progressRef}
            value={currentTime}
            onMouseDown={onSeekingDown}
            onMouseUp={onSeekingUp}
            onChange={onSeeking}
          />

          <div className="ml-2">
            {changeToTime(audioRef?.current?.duration || 0)}
          </div>
        </div>

        <div className="mt-4">
          <button
            type="button"
            className="w-10 h-10 py-2 px-3 rounded-full bg-black/10"
            onClick={() => togglePlay()}
          >
            {playing ? (
              <i className="fas fa-pause" />
            ) : (
              <i className="fas fa-play" />
            )}
          </button>
        </div>

        <div>
          <button type="button" className="" onClick={() => toggleMute()}>
            Mute
          </button>

          <input
            type="range"
            min="0"
            max="100"
            onChange={onVolumeChange}
            value={mute ? 0 : volume}
          />
        </div>
      </div>

      <audio
        ref={audioRef}
        autoPlay
        onTimeUpdate={onTimeUpdate}
        onEnded={onEnd}
      >
        <source src={src} />
      </audio>
    </>
  );
};

const Preview: React.FC<{
  onClose: Function;
  preview: any;
}> = ({ preview, onClose }) => {
  const [fullScreen, setFullScreen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const keyHandle = (evt: KeyboardEvent) => {
      console.log(evt.key);
      if (evt.key === "Escape") onClose();
      if (evt.key === "f") setFullScreen((old) => !old);
    };

    if (preview) document.addEventListener("keydown", keyHandle);
    return () => document.removeEventListener("keydown", keyHandle);
  }, [preview, onClose]);

  return (
    <div
      className={`absolute z-50  bg-custom-bg-off-light dark:bg-custom-bg-off-light
      ${preview ? "h-full p-4" : "h-0"}
        ${fullScreen ? "w-screen right-0" : "w-full"}
      `}
    >
      <Head>
        {preview ? <title>{preview.title || "Preview"}</title> : null}
      </Head>

      <div className="relative h-full">
        <button
          type="button"
          className={`absolute z-20 right-2 ${preview ? "block" : "hidden"}`}
          onClick={() => setFullScreen(!fullScreen)}
        >
          <i className="fas fa-expand" />
        </button>

        {preview && preview.type === "audio" ? (
          <AudioPlayer src={preview.link} title={preview.title} />
        ) : null}

        {preview && preview.type === "image" ? (
          <ImageViewer data={preview} />
        ) : null}
      </div>
    </div>
  );
};

export default Preview;
