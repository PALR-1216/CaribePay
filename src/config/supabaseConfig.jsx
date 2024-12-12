import { createClient } from "@supabase/supabase-js"
const SUPABASE_URL = 'https://qzeelrkoomupwvpcthou.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6ZWVscmtvb211cHd2cGN0aG91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIxNTY0MTIsImV4cCI6MjA0NzczMjQxMn0.ZaIfGWUU1g30Lmt0J5ld4csk-yHIULBz8aNrZCwcfCg';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);