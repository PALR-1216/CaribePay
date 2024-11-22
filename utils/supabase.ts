import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { AppState } from 'react-native'

const supabaseUrl = 'https://qzeelrkoomupwvpcthou.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6ZWVscmtvb211cHd2cGN0aG91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIxNTY0MTIsImV4cCI6MjA0NzczMjQxMn0.ZaIfGWUU1g30Lmt0J5ld4csk-yHIULBz8aNrZCwcfCg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});

//add the user to use state
AppState.addEventListener('change', (state) => {
    if (state === 'active') {
        supabase.auth.startAutoRefresh()
    } else {
        supabase.auth.stopAutoRefresh()
    }
})