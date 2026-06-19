export type FormatPreset =
  | "youtube"
  | "shorts"
  | "tiktok"
  | "square"
  | "custom";

export interface VideoFormat {
  preset: FormatPreset;
  width: number;
  height: number;
  fps: number;
  aspectRatio: string;
  label: string;
  ffmpegFlags: string[];
  mcCanvasSize: { width: number; height: number };
}

export const FORMAT_PRESETS: Record<FormatPreset, VideoFormat> = {
  youtube: {
    preset: "youtube",
    width: 1920,
    height: 1080,
    fps: 60,
    aspectRatio: "16:9",
    label: "YouTube (1080p 60fps)",
    ffmpegFlags: ["-vf", "scale=1920:1080"],
    mcCanvasSize: { width: 1920, height: 1080 },
  },
  shorts: {
    preset: "shorts",
    width: 1080,
    height: 1920,
    fps: 30,
    aspectRatio: "9:16",
    label: "YouTube Shorts (1080x1920)",
    ffmpegFlags: ["-vf", "scale=1080:1920"],
    mcCanvasSize: { width: 1080, height: 1920 },
  },
  tiktok: {
    preset: "tiktok",
    width: 1080,
    height: 1920,
    fps: 30,
    aspectRatio: "9:16",
    label: "TikTok (1080x1920)",
    ffmpegFlags: ["-vf", "scale=1080:1920"],
    mcCanvasSize: { width: 1080, height: 1920 },
  },
  square: {
    preset: "square",
    width: 1080,
    height: 1080,
    fps: 30,
    aspectRatio: "1:1",
    label: "Square (1080x1080)",
    ffmpegFlags: ["-vf", "scale=1080:1080"],
    mcCanvasSize: { width: 1080, height: 1080 },
  },
  custom: {
    preset: "custom",
    width: 1920,
    height: 1080,
    fps: 30,
    aspectRatio: "16:9",
    label: "Custom",
    ffmpegFlags: ["-vf", "scale=1920:1080"],
    mcCanvasSize: { width: 1920, height: 1080 },
  },
};
