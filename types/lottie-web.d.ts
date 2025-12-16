declare module "lottie-web" {
  export interface AnimationConfig {
    container: HTMLElement;
    renderer: "svg" | "canvas" | "html";
    loop?: boolean | number;
    autoplay?: boolean;
    animationData?: any;
    path?: string;
    rendererSettings?: {
      preserveAspectRatio?: string;
      [key: string]: any;
    };
    [key: string]: any;
  }

  export interface AnimationItem {
    play(): void;
    pause(): void;
    stop(): void;
    destroy(): void;
    setSpeed(speed: number): void;
    setDirection(direction: number): void;
    goToAndPlay(value: number, isFrame?: boolean): void;
    goToAndStop(value: number, isFrame?: boolean): void;
    setSegment(init: number, end: number): void;
    addEventListener(eventName: string, callback: () => void): void;
    removeEventListener(eventName: string, callback: () => void): void;
    [key: string]: any;
  }

  function loadAnimation(params: AnimationConfig): AnimationItem;

  const lottie: {
    loadAnimation: typeof loadAnimation;
  };

  export default lottie;
}

