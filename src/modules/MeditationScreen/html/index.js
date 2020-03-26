// @flow
import RNFetchBlob from "rn-fetch-blob";

const { dirs } = RNFetchBlob.fs;

export function getReflectionsCount(duration: number): number {
  switch (duration) {
    case 600:
    case 900:
      return 4;

    case 1200:
    case 1500:
    case 1800:
      return 6;

    case 2100:
    case 2400:
    case 2700:
      return 8;

    case 3000:
    case 3300:
    case 3600:
      return 10;

    default:
      return 10;
  }
}

export function getHtml(
  canvasWidth: number,
  canvasHeight: number,
  duration: number
) {
  return `
    <!doctype html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=1.0, minimum-scale=1.0, maximum-scale=1.0">
      <style>
        body {
          display: flex;
          flex-direction: column;
          background-color: #000;
          align-items: center;
        }

        canvas {
          animation: canvas-spin infinite 60s linear;
        }

        @keyframes canvas-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      </style>
      <script>
        let width=${canvasWidth};
        let height=${canvasHeight};
        let duration=${duration};
        let nReflections=${getReflectionsCount(duration)}
        true;
      </script>
    </head>
    <body>
      <script defer src="file://${dirs.MainBundleDir}/p5.min.js"></script>
      <script defer src="file://${dirs.MainBundleDir}/kaleidoscope.js"></script>
    </body>
    </html>
  `;
}
