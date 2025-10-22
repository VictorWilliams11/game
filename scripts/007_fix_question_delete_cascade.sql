-- Drop the existing foreign key constraint on exam_answers
ALTER TABLE public.exam_answers
DROP CONSTRAINT exam_answers_question_id_fkey;

-- Add the foreign key constraint with CASCADE delete
ALTER TABLE public.exam_answers
ADD CONSTRAINT exam_answers_question_id_fkey
FOREIGN KEY (question_id) REFERENCES public.questions(id) ON DELETE CASCADE;
