import { UserPublicDto } from '../../advert/model';

export interface CreateReviewRequest {
  text: string;
}

interface AdvertPublicDto {
  id: string;
  creator: UserPublicDto;
  title: string;
  description: string;
  status: 'ACTIVE' | 'IN_PROGRESS' | 'FINISHED' | 'DELETED';
  type: 'STUDENT' | 'MENTOR';
}

export interface ItemResponseReviewDto {
  data: ReviewDto;
  status: number;
  message?: string;
}

export interface ListResponseReviewDto {
  data: ReviewDto[];
  status: number;
  message?: string;
}

export interface ListResponseAdvertsWithoutReviewDto {
  data: AdvertPublicDto[];
  status: number;
  message?: string;
}

export type WhatHelpedItem =
  | 'EXAMPLES'
  | 'STEP_BY_STEP_EXPLANATION'
  | 'ANALOGIES'
  | 'VISUAL_SCHEMES';

export type WhatCanBeImprovedItem =
  | 'EXPLANATION_SPEED'
  | 'MORE_EXAMPLES'
  | 'CLEAR_EXPLANATIONS'
  | 'NOTHING';

export type WhatDidYouLikeItem =
  | 'QUICK_INVOLVEMENT'
  | 'CLEAR_QUESTIONS'
  | 'UNDERSTOOD_EXPLANATION'
  | 'FOCUSED_ON_RESULT';

export type DifficultyItem =
  | 'UNCLEAR_PROBLEM'
  | 'NOT_INTERESTED'
  | 'NOT_INVOLVED'
  | 'BROKE_AGREEMENTS';

export interface MentorReviewContent {
  comprehensibility: number;
  involvedness: number;
  compliance: number;
  usefulness: number;
  whatHelped: WhatHelpedItem[];
  whatCanBeImproved: WhatCanBeImprovedItem[];
  wouldAskAgain: boolean;
}

export interface StudentReviewContent {
  preparedness: number;
  activity: number;
  politeness: number;
  proactivity: number;
  whatDidYouLike: WhatDidYouLikeItem[];
  difficulties: DifficultyItem[];
  wouldHelpAgain: boolean;
}

export interface ReviewDto {
  id: string;
  reviewer: UserPublicDto;
  reviewee: UserPublicDto;
  advert: AdvertPublicDto;
  type: 'MENTOR' | 'STUDENT';
  text: string;
  createdOn: string;
  content: MentorReviewContent | StudentReviewContent;
}
