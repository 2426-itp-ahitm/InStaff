export interface Feedback {
  message: string;
  type: 'success' | 'error' | 'info';
  showFeedback: boolean;
}
