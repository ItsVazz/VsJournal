import React, { useEffect, useRef, useState } from "react";

// Each track uses YOUR local video file (with audio in it)
const tracks = [
  {
    id: 1,
    title: "Stand By Me",
    artist: "Ben E. King — Movie • Mix",
    mood: "Vintage",
    lengthLabel: "3:45",
    blurb: "Empty road, yellow streetlights, window half open.",
    video: "/videos/stand.mp4",   // <== PUT YOUR FILE HERE
    poster: "/videos/stand.jpg",         // fallback image
  },
  {
    id: 2,
    title: "Suspicious Minds",
    artist: "Elvis Presley • Edit • Soft",
    mood: "Soft",
    lengthLabel: "3:55",
    blurb: "Old school corridor, faded posters, last bell of the day.",
    video: "/videos/sus.mp4",
    poster: "/images/elvis.jpg",
  },
  {
    id: 3,
    title: "Here Comes the Sun",
    artist: "The Beatles",
    mood: "Motivating",
    lengthLabel: "3:11",
    blurb: "Slow train, desert wind, boots on loose gravel.",
    video: "/videos/sun.mp4",
    poster: "/images/beatles.jpg",
  },
  {
    id: 4,
    title: "My Heart Will Go On",
    artist: "Céline Dion",
    mood: "Sinking",
    lengthLabel: "5:09",
    blurb: "Ceiling fan noise, pages turning, one lamp on.",
    video: "/videos/titanic.mp4",
    poster: "/images/tit.jpg",
  },
  {
    id: 4,
    title: "I Don't Wanna Miss a Thing",
    artist: "Aerosmith",
    mood: "Miss You A <3",
    lengthLabel: "4:52",
    blurb: "Ceiling fan noise, pages turning, one lamp on.",
    video: "/videos/idont.mp4",
    poster: "/images/arma.jpeg",
  },
  {
    id: 4,
    title: "Wake Me Up When September Ends",
    artist: "Green Day",
    mood: "Te Amo",
    lengthLabel: "7:13",
    blurb: "Ceiling fan noise, pages turning, one lamp on.",
    video: "/videos/spe.mp4",
    poster: "/images/sep.jpeg",
  },
    {
    id: 4,
    title: "Unchained Melody",
    artist: "Righteous Brothers",
    mood: "Even my ghost will love you bae <3",
    lengthLabel: "3:38",
    blurb: "Ceiling fan noise, pages turning, one lamp on.",
    video: "/videos/ghost.mp4",
    poster: "/images/ghost.jpg",
  },
      {
    id: 4,
    title: "Can’t Help Falling in Love",
    artist: "Kacey Musgraves",
    mood: "I can't help...",
    lengthLabel: "2:43",
    blurb: "Ceiling fan noise, pages turning, one lamp on.",
    video: "/videos/kac.mp4",
    poster: "/images/kac.jpg",
  },

];

