import { create } from "zustand";

export interface Song {
  id: number;
  title: string;
  artist: string;
  cover: string;
  url: string;
  duration: number;
}

export enum PlayMode {
  SEQUENTIAL = 0,
  LIST_LOOP = 1,
  REPEAT_ONE = 2,
  SHUFFLE = 3,
  PLAY_ONCE = 4,
}

const playlist: Song[] = [
  {
    id: 1,
    title: "不凡",
    artist: "王铮亮",
    cover: "https://cdn.wuyilin18.top/img/%E4%B8%8D%E5%87%A1.jpg",
    url: "https://cdn.wuyilin18.top/img/%E4%B8%8D%E5%87%A1.m4a",
    duration: 211, // 3:31
  },
  {
    id: 2,
    title: "知我",
    artist: "国风堂,哦漏",
    cover: "https://cdn.wuyilin18.top/img/%E7%9F%A5%E6%88%91.jpg",
    url: "https://cdn.wuyilin18.top/img/%E7%9F%A5%E6%88%91.mp3",
    duration: 277,
  },
  {
    id: 3,
    title: "问星",
    artist: "Mr.mo",
    cover: "https://cdn.wuyilin18.top/img/%E9%97%AE%E6%98%9F.webp",
    url: "https://cdn.wuyilin18.top/img/%E9%97%AE%E6%98%9F.m4a",
    duration: 225,
  },
  {
    id: 4,
    title: "Let It Go",
    artist: "Idina Menzel",
    cover: "https://cdn.wuyilin18.top/img/Let_It_Go.jpg",
    url: "https://cdn.wuyilin18.top/img/Let%20It%20Go.m4a",
    duration: 224, // 3:44
  },
  {
    id: 5,
    title: "Show Yourself",
    artist: "Idina Menzel & Evan Rachel Wood",
    cover: "https://cdn.wuyilin18.top/img/ShowYourself.jpg",
    url: "https://cdn.wuyilin18.top/img/Show%20Yourself.m4a",
    duration: 260, // 4:20
  },
  {
    id: 6,
    title: "DARK ARIA <LV2>",
    artist: "SawanoHiroyuki[nZk] & XAI",
    cover:
      "http://p1.music.126.net/-HQJxPCvUPUYwjFgh_MulQ==/109951169249504499.jpg",
    url: "https://cdn.wuyilin18.top/img/DARK%20ARIA%20LV2.mp3",
    duration: 141, // 2:21
  },
  {
    id: 7,
    title: "SHADOWBORN",
    artist: "澤野弘之 & Benjamin & mpi",
    cover: "https://cdn.wuyilin18.top/img/SHADOWBORN.jpg",
    url: "https://cdn.wuyilin18.top/img/SHADOWBORN.mp3",
    duration: 191, // 3:11
  },
];

interface MusicState {
  playlist: Song[];
  currentSongIndex: number;
  isPlaying: boolean;
  playMode: PlayMode;
  actions: {
    togglePlay: (play?: boolean) => void;
    setCurrentSongIndex: (index: number) => void;
    nextSong: () => void;
    prevSong: () => void;
    setPlayMode: (mode: PlayMode) => void;
  };
}

export const useMusicStore = create<MusicState>((set, get) => ({
  playlist,
  currentSongIndex: 0,
  isPlaying: false,
  playMode: PlayMode.SEQUENTIAL,
  actions: {
    togglePlay: (play) =>
      set((state) => ({ isPlaying: play ?? !state.isPlaying })),
    setCurrentSongIndex: (index) =>
      set({ currentSongIndex: index, isPlaying: true }),
    setPlayMode: (mode) => set({ playMode: mode }),
    nextSong: () => {
      const { playMode, currentSongIndex, playlist } = get();
      let nextIndex: number;
      switch (playMode) {
        case PlayMode.SEQUENTIAL:
          nextIndex =
            currentSongIndex < playlist.length - 1
              ? currentSongIndex + 1
              : currentSongIndex;
          break;
        case PlayMode.LIST_LOOP:
          nextIndex = (currentSongIndex + 1) % playlist.length;
          break;
        case PlayMode.REPEAT_ONE:
          nextIndex = currentSongIndex;
          break;
        case PlayMode.SHUFFLE:
          let randomIndex;
          do {
            randomIndex = Math.floor(Math.random() * playlist.length);
          } while (randomIndex === currentSongIndex);
          nextIndex = randomIndex;
          break;
        case PlayMode.PLAY_ONCE:
          nextIndex =
            currentSongIndex < playlist.length - 1
              ? currentSongIndex + 1
              : currentSongIndex;
          break;
        default:
          nextIndex = (currentSongIndex + 1) % playlist.length;
      }
      set({ currentSongIndex: nextIndex });
    },
    prevSong: () => {
      const { playMode, currentSongIndex, playlist } = get();
      let prevIndex: number;
      switch (playMode) {
        case PlayMode.SHUFFLE:
          let randomIndex;
          do {
            randomIndex = Math.floor(Math.random() * playlist.length);
          } while (randomIndex === currentSongIndex);
          prevIndex = randomIndex;
          break;
        default:
          prevIndex =
            (currentSongIndex - 1 + playlist.length) % playlist.length;
      }
      set({ currentSongIndex: prevIndex });
    },
  },
}));
