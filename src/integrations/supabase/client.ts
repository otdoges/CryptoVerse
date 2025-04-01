
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const supabaseUrl = "https://gqhzgevrsnqnbuqrkorl.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxaHpnZXZyc25xbmJ1cXJrb3JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0ODk1NjAsImV4cCI6MjA1OTA2NTU2MH0.zDiNV7L_7trFIrTVfCqJ8RNttztz3vsKlUnZdJf1Ags";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
