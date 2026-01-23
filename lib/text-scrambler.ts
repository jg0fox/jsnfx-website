/**
 * Text Scrambler
 *
 * Implements a text scramble/reveal animation that makes text appear to
 * "scramble" through random characters before resolving to the target text.
 *
 * Inspired by: https://codepen.io/soulwire/pen/mEMPrK
 */

export interface TextScramblerOptions {
  /** Characters to use for scrambling effect */
  chars?: string;
  /** Speed multiplier (higher = faster animation) */
  speed?: number;
  /** Callback when animation completes */
  onComplete?: () => void;
  /** Whether to preserve HTML tags */
  preserveHtml?: boolean;
}

interface QueueItem {
  from: string;
  to: string;
  start: number;
  end: number;
  char?: string;
}

const DEFAULT_CHARS = '!<>-_\\/[]{}—=+*^?#________';

export class TextScrambler {
  private element: HTMLElement;
  private chars: string;
  private speed: number;
  private preserveHtml: boolean;
  private queue: QueueItem[] = [];
  private frame: number = 0;
  private frameRequest: number | null = null;
  private resolve: (() => void) | null = null;
  private originalHtml: string = '';

  constructor(element: HTMLElement, options: TextScramblerOptions = {}) {
    this.element = element;
    this.chars = options.chars ?? DEFAULT_CHARS;
    this.speed = options.speed ?? 1;
    this.preserveHtml = options.preserveHtml ?? false;
    this.originalHtml = element.innerHTML;
  }

  /**
   * Scramble to new text
   */
  setText(newText: string): Promise<void> {
    // Cancel any existing animation
    if (this.frameRequest) {
      cancelAnimationFrame(this.frameRequest);
      this.frameRequest = null;
    }

    const oldText = this.element.innerText;
    const length = Math.max(oldText.length, newText.length);

    return new Promise((resolve) => {
      this.resolve = resolve;
      this.queue = [];

      for (let i = 0; i < length; i++) {
        const from = oldText[i] || '';
        const to = newText[i] || '';
        // Randomize start/end times with speed factor
        const start = Math.floor(Math.random() * (40 / this.speed));
        const end = start + Math.floor(Math.random() * (40 / this.speed));
        this.queue.push({ from, to, start, end });
      }

      this.frame = 0;
      this.update();
    });
  }

  /**
   * Scramble with staggered reveal (characters lock in from left to right)
   */
  setTextStaggered(newText: string, staggerAmount: number = 2): Promise<void> {
    if (this.frameRequest) {
      cancelAnimationFrame(this.frameRequest);
      this.frameRequest = null;
    }

    const oldText = this.element.innerText;
    const length = Math.max(oldText.length, newText.length);

    return new Promise((resolve) => {
      this.resolve = resolve;
      this.queue = [];

      for (let i = 0; i < length; i++) {
        const from = oldText[i] || '';
        const to = newText[i] || '';
        // Characters further right start and end later
        const baseDelay = Math.floor(i * staggerAmount / this.speed);
        const start = baseDelay + Math.floor(Math.random() * (20 / this.speed));
        const end = start + Math.floor(Math.random() * (30 / this.speed));
        this.queue.push({ from, to, start, end });
      }

      this.frame = 0;
      this.update();
    });
  }

  private update = () => {
    let output = '';
    let complete = 0;

    for (let i = 0; i < this.queue.length; i++) {
      const item = this.queue[i];
      const { from, to, start, end } = item;

      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        // Scrambling phase - randomly change character
        if (!item.char || Math.random() < 0.28) {
          item.char = this.randomChar();
        }
        output += `<span class="scramble-char">${item.char}</span>`;
      } else {
        // Not yet started - show original
        output += from;
      }
    }

    this.element.innerHTML = output;

    if (complete === this.queue.length) {
      // Animation complete
      this.frameRequest = null;
      this.resolve?.();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  };

  private randomChar(): string {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }

  /**
   * Cancel the current animation
   */
  cancel(): void {
    if (this.frameRequest) {
      cancelAnimationFrame(this.frameRequest);
      this.frameRequest = null;
    }
  }

  /**
   * Reset to original content
   */
  reset(): void {
    this.cancel();
    this.element.innerHTML = this.originalHtml;
  }

  /**
   * Check if currently animating
   */
  isAnimating(): boolean {
    return this.frameRequest !== null;
  }
}

/**
 * Create a scrambler for an element
 */
export function createScrambler(
  element: HTMLElement,
  options?: TextScramblerOptions
): TextScrambler {
  return new TextScrambler(element, options);
}

/**
 * Scramble multiple elements with staggered starts
 * Returns a promise that resolves when all animations complete
 */
export async function scrambleElements(
  elements: HTMLElement[],
  newTexts: string[],
  options?: TextScramblerOptions & { delayBetween?: number }
): Promise<void> {
  const { delayBetween = 200, ...scramblerOptions } = options ?? {};

  const promises: Promise<void>[] = [];

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    const newText = newTexts[i];

    if (!element || newText === undefined) continue;

    // Add delay for staggered effect
    const delay = i * delayBetween;

    const promise = new Promise<void>((resolve) => {
      setTimeout(() => {
        const scrambler = new TextScrambler(element, scramblerOptions);
        scrambler.setText(newText).then(resolve);
      }, delay);
    });

    promises.push(promise);
  }

  await Promise.all(promises);
}

/**
 * Scramble sentences within a paragraph element
 * Sentences are replaced one at a time for a "spreading corruption" effect
 */
export async function scrambleSentences(
  element: HTMLElement,
  newText: string,
  options?: TextScramblerOptions & { delayBetween?: number }
): Promise<void> {
  const { delayBetween = 300, ...scramblerOptions } = options ?? {};

  const oldText = element.innerText;

  // Split into sentences
  const oldSentences = splitIntoSentences(oldText);
  const newSentences = splitIntoSentences(newText);

  // Create spans for each sentence
  element.innerHTML = oldSentences
    .map((s, i) => `<span data-sentence="${i}">${s}</span>`)
    .join(' ');

  const sentenceSpans = element.querySelectorAll<HTMLElement>('[data-sentence]');

  // Scramble each sentence with delay
  for (let i = 0; i < sentenceSpans.length; i++) {
    const span = sentenceSpans[i];
    const newSentence = newSentences[i] ?? oldSentences[i];

    if (i > 0) {
      await delay(delayBetween);
    }

    const scrambler = new TextScrambler(span, scramblerOptions);
    await scrambler.setText(newSentence);
  }

  // Clean up - replace with final text (no spans)
  element.innerText = newSentences.join(' ');
}

/**
 * Split text into sentences
 */
function splitIntoSentences(text: string): string[] {
  // Split on sentence-ending punctuation followed by space or end
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/**
 * Utility delay function
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
