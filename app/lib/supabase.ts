import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

const SUPABASE_URL ='https://vtfgkddqmipfeeutyasu.supabase.co';
 const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0ZmdrZGRxbWlwZmVldXR5YXN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxODE3MjUsImV4cCI6MjA3OTc1NzcyNX0.dbjknIWxJFxMhj9nyw-Z6GesIhiFUc5f27vA1ma3eFg';
 
 export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);