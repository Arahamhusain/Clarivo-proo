import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vpgthozswpqfzocuuwcs.supabase.co';
const supabaseAnonKey = 
sb_publishable_uUGRqZLGJkjsuT_N5gpG_g_I2EmJ1CJ

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Campaign {
  id: string;
  product_description: string;
  target_audience: string;
  created_at: string;
}

export interface Persona {
  id: string;
  campaign_id: string;
  name: string;
  age: number;
  occupation: string;
  location: string;
  pain_points: string[];
  motivations: string[];
  tech_savviness: 'Low' | 'Medium' | 'High';
  avatar_seed: string;
  created_at: string;
}
