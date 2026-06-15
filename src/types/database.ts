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
  created_at: string;
  updated_at: string;
};

export type TradeScreenshot = {
  id: string;
  trade_id: string;
  user_id: string;
  storage_path: string;
  caption: string | null;
  created_at: string;
};

export type Profile = {
  id: string;
  display_name: string | null;
  default_currency: string;
  created_at: string;
};

export type Account = {
  id: string;
  user_id: string;
  name: string;
  broker: string | null;
  starting_balance: number;
  currency: string;
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
          default_currency?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          default_currency?: string;
          created_at?: string;
        };
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
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          broker?: string | null;
          starting_balance?: number;
          currency?: string;
          created_at?: string;
        };
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
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          account_id?: string | null;
          symbol?: string;
          direction?: TradeDirection;
          asset_class?: AssetClass;
          quantity?: number;
          entry_price?: number;
          exit_price?: number | null;
          entry_at?: string;
          exit_at?: string | null;
          stop_loss?: number | null;
          take_profit?: number | null;
          fees?: number;
          pre_trade_notes?: string | null;
          post_trade_notes?: string | null;
          emotional_state?: EmotionalState | null;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
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
          created_at?: string;
        };
        Update: {
          id?: string;
          trade_id?: string;
          user_id?: string;
          storage_path?: string;
          caption?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      asset_class: AssetClass;
      trade_direction: TradeDirection;
      emotional_state: EmotionalState;
    };
    CompositeTypes: Record<string, never>;
  };
};
