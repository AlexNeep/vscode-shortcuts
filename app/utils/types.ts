declare global {
  interface Window {
    dataLayer: any;
    fathom: any;
  }
}

import { firestore } from "firebase-admin";
import { Lesson } from "~/routes/lessons/$lessonId";
import { LanguageCode } from "./languages";
import { ExamplePrompt } from "./prompt";

export type InputWord = {
  id: string;
  language_code: LanguageCode;
  variations: string[];
  created_at: firestore.Timestamp;
  updated_at: firestore.Timestamp;
} & WordDefinition;

export type WordDefinition = {
  id: string;
  lemma: string;
  word_with_gender: string | null;
  translation: string;
  definition: string;
  example_sentence: string;
  word_type: string;
};

export type UserWord = {
  id: string;
  word_id: string;
  uid: string;
  created_at: firestore.Timestamp;
  updated_at: firestore.Timestamp;
  language_code: LanguageCode;
  status: "learned" | "marked_as_known" | "needs_attention";
};

export type Input = {
  prompt: string;
  isCorrect?: boolean;
  correction?: string;
  response?: InputResponse;
  audio?: { key: string; cdn_url?: string };
  completed?: boolean;
  words?: InputWord[];
  user_words?: {
    word_id: string;
    learned: boolean;
    status: UserWord["status"];
  }[];
};

export type InputResponse = {
  text: string;
  translation?: string;
};

export type Scenario = {
  id: string;
  title: string;
  description: string;
  background_prompt: string;
  example_prompts?: ExamplePrompt[];
  approved: boolean;
};

export type QuizWords = { [key in LanguageCode]: string[] };

export type ScenarioDescription = {
  question: string;
  prompt: string;
  information: string[];
  ai_help?: string;
};

export type SelectedScenarioDescription = {
  question: string;
  prompt: string;
  key_information?: string;
  ai_help?: string;
};

export type Mode = "guided" | "free-roam" | "start";

export type Category = {
  id: string;
  title: string;
  image?: string;
  count: number;
};

export type DynamicScenario = {
  categories: { id: Category["id"]; title: Category["title"] }[];
  category_ids: Category["id"][];
  approved: boolean;
  id: string;
  title: string;
  summary: string;
  description?: ScenarioDescription[];
  background_prompt: string;
  quiz_words?: QuizWords;
  author_uid?: Uid;
  author_email?: string;
  guest_access?: boolean;
  free_roam?: {
    background: string;
    description: string;
  };
  modes?: Mode[];
};

export type SelectedKeyInformation = {
  id: string;
  question?: string;
  value: string;
};
export type KeyInformation = {
  id: string;
  question?: string;
  values: string[];
};

export type Uid = string;

export type UserProfile = {
  email?: string;
  uid: Uid;
  tokens: number;
  messages: number;
  customer_number?: string;
  plan?: string;
  base_language?: LanguageCode;
  target_language?: LanguageCode;
  marketing_emails?: boolean;
  last_login?: firestore.Timestamp;
  streak_last_updated?: firestore.Timestamp;
  streak?: number;
  beta_tester?: boolean;
  gems?: number;
  completed_scenarios?: string[];
  in_progress_scenarios?: string[];
  completed_lessons?: {
    lesson_id: Lesson["id"];
    target_language_code: LanguageCode;
  }[];
  in_progress_lessons?: {
    lesson_id: Lesson["id"];
    target_language_code: LanguageCode;
  }[];
  referrer?: string;
  created_at?: firestore.Timestamp;
};

export type PriceTiers = "basic" | "pro" | "ultra";

export type Difficulty = "beginner" | "intermediate";

export type WordSource = "active" | "passive" | "success" | "failed";

export type WordSourceCount = Record<WordSource, firestore.FieldValue | number>;

export type WordEntry = {
  uid: Uid;
  word: string;
  count: firestore.FieldValue;
  counts: WordSourceCount;
  language_code: LanguageCode;
  updated_at: firestore.FieldValue;
};

export enum Model {
  curie = "text-curie-001",
  davinci = "text-davinci-003",
  chatGPT = "gpt-3.5-turbo",
}

export enum ModelErrors {
  DEFAULT = "Our service is unavailable right now as it is in high demand. We're thrilled to have so many users! Fear not, we're hustling to make some room and get things back up to speed faster than a cheetah on roller skates. In the meantime, hang tight and enjoy some cat videos (we won't judge). Thanks for your patience and for being a part of our community!",
}

export enum Errors {
  DEFAULT = "Something went wrong. Please try again later!",
}

export enum ProgressType {
  quiz = "quiz",
  conversation = "conversation",
}
