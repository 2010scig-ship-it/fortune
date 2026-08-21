import type { PalmStepState } from "./palmFlow";
import type { PalmAnalysisInput, PalmAnalyzer, PalmImageUploader, PalmResult, UploadedPalmImage } from "../engine/palm";

export async function analyzePalmStep(
  state: PalmStepState,
  uploader: PalmImageUploader,
  analyzer: PalmAnalyzer,
): Promise<PalmResult | undefined> {
  const uploaded: UploadedPalmImage[] = [];
  try {
    const leftHand = state.hands.left;
    const rightHand = state.hands.right;
    const leftImage = leftHand.status === "ready" ? await upload(leftHand.image.file) : undefined;
    const rightImage = rightHand.status === "ready" ? await upload(rightHand.image.file) : undefined;
    if (leftImage === undefined && rightImage === undefined) return undefined;

    const input: PalmAnalysisInput = {
      ...(leftImage === undefined ? {} : { leftPalmUrl: leftImage.url }),
      ...(rightImage === undefined ? {} : { rightPalmUrl: rightImage.url }),
    };
    return analyzer.analyze(input);
  } finally {
    if (uploader.remove !== undefined) {
      for (const image of uploaded) await uploader.remove(image);
    }
  }

  async function upload(file: File): Promise<UploadedPalmImage> {
    const image = await uploader.upload(file);
    uploaded.push(image);
    return image;
  }
}
