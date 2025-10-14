-- Add support for multiple subjects per exam session

-- Create junction table for exam sessions and subjects
CREATE TABLE IF NOT EXISTS public.exam_session_subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_session_id UUID NOT NULL REFERENCES public.exam_sessions(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  questions_count INTEGER NOT NULL DEFAULT 0,
  correct_answers INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(exam_session_id, subject_id)
);

-- Create literature table (separate from notes)
CREATE TABLE IF NOT EXISTS public.literature (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author TEXT,
  exam_type_id UUID NOT NULL REFERENCES public.exam_types(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  description TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.exam_session_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.literature ENABLE ROW LEVEL SECURITY;

-- Policies for exam_session_subjects
CREATE POLICY "Users can view their own exam session subjects" ON public.exam_session_subjects FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.exam_sessions WHERE id = exam_session_id AND user_id = auth.uid())
);

CREATE POLICY "Users can insert their own exam session subjects" ON public.exam_session_subjects FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.exam_sessions WHERE id = exam_session_id AND user_id = auth.uid())
);

CREATE POLICY "Users can update their own exam session subjects" ON public.exam_session_subjects FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.exam_sessions WHERE id = exam_session_id AND user_id = auth.uid())
);

-- Policies for literature (public read, admin write)
CREATE POLICY "Anyone can view literature" ON public.literature FOR SELECT USING (true);

CREATE POLICY "Admins can insert literature" ON public.literature FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admins can update literature" ON public.literature FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admins can delete literature" ON public.literature FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
