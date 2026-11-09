// frame.tsx - the App Store screenshots' own language, in motion (Mir, 8 Nov: "the text at the top is supposed to be like
// the same as the screenshots"). Every scene is laid out in the screenshots' units, 440 x 956 (store/hand), and scaled
// to the film's 886 x 1920, so a held frame of the film is the screenshot it shows.
//
// Head is the screenshots' headline (store/hand/hand.css): Nunito Black, centred, the highlighted word in a tilted pill.
// Its motion is one move for the whole film: each line rises out of its own mask, then the pill pops and settles once.

import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const SU = 886 / 440; // film px per screenshot unit
export const FW = 440, FH = 1920 / SU; // the frame in screenshot units (953.6: the film's frame is a hair shorter)
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const out5 = Easing.bezier(0.16, 1, 0.3, 1); // fast out, long settle
export const in3 = Easing.bezier(0.5, 0, 0.9, 0.5); // gathers speed into an exit
export const ramp = (f: number, a: number, b: number, e = out5) => e(interpolate(f, [a, b], [0, 1], clamp));

export const ORANGE_BG = "radial-gradient(60% 34% at 18% 8%, rgba(255, 190, 150, .55) 0, rgba(255, 190, 150, 0) 72%), radial-gradient(55% 30% at 100% 62%, rgba(255, 160, 110, .45) 0, rgba(255, 160, 110, 0) 72%), linear-gradient(180deg, #f47a40 0%, #ee6a30 55%, #e45a22 100%)";
export const WHITE_BG = "radial-gradient(70% 40% at 85% 6%, rgba(255, 176, 137, .26) 0, rgba(255, 176, 137, 0) 70%), #fbf8f2";
export type Field = "orange" | "white";
export const ink = "#17181c", orange = "#ef7a45", orangeText = "#e8602a", mute = "#a6a2a8", saidBg = "#d3f0df", saidInk = "#1b5e3a";
export const NUNITO = '"Nunito", sans-serif', INTER = "Inter, sans-serif", SERIF = '"EB Garamond", serif';

/** A pop that settles once (a bubbly feel, never a wobble): 0 to 1 with a small overshoot. */
export const usePop = () => {
  const { fps } = useVideoConfig();
  return (f: number, at: number, soft = false) => spring({ frame: f - at, fps, config: soft ? { damping: 20, stiffness: 140, mass: 0.8 } : { damping: 13, stiffness: 170, mass: 0.7 } });
};

/** The scene in screenshot units, on its field. Children are laid out at 440 x 956 like store/hand. */
export const Frame: React.FC<{ field: Field; children: React.ReactNode }> = ({ field, children }) => (
  <AbsoluteFill style={{ background: field === "orange" ? ORANGE_BG : WHITE_BG, overflow: "hidden" }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: FW, height: FH, transform: `scale(${SU})`, transformOrigin: "0 0", color: field === "orange" ? "#fff" : ink, fontFamily: NUNITO }}>{children}</div>
  </AbsoluteFill>
);

