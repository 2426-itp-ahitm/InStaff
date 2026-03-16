import {Animation} from './animation';

export interface SlideContent {
  id: number;
  slideId: number;

  text: string|null;
  image: string|null;

  zIndex: number;
  positionX: number;
  positionY: number;

  inAnimation: Animation | null;
  outAnimation: Animation | null;
}
