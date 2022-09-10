import {
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  FC,
} from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useReaderContext } from "../context/readerContext";

function changeToTime(time: number) {
  return new Date(time * 1000).toISOString().substr(14, 5);
}

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

const Slider: FC<{ collection: any; goToSlide: Function }> = ({
  collection,
  goToSlide,
}) => {
  const goNext = useCallback(() => {
    if (collection.slide !== collection.data.CollectionMedia.length - 1)
      goToSlide(collection.slide + 1);
  }, [goToSlide, collection.slide, collection.data]);

  const goPrev = useCallback(() => {
    if (collection.slide !== 0) goToSlide(collection.slide - 1);
  }, [goToSlide, collection.slide]);

  useEffect(() => {
    const eventHandler = (evt: KeyboardEvent) => {
      if (evt.key === "ArrowRight") goNext();
      if (evt.key === "ArrowLeft") goPrev();
    };
    document.addEventListener("keydown", eventHandler);

    return () => document.removeEventListener("keydown", eventHandler);
  }, [goNext, goPrev]);

  return (
    <div className="h-full">
      <div className="relative w-full h-3/6">
        {collection.data.CollectionMedia[
          collection.slide
        ].media.type.startsWith("image") ? (
          <Image
            priority={true}
            layout="fill"
            objectFit="contain"
            src={
              collection.data.CollectionMedia[collection.slide].media
                .originalLink ||
              collection.data.CollectionMedia[collection.slide].media.link
            }
            alt="Collection slide"
          />
        ) : (
          <video
            autoPlay
            loop
            className=""
            src={
              collection.data.CollectionMedia[collection.slide].media
                .originalLink ||
              collection.data.CollectionMedia[collection.slide].media.link
            }
          />
        )}
      </div>

      <div>
        <div></div>
        <div>
          <button type="button" onClick={() => goPrev()}>
            Prev
          </button>
          <button type="button" onClick={() => goNext()}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

const Reader = () => {
  const { state, setSelected, goToSlide } = useReaderContext();
  const [fullScreen, setFullScreen] = useState(false);

  const selectedMedia = useMemo(
    () => (state.selected !== null ? state.list[state.selected] : null),
    [state.selected, state.list]
  );

  console.log(selectedMedia?.data);

  return (
    <div
      className={`absolute bg-white z-50 
    ${selectedMedia ? "h-screen p-4" : "h-0"}
      ${fullScreen ? "w-screen right-0" : "w-full"}`}
    >
      <div className="relative h-full">
        <button
          type="button"
          className={`absolute  right-2 ${selectedMedia ? "block" : "hidden"}`}
          onClick={() => setFullScreen(!fullScreen)}
        >
          <i className="fas fa-expand" />
        </button>

        {selectedMedia && selectedMedia.data.type === "audio" ? (
          <AudioPlayer
            src={selectedMedia.data.link}
            title={selectedMedia.data.title}
          />
        ) : null}

        {selectedMedia && selectedMedia.data.type !== "audio" ? (
          <Slider collection={selectedMedia} goToSlide={goToSlide} />
        ) : null}
      </div>
    </div>
  );
};

export default Reader;
