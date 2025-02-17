export interface ChessDotComMember {
  stats: Stat[];
  lastType: string;
  versus: Versus;
  ratingOnlyStats: string[];
  officialRating: any;
  lessonLevel: LessonLevel;
}

export interface Stat {
  key: string;
  stats: Stats;
  gameCount: number;
  lastPlayed: boolean;
  lastDate?: string;
}

export interface Stats {
  highest_score?: number;
  highest_type_code?: string;
  avg_score?: number;
  attempt_count?: number;
  puzzle_attempts_total?: number;
  modes?: Modes;
  rating: any;
  highest_rating?: number;
  highest_rating_date: any;
  rating_time_change_days?: number;
  rating_time_change_value?: number;
  highest_rating_info?: HighestRatingInfo;
  lowest_rating_info?: LowestRatingInfo;
  total_seconds?: number;
  lowest_rating?: number;
  lowest_rating_date?: number;
  passed_count?: number;
  failed_count?: number;
  last_date?: string;
  total_game_count?: number;
  total_win_count?: number;
  total_loss_count?: number;
  total_draw_count?: number;
  avg_opponent_rating?: number;
  highest_opponent_rating?: number;
  best_win_opponent?: BestWinOpponent;
  best_win_opponent_id?: number;
  timeout_percent?: number;
  timeout_days?: number;
  total_in_progress_count?: number;
  avg_move_time?: number;
}

export interface Modes {
  five_minutes: number;
  three_minutes: number;
  three_strikes: number;
}

export interface HighestRatingInfo {
  timestamp: number;
  rating: number;
}

export interface LowestRatingInfo {
  timestamp: number;
  rating: number;
}

export interface BestWinOpponent {
  country: Country;
  id: number;
  create_date: string;
  username: string;
  first_name?: string;
  last_name?: string;
  country_id: number;
  last_login_date: string;
  points: number;
  is_enabled: boolean;
  membership_level: number;
}

export interface Country {
  id: number;
  code: string;
  name: string;
  iso3: string;
  currency_code: string;
  phone_code: number;
}

export interface Versus {
  total: number;
}

export interface LessonLevel {
  icon: string;
  name: string;
  progress: number;
}