function formatTime(seconds) {
  if (!seconds || Number.isNaN(seconds)) return "00:00";
  const s = Math.floor(seconds);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m.toString().padStart(2, "0")}:${r.toString().padStart(2, "0")}`;
}

export default function MusicRoom() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const videoRef = useRef(null);
  const activeTrack = tracks[activeIndex];

  // Load new video whenever track changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.src = activeTrack.video;
    if (activeTrack.poster) video.poster = activeTrack.poster;
    video.load();

    const tryPlay = async () => {
      if (!isPlaying) return;
      try {
        await video.play();
      } catch (err) {
        console.warn("Autoplay blocked:", err);
        setIsPlaying(false);
      }
    };

    video.addEventListener("loadedmetadata", tryPlay);
    return () => {
      video.removeEventListener("loadedmetadata", tryPlay);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  // Wire up time + end events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onLoaded = () => setDuration(video.duration || 0);
    const onTime = () => setCurrentTime(video.currentTime || 0);

    // 🔥 AUTOPLAY NEXT TRACK HERE
    const onEnded = () => {
      setCurrentTime(0);
      // move to next index, loop back to 0 at the end
      setActiveIndex((prev) => (prev + 1) % tracks.length);
      setIsPlaying(true); // flag so the "track changed" effect auto-plays
    };

    video.addEventListener("loadedmetadata", onLoaded);
    video.addEventListener("timeupdate", onTime);
    video.addEventListener("ended", onEnded);

    return () => {
      video.removeEventListener("loadedmetadata", onLoaded);
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("ended", onEnded);
    };
  }, []);

  const togglePlay = async () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      try {
        await video.play();
        setIsPlaying(true);
      } catch (err) {
        console.warn("Play failed:", err);
      }
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleScrub = (e) => {
    const video = videoRef.current;
    if (!video || !duration) return;
    const value = Number(e.target.value);
    const newTime = (value / 1000) * duration;
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleSelectTrack = (index) => {
    setActiveIndex(index);
    setIsPlaying(true); // will try to autoplay when metadata loads
  };

  const progress = duration ? (currentTime / duration) * 1000 : 0;

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="font-serif text-3xl md:text-4xl mb-2">
          V Studios — Listening Booth
        </h1>
        <p className="text-sm text-gray-400 max-w-2xl">
          Vintage night-mode booth for the songs that built your brain. Pick a
          card, drop the needle, let something play while you write.
        </p>

        <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-gray-400">
          <span className="px-3 py-1 rounded-full bg-smoke/80 border border-gray-800">
            No accounts • No algorithm • Just your queue
          </span>
          <span className="px-3 py-1 rounded-full bg-smoke/80 border border-gray-800">
            Local files only • Your hard drive, your rules
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        {/* LEFT: PLAYER + DECK */}
        <div className="space-y-4">
          {/* PLAYER CARD */}
          <div className="bg-smoke rounded-3xl shadow-2xl overflow-hidden border border-gray-800">
            <div className="flex items-center justify-between px-5 pt-4 pb-2 text-[11px] text-gray-400">
              <div className="flex items-center gap-2">
                <span className="inline-flex w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="uppercase tracking-wide">Now playing</span>
                <span className="text-gray-500">• {activeTrack.artist}</span>
              </div>
              <span className="text-gray-500">{activeTrack.lengthLabel}</span>
            </div>

            <div className="aspect-video bg-black/90">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
              />
            </div>

            <div className="px-5 py-4 border-t border-gray-800 space-y-2">
              <div className="flex items-center justify-between gap-3 text-sm">
                <div>
                  <div className="font-semibold">{activeTrack.title}</div>
                  <div className="text-xs text-gray-400">
                    {activeTrack.blurb}
                  </div>
                </div>
                <button
                  onClick={togglePlay}
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-accent/90 text-night text-xs font-bold hover:bg-accent transition focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  {isPlaying ? "II" : "▶"}
                </button>
              </div>

              <div className="flex items-center gap-3 text-[11px] text-gray-300">
                <span className="w-10 text-right">
                  {formatTime(currentTime)}
                </span>
                <div className="flex-1 flex items-center">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={progress}
                    onChange={handleScrub}
                    className="w-full h-1.5 bg-gray-800 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-accent"
                  />
                </div>
                <span className="w-10 text-left">
                  {duration ? formatTime(duration) : activeTrack.lengthLabel}
                </span>
              </div>
            </div>
          </div>

          {/* ANALOG DECK */}
          <div className="bg-smoke/90 rounded-3xl border border-gray-800 shadow-xl p-4 md:p-6 flex flex-col md:flex-row gap-5 items-center">
            {/* Turntable */}
            <div className="relative w-40 h-40 md:w-48 md:h-48 flex-shrink-0">
              <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-black via-gray-900 to-black shadow-[0_0_50px_rgba(0,0,0,0.9)]" />
              <div className="absolute inset-3 rounded-full bg-gradient-to-br from-gray-950 via-black to-gray-900 shadow-inner">
                <div className="absolute inset-2 rounded-full border border-gray-900/60" />
                <div className="absolute inset-4 rounded-full border border-gray-900/50" />
                <div className="absolute inset-6 rounded-full border border-gray-900/40" />
              </div>

              <div
                className={`absolute inset-0 flex items-center justify-center ${
                  isPlaying ? "animate-spin" : ""
                }`}
                style={{
                  animationDuration: "18s",
                  animationTimingFunction: "linear",
                }}
              >
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-accent to-sky-400 flex items-center justify-center shadow-lg">
                  <span className="text-[10px] font-semibold text-night text-center leading-tight">
                    V STUDIOS
                    <br />
                    SIDE A
                  </span>
                </div>
              </div>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-gray-950 shadow-inner" />
              </div>

              <div
                className="absolute origin-top right-1 top-4 md:right-2 md:top-3 transition-transform duration-500"
                style={{
                  transform: isPlaying ? "rotate(8deg)" : "rotate(-24deg)",
                }}
              >
                <div className="w-16 h-1.5 bg-gradient-to-r from-gray-700 to-gray-500 rounded-full shadow-md" />
                <div className="w-5 h-6 bg-gray-200 rounded-b-md mx-auto mt-1 shadow" />
              </div>
            </div>

            {/* Copy */}
            <div className="flex-1 space-y-2 text-sm">
              <div className="text-[11px] uppercase tracking-wide text-gray-400">
                Night desk deck
              </div>
              <div className="text-base font-semibold">
                Needle is {isPlaying ? "down on" : "resting from"}{" "}
                {activeTrack.title}
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Built for slow listening while you type. Cards on the right pick
                the record, this circle holds the mood. Pause it and the arm
                swings home, like closing the door of a quiet room.
              </p>
              <p className="text-[11px] text-gray-500">
                Swap the videos and tracks whenever your taste changes —
                the booth doesn&apos;t care about releases or charts, only what
                plays in your head at 2 a.m.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT: QUEUE */}
        <aside className="space-y-3">
          <div className="flex items-center justify-between text-[11px] text-gray-400 px-1">
            <span>Queue • Vintage mix</span>
            <span>{tracks.length} tracks • curated</span>
          </div>

          <div className="space-y-2">
            {tracks.map((t, index) => {
              const active = index === activeIndex;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleSelectTrack(index)}
                  className={[
                    "w-full text-left rounded-2xl border px-4 py-3 text-sm transition-all",
                    active
                      ? "border-accent/70 bg-gradient-to-r from-smoke to-smoke/40 shadow-lg shadow-black/40"
                      : "border-gray-800 bg-smoke/80 hover:border-accent/50 hover:bg-smoke",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="text-[10px] text-gray-500 mb-1 flex items-center gap-1">
                        <span className="text-gray-600">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span>• {t.artist}</span>
                        <span className="text-gray-500">• {t.mood}</span>
                        {active && (
                          <span className="ml-2 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px]">
                            Now playing
                          </span>
                        )}
                      </div>
                      <div className="font-semibold">{t.title}</div>
                      <div className="text-[11px] text-gray-400 line-clamp-2">
                        {t.blurb}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 text-[11px] text-gray-400">
                      <span>{t.lengthLabel}</span>
                      <span className="text-accent">
                        {active ? "Playing" : "Play"}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>
      </div>
    </section>
  );
}
