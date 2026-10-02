import { useId } from "react";

/**
 * The composer's "AI Chatbots" glyph: on app.zaapi.com a Lottie player draws this gradient loop at
 * 24px. This is its resting frame, copied from the saved inbox page's rendered SVG.
 */
export function AiLoopIcon() {
  const id = useId().replace(/:/g, "");
  const [clip, stroke, fill, mask, shape] = ["clip", "stroke", "fill", "mask", "shape"].map((k) => `${id}-${k}`);
  return (
    <div className="lf-player-container">
      <div style={{ background: "transparent", margin: "0px auto", outline: "none", overflow: "hidden", height: 24, width: 24 }}>
        <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%" }} aria-hidden="true">
          <defs>
            <clipPath id={clip}>
              <rect width="1200" height="800" x="0" y="0" />
            </clipPath>
            <linearGradient id={stroke} spreadMethod="pad" gradientUnits="userSpaceOnUse" x1="-285.664" y1="0" x2="252.977" y2="0">
              <stop offset="0%" stopColor="rgb(31,232,203)" />
              <stop offset="24%" stopColor="rgb(34,202,221)" />
              <stop offset="52%" stopColor="rgb(38,172,239)" />
              <stop offset="80%" stopColor="rgb(88,127,243)" />
              <stop offset="100%" stopColor="rgb(138,82,246)" />
            </linearGradient>
            <linearGradient id={fill} spreadMethod="pad" gradientUnits="userSpaceOnUse" x1="-369.207" y1="0" x2="431.056" y2="0">
              <stop offset="0%" stopColor="rgb(31,232,203)" />
              <stop offset="25%" stopColor="rgb(34,202,221)" />
              <stop offset="50%" stopColor="rgb(38,172,239)" />
              <stop offset="75%" stopColor="rgb(88,127,243)" />
              <stop offset="100%" stopColor="rgb(138,82,246)" />
            </linearGradient>
            <mask id={mask} style={{ maskType: "alpha" }}>
              <use href={`#${shape}`} />
            </mask>
            <symbol id={shape}>
              <g transform="matrix(1,0,0,1,217,151.5)">
                <g transform="matrix(1,0,0,1,382.234,267.331)">
                  <path
                    stroke={`url(#${stroke})`}
                    strokeLinecap="butt"
                    strokeLinejoin="miter"
                    fillOpacity="0"
                    strokeMiterlimit="4"
                    strokeWidth="76"
                    d="M-51.557,16.663 C-118.832,-49.604 -213.553,-144.943 -282.872,-89.285 C-367.24,-21.514 -366.088,146.468 -259.561,164.383 C-69.394,197.193 22.08,-193.603 205.051,-207.81 C373.332,-220.881 405.2,161.549 226.631,174.019 C129.888,180.711 32.158,99.653 -51.557,16.663z"
                  />
                </g>
              </g>
            </symbol>
          </defs>
          <g clipPath={`url(#${clip})`}>
            <use href={`#${shape}`} />
            <g mask={`url(#${mask})`}>
              <g transform="matrix(-0.46458,-0.087938,0.107492,-0.567886,600,400)">
                <g transform="matrix(1.4427,0,0,1.70379,-17.719,-29.773)">
                  <path fill={`url(#${fill})`} d="M734.281,-510.227 L734.281,510.227 L-734.281,510.227 L-734.281,-510.227z" />
                </g>
              </g>
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}
