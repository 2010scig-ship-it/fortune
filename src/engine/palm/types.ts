export interface UploadedPalmImage {
  readonly url: string;
  readonly width?: number;
  readonly height?: number;
}

export interface PalmImageUploader {
  upload(file: File): Promise<UploadedPalmImage>;
  remove?(image: UploadedPalmImage): Promise<void>;
}

export interface PalmAnalysisInput {
  readonly leftPalmUrl?: string;
  readonly rightPalmUrl?: string;
}

export interface PalmLineResult {
  readonly observedFeatures: string;
  readonly traditionalMeaning: string;
  readonly interpretation?: string;
  readonly confidence?: number;
}

export interface PalmHandResult {
  readonly heartLine?: PalmLineResult;
  readonly headLine?: PalmLineResult;
  readonly lifeLine?: PalmLineResult;
  readonly fateLine?: PalmLineResult;
}

export interface PalmResult {
  readonly mode: "mock" | "vision";
  readonly leftHand?: PalmHandResult;
  readonly rightHand?: PalmHandResult;
  readonly summary: string;
  readonly limitations: readonly string[];
}

export interface PalmAnalyzer {
  analyze(input: PalmAnalysisInput): Promise<PalmResult>;
}
