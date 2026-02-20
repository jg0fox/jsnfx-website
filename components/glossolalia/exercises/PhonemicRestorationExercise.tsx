"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Play, Loader2, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

const wordOptions = ["LEGISLATURE", "CARPENTER", "DINOSAUR", "STRAWBERRY", "YESTERDAY"];

type Phase = "instructions" | "listen" | "respond" | "reveal";

export function PhonemicRestorationExercise() {
  const [phase, setPhase] = useState<Phase>("instructions");
  const [selectedWord, setSelectedWord] = useState(wordOptions[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const originalBufferRef = useRef<AudioBuffer | null>(null);
  const modifiedBufferRef = useRef<AudioBuffer | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioContextRef.current = new AudioCtx();
    }
    if (audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume();
    }
    return audioContextRef.current;
  }, []);

  const stopPlayback = useCallback(() => {
    if (sourceNodeRef.current) {
      try { sourceNodeRef.current.stop(); } catch { /* already stopped */ }
      sourceNodeRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const playBuffer = useCallback((buffer: AudioBuffer) => {
    stopPlayback();
    const ctx = getAudioContext();
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.onended = () => setIsPlaying(false);
    setIsPlaying(true);
    source.start();
    sourceNodeRef.current = source;
  }, [getAudioContext, stopPlayback]);

  const generateAndProcess = useCallback(async () => {
    setIsLoading(true);

    try {
      // Fetch audio from ElevenLabs
      const res = await fetch("/api/elevenlabs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: selectedWord.toLowerCase(),
          stability: 0.85,
          similarityBoost: 0.85,
          style: 0,
          speed: 0.9,
          cacheKey: `phonemic-${selectedWord}`,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.audio) {
        console.error("Failed to generate audio:", data.error);
        setIsLoading(false);
        return;
      }

      // Decode base64 to ArrayBuffer
      const binaryString = atob(data.audio);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const ctx = getAudioContext();
      const audioBuffer = await ctx.decodeAudioData(bytes.buffer.slice(0));

      // Store original
      originalBufferRef.current = audioBuffer;

      // Create modified copy with noise replacing middle phoneme
      const modified = ctx.createBuffer(
        audioBuffer.numberOfChannels,
        audioBuffer.length,
        audioBuffer.sampleRate
      );

      // Copy all channel data
      for (let ch = 0; ch < audioBuffer.numberOfChannels; ch++) {
        const original = audioBuffer.getChannelData(ch);
        const modData = modified.getChannelData(ch);
        modData.set(original);
      }

      // Replace middle ~6% with noise (small enough to be subtle)
      const totalSamples = modified.length;
      const segmentLength = Math.floor(totalSamples * 0.06);
      const segmentStart = Math.floor((totalSamples - segmentLength) / 2);
      const segmentEnd = segmentStart + segmentLength;

      for (let ch = 0; ch < modified.numberOfChannels; ch++) {
        const channelData = modified.getChannelData(ch);

        // Measure RMS of the segment being replaced
        let sumSquares = 0;
        for (let i = segmentStart; i < segmentEnd; i++) {
          sumSquares += channelData[i] * channelData[i];
        }
        const rms = Math.sqrt(sumSquares / segmentLength);

        // Cross-fade length (20ms for smooth blending)
        const fadeLength = Math.floor(modified.sampleRate * 0.02);

        // Replace with noise at matched amplitude (1.0x RMS to blend naturally)
        for (let i = segmentStart; i < segmentEnd; i++) {
          const noise = (Math.random() * 2 - 1) * rms * 1.0;

          // Apply cross-fade at boundaries
          const distFromStart = i - segmentStart;
          const distFromEnd = segmentEnd - 1 - i;

          if (distFromStart < fadeLength) {
            const fade = distFromStart / fadeLength;
            channelData[i] = channelData[i] * (1 - fade) + noise * fade;
          } else if (distFromEnd < fadeLength) {
            const fade = distFromEnd / fadeLength;
            channelData[i] = channelData[i] * (1 - fade) + noise * fade;
          } else {
            channelData[i] = noise;
          }
        }
      }

      modifiedBufferRef.current = modified;

      // Play the modified version immediately
      setPhase("listen");
      setIsLoading(false);
      playBuffer(modified);
    } catch (err) {
      console.error("Error processing audio:", err);
      setIsLoading(false);
    }
  }, [selectedWord, getAudioContext, playBuffer]);

  const reset = useCallback(() => {
    stopPlayback();
    setPhase("instructions");
    setResponse(null);
    originalBufferRef.current = null;
    modifiedBufferRef.current = null;
  }, [stopPlayback]);

  useEffect(() => {
    return () => {
      stopPlayback();
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, [stopPlayback]);

  const responseOptions = [
    "Sounded normal",
    "Something was off",
    "A sound was replaced",
  ];

  return (
    <div>
      <p className="text-sm text-text-secondary leading-relaxed mb-4">
        You will hear a word. Listen carefully, then tell us if anything sounded
        unusual.
      </p>

      {/* Instructions / word selector */}
      {phase === "instructions" && (
        <>
          <div className="flex flex-wrap gap-2 mb-6">
            {wordOptions.map((word) => (
              <button
                key={word}
                onClick={() => setSelectedWord(word)}
                className={cn(
                  "px-3 py-1.5 text-sm rounded-full border transition-colors min-h-[36px]",
                  selectedWord === word
                    ? "border-palm-leaf bg-palm-leaf/10 text-palm-leaf-3 font-medium"
                    : "border-soft-linen-dark text-text-secondary hover:border-palm-leaf/40"
                )}
              >
                {word}
              </button>
            ))}
          </div>

          <div className="flex justify-center">
            <button
              onClick={generateAndProcess}
              disabled={isLoading}
              className={cn(
                "inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-bronze-spice rounded-lg hover:bg-bronze-spice-light transition-colors min-h-[44px]",
                isLoading && "opacity-70"
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating audio...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Play word
                </>
              )}
            </button>
          </div>
        </>
      )}

      {/* Listen phase */}
      {phase === "listen" && (
        <div className="space-y-6">
          <div className="flex flex-col items-center py-6">
            <div className="flex items-center gap-3 mb-4">
              {isPlaying && (
                <Volume2 className="w-5 h-5 text-bronze-spice animate-pulse" />
              )}
              <p className="text-2xl md:text-3xl font-display font-bold text-text-primary">
                {selectedWord}
              </p>
            </div>
            <button
              onClick={() => modifiedBufferRef.current && playBuffer(modifiedBufferRef.current)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm text-palm-leaf-3 border border-palm-leaf/30 rounded-lg hover:bg-palm-leaf/5 transition-colors min-h-[44px]"
            >
              <Play className="w-3.5 h-3.5" />
              Replay
            </button>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => setPhase("respond")}
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-bronze-spice rounded-lg hover:bg-bronze-spice-light transition-colors min-h-[44px]"
            >
              I&apos;ve listened
            </button>
          </div>
        </div>
      )}

      {/* Respond phase */}
      {phase === "respond" && (
        <div className="space-y-4">
          <p className="text-sm font-medium text-text-primary">
            Did you notice anything missing or unusual about the word?
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            {responseOptions.map((option) => (
              <button
                key={option}
                onClick={() => setResponse(option)}
                className={cn(
                  "flex-1 px-4 py-3 text-sm rounded-lg border transition-all min-h-[44px]",
                  response === option
                    ? "border-2 border-palm-leaf bg-palm-leaf/5 font-medium"
                    : "border-soft-linen-dark hover:border-palm-leaf/40 bg-white"
                )}
              >
                {option}
              </button>
            ))}
          </div>

          {response && (
            <div className="flex justify-center pt-2">
              <button
                onClick={() => setPhase("reveal")}
                className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-palm-leaf rounded-lg hover:bg-palm-leaf-3 transition-colors min-h-[44px]"
              >
                Reveal
              </button>
            </div>
          )}
        </div>
      )}

      {/* Reveal phase */}
      {phase === "reveal" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => modifiedBufferRef.current && playBuffer(modifiedBufferRef.current)}
              className="flex items-center justify-center gap-2 p-4 rounded-lg border border-soft-linen-dark hover:border-palm-leaf/40 transition-colors min-h-[56px]"
            >
              <Play className="w-4 h-4 text-text-secondary" />
              <div className="text-left">
                <p className="text-sm font-medium text-text-primary">Modified</p>
                <p className="text-xs text-text-muted">Phoneme replaced with noise</p>
              </div>
            </button>
            <button
              onClick={() => originalBufferRef.current && playBuffer(originalBufferRef.current)}
              className="flex items-center justify-center gap-2 p-4 rounded-lg border border-soft-linen-dark hover:border-palm-leaf/40 transition-colors min-h-[56px]"
            >
              <Play className="w-4 h-4 text-text-secondary" />
              <div className="text-left">
                <p className="text-sm font-medium text-text-primary">Original</p>
                <p className="text-xs text-text-muted">Intact word</p>
              </div>
            </button>
          </div>

          <div className="p-4 bg-palm-leaf/5 border-l-4 border-palm-leaf rounded-r-lg">
            <p className="text-sm text-text-secondary leading-relaxed mb-2">
              {response === "Sounded normal" ? (
                <>
                  You reported the word sounded normal. That is the phonemic
                  restoration effect in action.{" "}
                </>
              ) : response === "Something was off" ? (
                <>
                  You sensed something was slightly off, but most people cannot
                  pinpoint what.{" "}
                </>
              ) : (
                <>
                  You noticed the replacement. You are in the minority; most
                  listeners report hearing an intact word.{" "}
                </>
              )}
              A middle phoneme was physically removed and replaced with a burst
              of noise. Your brain filled in the missing sound from context. This
              is phonemic restoration: top-down prediction so powerful it
              manufactures perceptual experience. The phoneme was absent, yet
              your auditory cortex synthesized it.
            </p>
            <p className="text-sm text-text-secondary leading-relaxed">
              Play both versions above to compare. Most people struggle to tell
              them apart even after being told.
            </p>
          </div>

          <div className="flex justify-center">
            <button
              onClick={reset}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-palm-leaf-3 border border-palm-leaf/30 rounded-lg hover:bg-palm-leaf/5 transition-colors min-h-[44px]"
            >
              Try another word
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
