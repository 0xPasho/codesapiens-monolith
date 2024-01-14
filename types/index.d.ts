export type SubscriptionPlan = {
  name: string;
  description: string;
  stripePriceId: string;
  maxSeats: number;
  maxQuestions: number;
  maxFilesProcessed: number;
  seatsPriceId: string;
  filesPriceId: string;
  questionsPriceId: string;
};
