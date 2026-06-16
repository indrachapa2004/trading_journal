export type AssetClass =
  | "stocks"
  | "forex"
  | "crypto"
  | "options"
  | "futures";
export type TradeDirection = "long" | "short";
export type EmotionalState =
  | "calm"
  | "confident"
  | "anxious"
  | "fomo"
  | "revenge";
export type ScreenshotPhase = "before" | "after";

export type TradeMistake =
  | "felt_fomo"
  | "moved_stop_loss"
  | "revenge_trade"
  | "early_exit";

export type Trade = {
  id: string;
  user_id: string;
  account_id: string | null;
  symbol: string;
  direction: TradeDirection;
  asset_class: AssetClass;
  quantity: number;
  entry_price: number;
  exit_price: number | null;
  entry_at: string;
  exit_at: string | null;
  stop_loss: number | null;
  take_profit: number | null;
  fees: number;
  pre_trade_notes: string | null;
  post_trade_notes: string | null;
  emotional_state: EmotionalState | null;
  tags: string[];
  mistakes: TradeMistake[];
  self_rating: number | null;
  rules_acknowledged: string[];
  screenshot_url: string | null;
  created_at: string;
  updated_at: string;
};

export type TradeScreenshot = {
  id: string;
  trade_id: string;
  user_id: string;
  storage_path: string;
  caption: string | null;
  phase: ScreenshotPhase;
  created_at: string;
};

export type TradingExperience = "beginner" | "intermediate" | "pro";

export type Profile = {
  id: string;
  display_name: string | null;
  first_name: string | null;
  last_name: string | null;
  trading_experience: TradingExperience | null;
  onboarding_completed: boolean;
  primary_asset_class: string | null;
  default_currency: string;
  daily_loss_limit: number | null;
  weekly_loss_limit: number | null;
  active_account_id: string | null;
  created_at: string;
};

export type Account = {
  id: string;
  user_id: string;
  name: string;
  broker: string | null;
  starting_balance: number;
  currency: string;
  is_default: boolean;
  risk_per_trade_percent: number;
  created_at: string;
};

export type TradingRule = {
  id: string;
  user_id: string;
  label: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
};

export type MonthlyGoal = {
  id: string;
  user_id: string;
  account_id: string;
  year: number;
  month: number;
  pnl_target: number | null;
  win_rate_target: number | null;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: {
          id: string;
          display_name?: string | null;
          first_name?: string | null;
          last_name?: string | null;
          trading_experience?: TradingExperience | null;
          onboarding_completed?: boolean;
          primary_asset_class?: string | null;
          default_currency?: string;
          daily_loss_limit?: number | null;
          weekly_loss_limit?: number | null;
          active_account_id?: string | null;
          created_at?: string;
        };
        Update: Partial<Profile>;
        Relationships: [];
      };
      accounts: {
        Row: Account;
        Insert: {
          id?: string;
          user_id: string;
          name?: string;
          broker?: string | null;
          starting_balance?: number;
          currency?: string;
          is_default?: boolean;
          risk_per_trade_percent?: number;
          created_at?: string;
        };
        Update: Partial<Account>;
        Relationships: [];
      };
      trades: {
        Row: Trade;
        Insert: {
          id?: string;
          user_id: string;
          account_id?: string | null;
          symbol: string;
          direction: TradeDirection;
          asset_class?: AssetClass;
          quantity: number;
          entry_price: number;
          exit_price?: number | null;
          entry_at: string;
          exit_at?: string | null;
          stop_loss?: number | null;
          take_profit?: number | null;
          fees?: number;
          pre_trade_notes?: string | null;
          post_trade_notes?: string | null;
          emotional_state?: EmotionalState | null;
          tags?: string[];
          mistakes?: TradeMistake[];
          self_rating?: number | null;
          rules_acknowledged?: string[];
          screenshot_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Trade>;
        Relationships: [];
      };
      trade_screenshots: {
        Row: TradeScreenshot;
        Insert: {
          id?: string;
          trade_id: string;
          user_id: string;
          storage_path: string;
          caption?: string | null;
          phase?: ScreenshotPhase;
          created_at?: string;
        };
        Update: Partial<TradeScreenshot>;
        Relationships: [];
      };
      trading_rules: {
        Row: TradingRule;
        Insert: {
          id?: string;
          user_id: string;
          label: string;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: Partial<TradingRule>;
        Relationships: [];
      };
      monthly_goals: {
        Row: MonthlyGoal;
        Insert: {
          id?: string;
          user_id: string;
          account_id: string;
          year: number;
          month: number;
          pnl_target?: number | null;
          win_rate_target?: number | null;
          created_at?: string;
        };
        Update: Partial<MonthlyGoal>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      asset_class: AssetClass;
      trade_direction: TradeDirection;
      emotional_state: EmotionalState;
      screenshot_phase: ScreenshotPhase;
    };
    CompositeTypes: Record<string, never>;
  };
};
