import {Animation} from './animation';

export interface SlideContent {
  id: number;
  slideId: number;

  text: string|null;
  image: string|null;

  video: string|null;
  scale: number;

  zIndex: number;
  positionX: number;
  positionY: number;
  centerHorizontal?: boolean;
  centerVertical?: boolean;

  inAnimation: Animation | null;
  outAnimation: Animation | null;
}
