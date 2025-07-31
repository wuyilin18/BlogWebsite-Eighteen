"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Pause,
  Play,
  SkipBack,
  SkipForward,
  ListMusic,
  X,
  Shuffle,
  ArrowRight,
  Repeat,
  RotateCw,
} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useMusicStore, PlayMode } from "@/lib/musicStore";
import type { Song } from "@/lib/musicStore";
import TargetCursor from "@/components/reactbits/TargetCursor";

export const FullMusicPlayer: React.FC = () => {
  const {
    playlist,
    currentSongIndex,
    isPlaying,
    playMode,
    actions: {
      togglePlay,
      setCurrentSongIndex,
      nextSong,
      prevSong,
      setPlayMode,
    },
  } = useMusicStore();

  const [progress, setProgress] = useState<number>(0);
  const [showPlaylist, setShowPlaylist] = useState<boolean>(false);
  const [modeTooltip, setModeTooltip] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // 播放/暂停控制
  const handleTogglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          if (error.name === "AbortError") {
            console.info("Play request was aborted. This is normal.");
          } else {
            console.error("Playback failed:", error);
          }
        });
      }
    }
    togglePlay();
  };

  // 切换播放模式
  const togglePlayMode = () => {
    const nextMode = (playMode + 1) % 5;
    setPlayMode(nextMode);

    // 显示模式提示，并在短时间后隐藏
    setModeTooltip(true);
    setTimeout(() => setModeTooltip(false), 1500);
  };

  // 渲染播放模式图标
  const renderPlayModeIcon = (size: number = 20) => {
    switch (playMode) {
      case PlayMode.SEQUENTIAL:
        return <ArrowRight size={size} />; // 顺序播放 - 右箭头
      case PlayMode.LIST_LOOP:
        return <RotateCw size={size} />; // 列表循环
      case PlayMode.REPEAT_ONE:
        return <Repeat size={size} />; // 单曲循环
      case PlayMode.SHUFFLE:
        return <Shuffle size={size} />; // 随机播放
      case PlayMode.PLAY_ONCE:
        return <ArrowRight size={size} />; // 单曲播放
      default:
        return <ArrowRight size={size} />;
    }
  };

  // 渲染播放模式文本
  const getPlayModeText = () => {
    switch (playMode) {
      case PlayMode.SEQUENTIAL:
        return "顺序播放";
      case PlayMode.LIST_LOOP:
        return "列表循环";
      case PlayMode.REPEAT_ONE:
        return "单曲循环";
      case PlayMode.SHUFFLE:
        return "随机播放";
      case PlayMode.PLAY_ONCE:
        return "单曲播放";
      default:
        return "顺序播放";
    }
  };

  // 更新进度条
  useEffect(() => {
    if (!audioRef.current) return;

    const updateProgress = () => {
      if (!audioRef.current) return;

      const currentTime = audioRef.current.currentTime;
      const duration = audioRef.current.duration || 1;
      const percentage = (currentTime / duration) * 100;
      setProgress(percentage);
    };

    const intervalId = setInterval(updateProgress, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // 当歌曲切换时，如果正在播放，则加载并播放新歌曲
  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.load();
    if (isPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          if (error.name === "AbortError") {
            console.info(
              "Play request after song change was aborted. This is usually normal."
            );
          } else {
            console.error("Playback failed:", error);
          }
        });
      }
    } else {
      audioRef.current.pause();
    }
  }, [currentSongIndex, isPlaying]);

  // 歌曲结束时处理
  const handleSongEnd = () => {
    if (playMode === PlayMode.REPEAT_ONE) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else if (playMode === PlayMode.PLAY_ONCE) {
      togglePlay(false);
    } else {
      nextSong();
    }
  };

  // 点击进度条
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !audioRef.current) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const percentage = offsetX / rect.width;

    if (audioRef.current.duration) {
      audioRef.current.currentTime = percentage * audioRef.current.duration;
      setProgress(percentage * 100);
    }
  };

  // 点击播放列表中的歌曲
  const handlePlaylistItemClick = (index: number) => {
    setCurrentSongIndex(index);
    setShowPlaylist(false);
  };

  // 格式化时间
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const song = playlist[currentSongIndex];

  return (
    <div className="cursor-target w-full h-full flex flex-col rounded-[20px] overflow-hidden max-h-[220px] bg-black">
      <TargetCursor spinDuration={2} hideDefaultCursor={true} />
      {/* 主播放器界面 */}
      <div className="flex flex-col h-full">
        {/* 上部布局：左侧封面和右侧信息 */}
        <div className="grid grid-cols-2 gap-1 px-2 pt-2">
          {/* 左侧：封面图片 */}
          <div className="flex-shrink-0">
            <div className="relative w-full aspect-square rounded-md overflow-hidden shadow-md border border-neutral-700">
              {song.cover && (
                <Image
                  src={song.cover}
                  alt={song.title}
                  fill
                  className="object-cover"
                  sizes="100px"
                />
              )}
            </div>
          </div>

          {/* 右侧：歌曲信息和进度 */}
          <div className="flex flex-col justify-center">
            <h3 className="text-sm font-bold text-white truncate">
              {song.title}
            </h3>
            <p className="text-xs text-neutral-400 truncate mb-2">
              {song.artist}
            </p>

            {/* 时间显示 */}
            <div className="flex justify-between text-[9px] text-neutral-500">
              <span>{formatTime(audioRef.current?.currentTime || 0)}</span>
              <span>{formatTime(song.duration)}</span>
            </div>

            {/* 进度条 */}
            <div className="mt-1">
              <div
                ref={progressBarRef}
                className="w-full h-1 bg-neutral-700 rounded-full overflow-hidden cursor-pointer"
                onClick={handleProgressClick}
              >
                <div
                  className="h-full bg-cyan-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 控制按钮 */}
        <div className="flex items-center justify-between px-3 py-2 mt-auto border-t border-neutral-800 bg-black">
          {/* 播放模式按钮 */}
          <button
            className={`p-0.5 rounded-full ${
              playMode === PlayMode.SEQUENTIAL
                ? "text-neutral-400"
                : playMode === PlayMode.REPEAT_ONE
                ? "text-cyan-400"
                : "text-cyan-400"
            } relative hover:text-cyan-300 transition-colors`}
            onClick={togglePlayMode}
          >
            <div className="relative">
              {renderPlayModeIcon(16)}

              {/* 模式提示 */}
              <AnimatePresence>
                {modeTooltip && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1 bg-neutral-800 text-white text-[8px] py-0.5 px-1 rounded whitespace-nowrap border border-neutral-700"
                  >
                    {getPlayModeText()}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </button>

          {/* 上一曲 */}
          <button
            className="p-0.5 text-neutral-400 hover:text-cyan-300 transition-colors"
            onClick={prevSong}
          >
            <SkipBack size={16} />
          </button>

          {/* 播放/暂停 */}
          <button
            className="w-9 h-9 flex items-center justify-center bg-cyan-500 rounded-full text-black shadow-md hover:bg-cyan-400 transition-colors"
            onClick={handleTogglePlay}
          >
            {isPlaying ? (
              <Pause size={16} />
            ) : (
              <Play size={16} className="ml-0.5" />
            )}
          </button>

          {/* 下一曲 */}
          <button
            className="p-0.5 text-neutral-400 hover:text-cyan-300 transition-colors"
            onClick={nextSong}
          >
            <SkipForward size={16} />
          </button>

          {/* 播放列表按钮 */}
          <button
            className="p-0.5 rounded-full text-neutral-400 hover:text-cyan-300 transition-colors"
            onClick={() => setShowPlaylist(!showPlaylist)}
          >
            <ListMusic size={16} />
          </button>
        </div>
      </div>

      {/* 播放列表面板 */}
      <AnimatePresence>
        {showPlaylist && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 400 }}
            className="absolute inset-0 bg-gradient-to-b from-neutral-800 to-black rounded-[20px] shadow-lg border-t border-neutral-800"
            style={{ zIndex: 10 }}
          >
            <div className="flex items-center justify-between p-2 border-b border-neutral-800">
              <div className="flex items-center gap-1">
                <ListMusic size={14} className="text-neutral-400" />
                <h3 className="text-xs font-medium text-neutral-300">
                  Music list
                </h3>
              </div>
              <button onClick={() => setShowPlaylist(false)}>
                <X
                  size={14}
                  className="text-neutral-400 hover:text-neutral-200"
                />
              </button>
            </div>

            <div
              className="overflow-y-auto max-h-[calc(100%-40px)]"
              style={{
                msOverflowStyle: "none",
                scrollbarWidth: "none",
              }}
            >
              {/* 使用内联样式隐藏WebKit浏览器的滚动条 */}
              {playlist.map((item: Song, index: number) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-2 border-b border-neutral-800 ${
                    currentSongIndex === index ? "bg-neutral-800" : ""
                  } hover:bg-neutral-800/50 cursor-pointer transition-colors`}
                  onClick={() => handlePlaylistItemClick(index)}
                >
                  <div className="flex items-center gap-1.5">
                    <div className="relative w-8 h-8 rounded overflow-hidden flex-shrink-0 border border-neutral-700">
                      <Image
                        src={item.cover}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="32px"
                      />
                    </div>
                    <div className="max-w-[100px]">
                      <h4
                        className={`text-xs font-medium truncate ${
                          currentSongIndex === index
                            ? "text-cyan-400"
                            : "text-neutral-300"
                        }`}
                      >
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-neutral-500 truncate">
                        {item.artist}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {currentSongIndex === index && isPlaying ? (
                      <span className="text-[10px] text-cyan-400">Playing</span>
                    ) : (
                      <span className="text-[10px] text-neutral-500">
                        {formatTime(item.duration)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 音频元素 */}
      <audio
        ref={audioRef}
        src={song.url}
        onEnded={handleSongEnd}
        onPlay={() => togglePlay(true)}
        onPause={() => togglePlay(false)}
      />
    </div>
  );
};
