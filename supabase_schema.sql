-- ==========================================
-- STUDENT HUB: PROFILES TABLE SCHEMA
-- Run this script in the Supabase SQL Editor
-- ==========================================

-- 1. Create the profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    full_name TEXT,
    email TEXT,
    phone TEXT,
    college TEXT,
    branch TEXT,
    year TEXT,
    bio TEXT,
    profile_photo TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies

-- Policy A: Allow users to view their own profile only
CREATE POLICY "Allow users to view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Policy B: Allow users to insert their own profile only
CREATE POLICY "Allow users to insert own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policy C: Allow users to update their own profile only
CREATE POLICY "Allow users to update own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);
