# Palm image and mock analysis methodology

## Supported flow

- Browser camera capture and image-library selection are supported on clients that expose the relevant web APIs.
- A selected image is decoded in the browser, redrawn to a canvas, and encoded as JPEG at quality `0.86`.
- The long edge is limited to `1800px`; smaller images are not enlarged.
- Canvas re-encoding intentionally drops source EXIF metadata.
- The local uploader creates a temporary object URL only for the duration of mock analysis and revokes it immediately afterward.

## Privacy and storage

The Phase 4 adapter does not upload an image to a server and does not persist it. Accepted images remain in browser memory while the current reading flow is open. Journal storage is not implemented.

## Analyzer limitations

`mockPalmAnalyzer` validates the structured adapter flow only. It does not inspect pixels or claim that a palm line was observed. Every line uses observation confidence `0`, and the result explicitly states that Vision analysis is not connected.

Traditional meanings are general descriptions of how line categories have been used symbolically. They are not conclusions about the supplied hand. The mock never predicts lifespan, disease, accidents, financial loss, marriage failure, or future events.

## Replacement points

- Replace `createLocalPalmImageUploader` with a Vercel Blob, Supabase Storage, or S3-compatible implementation of `PalmImageUploader`.
- Replace `mockPalmAnalyzer` with a Vision-backed implementation of `PalmAnalyzer`.
- Preserve the `PalmAnalysisInput` and `PalmResult` contracts so camera UI changes are unnecessary.
