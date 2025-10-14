-- Add PDF URL column to literature table (if using separate literature table)
-- If literature is stored in study_notes, we'll add pdf_url there

-- Add pdf_url column to study_notes for PDF literature support
ALTER TABLE public.study_notes ADD COLUMN IF NOT EXISTS pdf_url TEXT;

-- Add a type column to distinguish between notes and literature
ALTER TABLE public.study_notes ADD COLUMN IF NOT EXISTS content_type TEXT DEFAULT 'note' CHECK (content_type IN ('note', 'literature'));

-- Update existing records to be 'note' type
UPDATE public.study_notes SET content_type = 'note' WHERE content_type IS NULL;

-- Add author column for literature
ALTER TABLE public.study_notes ADD COLUMN IF NOT EXISTS author TEXT;

-- Add description column for literature
ALTER TABLE public.study_notes ADD COLUMN IF NOT EXISTS description TEXT;