/** The screenshots' headline. `text` lines split by "\n"; [word] goes in the pill. enterAt: frame the first line rises. */
export const Head: React.FC<{ text: string; field: Field; enterAt?: number; exitAt?: number; top?: number; size?: number }> = ({ text, field, enterAt = 0, exitAt, top = 54, size = 64 }) => {
  const f = useCurrentFrame();
  const lines = text.split("\n");
  // a headline that has left is gone (its pill once peeked out under the next one's: TASTE store-trailer-head-leftover)
  if (exitAt !== undefined && f > exitAt + lines.length * 2 + 11) return null;
  if (f < enterAt) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top, textAlign: "center", fontWeight: 900, letterSpacing: "-0.035em", lineHeight: 0.92, fontSize: size, zIndex: 30 }}>
      {lines.map((line, i) => {
        const a = enterAt + i * 5;
        const up = ramp(f, a, a + 15);
        const down = exitAt === undefined ? 0 : ramp(f, exitAt + i * 2, exitAt + i * 2 + 10, in3) * 1.3;
        const parts = line.split(/(\[[^\]]+\])/).filter(Boolean);
        return (
          <div key={i} style={{ overflow: "hidden", padding: "4px 8px 10px", margin: "-4px 0 -10px", whiteSpace: "nowrap" }}>
            <div style={{ transform: `translateY(${(1 - up) * 115 + down * 115}%)` }}>
              {parts.map((p, j) => {
                if (!p.startsWith("[")) return <span key={j} style={{ whiteSpace: "pre" }}>{p}</span>;
                // the highlighted word rides up with its line; its pill fills in behind it as it arrives (no pop)
                const fillIn = ramp(f, a + 4, a + 18);
                return (
                  <span key={j} style={{ position: "relative", display: "inline-block", padding: "0 14px 6px", marginLeft: 4, color: field === "orange" ? orangeText : "#fff" }}>
                    <span style={{ position: "absolute", inset: 0, borderRadius: 18, background: field === "orange" ? "#fff" : orange, transform: `rotate(-3deg) scaleX(${0.6 + 0.4 * fillIn})`, opacity: fillIn, transformOrigin: "0 50%" }} />
                    <span style={{ position: "relative", color: fillIn > 0.5 ? undefined : field === "orange" ? "#fff" : ink, transition: "none" }}>{p.slice(1, -1)}</span>
                  </span>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/** The screenshots' card: white, rounded, with its soft warm shadow (and the white rim the lifted ones wear). */
export const Card: React.FC<{ style?: React.CSSProperties; rim?: boolean; children: React.ReactNode }> = ({ style, rim, children }) => (
  <div style={{ position: "absolute", background: "#fff", color: ink, borderRadius: 22, boxShadow: rim ? "0 0 0 4px #fff, 0 26px 54px rgba(60, 25, 5, .28)" : "0 18px 44px rgba(60, 25, 5, .22)", ...style }}>{children}</div>
);

/** The small caps label every card uses (HOOK, SETUP, BRAIN DUMP). */
export const Lab: React.FC<{ children: React.ReactNode; color?: string; style?: React.CSSProperties }> = ({ children, color = mute, style }) => (
  <div style={{ font: `800 10px/1 ${INTER}`, letterSpacing: "0.09em", textTransform: "uppercase", color, ...style }}>{children}</div>
);

/** The user's own words: the app's green "said" highlight, wrapping line by line. */
export const Said: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <span style={{ background: saidBg, color: saidInk, borderRadius: 8, padding: "3px 8px", WebkitBoxDecorationBreak: "clone", boxDecorationBreak: "clone", ...style }}>{children}</span>
);

/** Characters typed by frame f between a and b, a little uneven like a hand (deterministic). */
export const typed = (text: string, f: number, a: number, b: number) => {
  let n = 0;
  for (let i = 0; i < text.length; i++) if (f >= a + ((b - a) * i) / text.length + Math.sin(i * 1.7) * 0.8) n = i + 1;
  return text.slice(0, n);
};
export const Caret: React.FC<{ on?: boolean; h?: number }> = ({ on = true, h = 17 }) => (
  <span style={{ display: "inline-block", width: 2, height: h, background: orange, verticalAlign: -3, marginLeft: 2, opacity: on ? 1 : 0 }} />
);

/** A phone like the screenshots': black body, its screen an image (or children). */
export const Phone: React.FC<{ x: number; y: number; w: number; h: number; src?: string; children?: React.ReactNode; style?: React.CSSProperties }> = ({ x, y, w, h, src, children, style }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: w * 0.183, background: "#0d0d10", padding: 10, boxShadow: "0 0 0 2px #3c3c43, 0 0 0 3px #7a7a82, 0 30px 60px rgba(90, 30, 5, .32)", ...style }}>
    <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: w * 0.147, overflow: "hidden", background: "#111" }}>
      {src ? <img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }} /> : null}
      {children}
    </div>
  </div>
);

/** The finger: an iOS touch mark that comes in, presses on `at`, lifts away (screenshot units). */
export const Tap: React.FC<{ x: number; y: number; at: number }> = ({ x, y, at }) => {
  const f = useCurrentFrame();
  if (f < at - 12 || f > at + 12) return null;
  const come = ramp(f, at - 12, at - 1, Easing.out(Easing.cubic));
  const lift = interpolate(f, [at + 4, at + 12], [0, 1], clamp);
  const press = f >= at - 1 && f < at + 4 ? 0.82 : 1;
  return <div style={{ position: "absolute", left: x - 20 + (1 - come) * 14, top: y - 20 + (1 - come) * 18, width: 40, height: 40, borderRadius: 20, zIndex: 40, background: "rgba(255,255,255,.6)", boxShadow: "0 0 0 1px rgba(255,255,255,.95), 0 3px 10px rgba(0,0,0,.2)", opacity: Math.min(1, come * 1.4) * (1 - lift), transform: `scale(${press * (1 + lift * 0.3)})` }} />;
};

/** The jelly press (TASTE jelly-press): in quick to .93, out on a loose spring (response .42, damping .4). */
export const jelly = (f: number, at: number, fps = 30): number => {
  const t = (f - at) / fps;
  if (t < 0 || t > 1.3) return 1;
  if (t < 0.1) return 1 - 0.07 * Easing.out(Easing.cubic)(t / 0.1);
  const s = t - 0.1;
  return 1 - 0.07 * Math.exp(-6 * s) * Math.cos(13.7 * s);
};
