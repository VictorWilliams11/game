-- Insert default exam types
INSERT INTO public.exam_types (name, description) VALUES
  ('JAMB', 'Joint Admissions and Matriculation Board - University entrance exam'),
  ('WAEC', 'West African Examinations Council - Secondary school certificate'),
  ('NECO', 'National Examinations Council - Secondary school certificate')
ON CONFLICT (name) DO NOTHING;

-- Insert common subjects for each exam type
DO $$
DECLARE
  jamb_id UUID;
  waec_id UUID;
  neco_id UUID;
BEGIN
  SELECT id INTO jamb_id FROM public.exam_types WHERE name = 'JAMB';
  SELECT id INTO waec_id FROM public.exam_types WHERE name = 'WAEC';
  SELECT id INTO neco_id FROM public.exam_types WHERE name = 'NECO';

  -- JAMB subjects
  INSERT INTO public.subjects (name, exam_type_id) VALUES
    ('Mathematics', jamb_id),
    ('English Language', jamb_id),
    ('Physics', jamb_id),
    ('Chemistry', jamb_id),
    ('Biology', jamb_id),
    ('Economics', jamb_id),
    ('Government', jamb_id),
    ('Literature in English', jamb_id),
    ('Commerce', jamb_id),
    ('Accounting', jamb_id)
  ON CONFLICT (name, exam_type_id) DO NOTHING;

  -- WAEC subjects
  INSERT INTO public.subjects (name, exam_type_id) VALUES
    ('Mathematics', waec_id),
    ('English Language', waec_id),
    ('Physics', waec_id),
    ('Chemistry', waec_id),
    ('Biology', waec_id),
    ('Economics', waec_id),
    ('Government', waec_id),
    ('Literature in English', waec_id),
    ('Commerce', waec_id),
    ('Accounting', waec_id)
  ON CONFLICT (name, exam_type_id) DO NOTHING;

  -- NECO subjects
  INSERT INTO public.subjects (name, exam_type_id) VALUES
    ('Mathematics', neco_id),
    ('English Language', neco_id),
    ('Physics', neco_id),
    ('Chemistry', neco_id),
    ('Biology', neco_id),
    ('Economics', neco_id),
    ('Government', neco_id),
    ('Literature in English', neco_id),
    ('Commerce', neco_id),
    ('Accounting', neco_id)
  ON CONFLICT (name, exam_type_id) DO NOTHING;
END $$;
