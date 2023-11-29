
export enum GameOption {
  DebugMode = 'debugMode',
  ColorTheme = 'colorTheme',
  SoundMaster = 'soundMaster',
  SoundSFX = 'soundSFX',
  TelemetryErrors = 'telemetryErrors',
  TelemetrySavefiles = 'telemetrySavefiles',
}

export interface IOptions {
  version: number;
  [GameOption.DebugMode]: boolean;
  [GameOption.ColorTheme]: string;
  [GameOption.SoundMaster]: number;
  [GameOption.SoundSFX]: number;
  [GameOption.TelemetryErrors]: boolean;
  [GameOption.TelemetrySavefiles]: boolean;
}
