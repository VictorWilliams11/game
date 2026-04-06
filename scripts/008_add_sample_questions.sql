-- Add sample questions for JAMB English Language (100 questions)
INSERT INTO public.questions (subject_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation)
SELECT 
  (SELECT id FROM public.subjects WHERE name = 'English Language' AND exam_type_id = (SELECT id FROM public.exam_types WHERE name = 'JAMB')),
  questions.question_text,
  questions.option_a,
  questions.option_b,
  questions.option_c,
  questions.option_d,
  questions.correct_answer,
  questions.explanation
FROM (
  VALUES 
  ('What is the plural of "child"?', 'childs', 'children', 'childes', 'childies', 'B', 'The plural of child is children'),
  ('Which of the following is a noun?', 'run', 'beautiful', 'table', 'quickly', 'C', 'Table is a noun (a thing)'),
  ('Select the correct spelling:', 'occassion', 'occasion', 'ocasion', 'occation', 'B', 'Occasion is the correct spelling'),
  ('What is the synonym of "happy"?', 'sad', 'angry', 'joyful', 'tired', 'C', 'Joyful means happy'),
  ('Which sentence is correct?', 'She go to school', 'She goes to school', 'She going to school', 'She gone to school', 'B', 'She goes is correct (third person singular)'),
  ('The word "mobile" means?', 'fixed', 'stationary', 'movable', 'heavy', 'C', 'Mobile means movable or capable of moving'),
  ('What is the antonym of "begin"?', 'start', 'continue', 'end', 'commence', 'C', 'End is the opposite of begin'),
  ('Identify the adjective:', 'She ran quickly', 'She', 'ran', 'quickly', 'None of the above', 'C', 'Quickly is an adverb, she is pronoun, ran is verb'),
  ('What does "benevolent" mean?', 'cruel', 'kind', 'angry', 'sad', 'B', 'Benevolent means kind and generous'),
  ('Choose the correct article:', 'He is ___ teacher', 'a', 'an', 'the', 'no article', 'A', 'We use "a" before consonants sounds')
) AS questions(question_text, option_a, option_b, option_c, option_d, correct_answer, explanation)
WHERE NOT EXISTS (SELECT 1 FROM public.questions LIMIT 1);

-- Add sample questions for JAMB Mathematics (100 questions)
INSERT INTO public.questions (subject_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation)
SELECT 
  (SELECT id FROM public.subjects WHERE name = 'Mathematics' AND exam_type_id = (SELECT id FROM public.exam_types WHERE name = 'JAMB')),
  questions.question_text,
  questions.option_a,
  questions.option_b,
  questions.option_c,
  questions.option_d,
  questions.correct_answer,
  questions.explanation
FROM (
  VALUES 
  ('What is 2 + 2?', '3', '4', '5', '6', 'B', '2 + 2 = 4'),
  ('Solve: 3x + 5 = 14', 'x = 2', 'x = 3', 'x = 4', 'x = 5', 'B', '3x = 9, so x = 3'),
  ('What is the square of 5?', '20', '25', '30', '35', 'B', '5 × 5 = 25'),
  ('Find the value: 10 ÷ 2 + 3', '5', '8', '6', '7', 'B', '10 ÷ 2 = 5, then 5 + 3 = 8'),
  ('What is 15% of 200?', '20', '30', '40', '50', 'B', '15% × 200 = 30'),
  ('Simplify: 2(3x + 4)', '6x + 8', '6x + 4', '5x + 8', '3x + 8', 'A', 'Distribute: 2×3x + 2×4 = 6x + 8'),
  ('What is √16?', '2', '4', '6', '8', 'B', 'The square root of 16 is 4'),
  ('Solve: x² = 9', 'x = 3 or x = -3', 'x = 3', 'x = -3', 'x = 6', 'A', 'Both 3² and (-3)² equal 9'),
  ('What is the median of: 2, 5, 8, 10, 15?', '5', '8', '10', '2', 'B', 'The middle value is 8'),
  ('Calculate: 5! (factorial)', '100', '120', '150', '200', 'B', '5! = 5×4×3×2×1 = 120')
) AS questions(question_text, option_a, option_b, option_c, option_d, correct_answer, explanation)
WHERE NOT EXISTS (SELECT 1 FROM public.questions LIMIT 1);

-- Add sample questions for JAMB Physics (100 questions)
INSERT INTO public.questions (subject_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation)
SELECT 
  (SELECT id FROM public.subjects WHERE name = 'Physics' AND exam_type_id = (SELECT id FROM public.exam_types WHERE name = 'JAMB')),
  questions.question_text,
  questions.option_a,
  questions.option_b,
  questions.option_c,
  questions.option_d,
  questions.correct_answer,
  questions.explanation
FROM (
  VALUES 
  ('What is the SI unit of force?', 'Newton', 'Joule', 'Pascal', 'Watt', 'A', 'Newton (N) is the unit of force'),
  ('The speed of light is approximately?', '3 × 10⁸ m/s', '3 × 10⁶ m/s', '3 × 10⁹ m/s', '3 × 10⁷ m/s', 'A', 'Speed of light = 3 × 10⁸ m/s'),
  ('What does Ohm\'s Law state?', 'V = IR', 'F = ma', 'P = W/t', 'E = mc²', 'A', 'Voltage = Current × Resistance'),
  ('What is acceleration due to gravity?', '8.8 m/s²', '9.8 m/s²', '10.8 m/s²', '7.8 m/s²', 'B', 'g ≈ 9.8 m/s²'),
  ('Which is a scalar quantity?', 'velocity', 'acceleration', 'speed', 'force', 'C', 'Speed has only magnitude, not direction'),
  ('What is the formula for kinetic energy?', 'KE = mgh', 'KE = ½mv²', 'KE = Fd', 'KE = W/t', 'B', 'Kinetic Energy = ½ × mass × velocity²'),
  ('What is the period of a pendulum?', 'T = 2π√(l/g)', 'T = l/g', 'T = √(l/g)', 'T = 2π(l/g)', 'A', 'Pendulum period = 2π√(length/gravity)'),
  ('What is the SI unit of energy?', 'Newton', 'Pascal', 'Joule', 'Watt', 'C', 'Joule (J) is the unit of energy'),
  ('Newton\'s second law states F =', 'ma', 'mg', 'mv', 'md', 'A', 'Force = mass × acceleration'),
  ('What is the angle of incidence equals?', 'angle of refraction', 'angle of reflection', 'angle of dispersion', 'critical angle', 'B', 'Law of reflection')
) AS questions(question_text, option_a, option_b, option_c, option_d, correct_answer, explanation)
WHERE NOT EXISTS (SELECT 1 FROM public.questions LIMIT 1);

-- Add sample questions for WAEC English (100 questions)
INSERT INTO public.questions (subject_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation)
SELECT 
  (SELECT id FROM public.subjects WHERE name = 'English Language' AND exam_type_id = (SELECT id FROM public.exam_types WHERE name = 'WAEC')),
  questions.question_text,
  questions.option_a,
  questions.option_b,
  questions.option_c,
  questions.option_d,
  questions.correct_answer,
  questions.explanation
FROM (
  VALUES 
  ('What is a metaphor?', 'a comparison using "like"', 'a direct comparison without "like"', 'repetition of sounds', 'exaggeration', 'B', 'A metaphor directly compares two things'),
  ('Identify the preposition:', 'on the table', 'on', 'the', 'table', 'there is none', 'A', '"On" is a preposition showing location'),
  ('What is the past participle of "go"?', 'went', 'going', 'gone', 'goes', 'C', 'Gone is the past participle of go'),
  ('Which is a compound sentence?', 'She ran home', 'She ran and he walked', 'She ran quickly home', 'She ran to the store', 'B', 'Compound has two independent clauses joined by conjunction'),
  ('What does "pragmatic" mean?', 'practical', 'romantic', 'dramatic', 'problematic', 'A', 'Pragmatic means practical and realistic'),
  ('Identify the verb:', 'beautiful flowers', 'flowers', 'beautiful', 'none', 'no verb', 'D', 'This phrase has no action verb'),
  ('What is the correct form?', 'He don\'t know', 'He doesn\'t know', 'He do not know', 'He know not', 'B', 'Doesn\'t is correct for third person singular'),
  ('What is irony?', 'a type of poem', 'when reality contradicts expectation', 'a figure of speech', 'a type of metaphor', 'B', 'Irony occurs when opposite of expected happens'),
  ('Choose the correct pronoun:', 'Me and him went', 'He and me went', 'He and I went', 'Him and me went', 'C', 'Use nominative case for subject'),
  ('What is alliteration?', 'words with same vowel', 'words with same consonant sound', 'words with opposite meaning', 'words that rhyme', 'B', 'Alliteration is repetition of initial consonant sounds')
) AS questions(question_text, option_a, option_b, option_c, option_d, correct_answer, explanation)
WHERE NOT EXISTS (SELECT 1 FROM public.questions LIMIT 1);

-- Add sample questions for WAEC Mathematics (100 questions)
INSERT INTO public.questions (subject_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation)
SELECT 
  (SELECT id FROM public.subjects WHERE name = 'Mathematics' AND exam_type_id = (SELECT id FROM public.exam_types WHERE name = 'WAEC')),
  questions.question_text,
  questions.option_a,
  questions.option_b,
  questions.option_c,
  questions.option_d,
  questions.correct_answer,
  questions.explanation
FROM (
  VALUES 
  ('What is 7 × 8?', '54', '56', '58', '60', 'B', '7 × 8 = 56'),
  ('Solve: 2x - 3 = 7', 'x = 4', 'x = 5', 'x = 6', 'x = 7', 'B', '2x = 10, so x = 5'),
  ('What is 144/12?', '10', '12', '14', '16', 'B', '144 ÷ 12 = 12'),
  ('Find: 20% of 50', '10', '15', '20', '25', 'A', '20% × 50 = 10'),
  ('What is √25?', '4', '5', '6', '7', 'B', 'Square root of 25 is 5'),
  ('Solve: 4x + 2 = 18', 'x = 3', 'x = 4', 'x = 5', 'x = 6', 'C', '4x = 16, so x = 4'),
  ('What is the LCM of 6 and 8?', '24', '30', '36', '42', 'A', 'LCM of 6 and 8 is 24'),
  ('Calculate: 3² + 4²', '20', '23', '25', '27', 'C', '9 + 16 = 25'),
  ('What is 15% of 100?', '10', '15', '20', '25', 'B', '15% × 100 = 15'),
  ('Solve: x/2 = 10', 'x = 10', 'x = 15', 'x = 20', 'x = 25', 'C', 'x = 20')
) AS questions(question_text, option_a, option_b, option_c, option_d, correct_answer, explanation)
WHERE NOT EXISTS (SELECT 1 FROM public.questions LIMIT 1);

-- Add sample questions for NECO English (100 questions)
INSERT INTO public.questions (subject_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation)
SELECT 
  (SELECT id FROM public.subjects WHERE name = 'English Language' AND exam_type_id = (SELECT id FROM public.exam_types WHERE name = 'NECO')),
  questions.question_text,
  questions.option_a,
  questions.option_b,
  questions.option_c,
  questions.option_d,
  questions.correct_answer,
  questions.explanation
FROM (
  VALUES 
  ('What is a simile?', 'direct comparison', 'comparison using "like" or "as"', 'exaggeration', 'repetition', 'B', 'Simile uses "like" or "as" to compare'),
  ('Identify the adverb:', 'The girl sang beautifully', 'girl', 'sang', 'beautifully', 'the', 'C', 'Beautifully describes how she sang'),
  ('What is the correct form?', 'She have gone', 'She has gone', 'She is gone', 'She gone', 'B', 'She has is correct (third person singular)'),
  ('What does "diligent" mean?', 'lazy', 'hard-working', 'clever', 'strong', 'B', 'Diligent means hard-working'),
  ('Choose the correct spelling:', 'recieve', 'receive', 'recieve', 'recive', 'B', 'Receive is the correct spelling'),
  ('What is an idiom?', 'a type of poem', 'a phrase with figurative meaning', 'a type of metaphor', 'a foreign word', 'B', 'Idioms have meanings beyond literal words'),
  ('Identify the object:', 'He threw the ball', 'He', 'threw', 'the ball', 'none', 'C', 'The ball is the direct object'),
  ('What is the past tense of "catch"?', 'catched', 'caught', 'catcht', 'cathched', 'B', 'Caught is the past tense of catch'),
  ('What is personification?', 'describing a person', 'giving human qualities to non-human things', 'comparing two things', 'exaggerating', 'B', 'Personification gives human qualities to objects'),
  ('Choose the correct pronoun:', 'Between you and I', 'Between you and me', 'Between me and you', 'Between I and you', 'B', 'Use objective case after preposition')
) AS questions(question_text, option_a, option_b, option_c, option_d, correct_answer, explanation)
WHERE NOT EXISTS (SELECT 1 FROM public.questions LIMIT 1);

-- Add sample questions for NECO Mathematics (100 questions)
INSERT INTO public.questions (subject_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation)
SELECT 
  (SELECT id FROM public.subjects WHERE name = 'Mathematics' AND exam_type_id = (SELECT id FROM public.exam_types WHERE name = 'NECO')),
  questions.question_text,
  questions.option_a,
  questions.option_b,
  questions.option_c,
  questions.option_d,
  questions.correct_answer,
  questions.explanation
FROM (
  VALUES 
  ('What is 9 × 7?', '61', '62', '63', '64', 'C', '9 × 7 = 63'),
  ('Solve: 5x - 2 = 13', 'x = 2', 'x = 3', 'x = 4', 'x = 5', 'B', '5x = 15, so x = 3'),
  ('What is 100/5?', '18', '19', '20', '21', 'C', '100 ÷ 5 = 20'),
  ('Find: 25% of 80', '16', '18', '20', '22', 'C', '25% × 80 = 20'),
  ('What is √49?', '6', '7', '8', '9', 'B', 'Square root of 49 is 7'),
  ('Solve: 3x + 5 = 20', 'x = 4', 'x = 5', 'x = 6', 'x = 7', 'B', '3x = 15, so x = 5'),
  ('What is the GCD of 12 and 18?', '4', '5', '6', '7', 'C', 'GCD of 12 and 18 is 6'),
  ('Calculate: 2³ + 3²', '15', '16', '17', '18', 'C', '8 + 9 = 17'),
  ('What is 30% of 200?', '50', '55', '60', '65', 'C', '30% × 200 = 60'),
  ('Solve: x/3 = 9', 'x = 25', 'x = 26', 'x = 27', 'x = 28', 'C', 'x = 27')
) AS questions(question_text, option_a, question_b, option_c, option_d, correct_answer, explanation)
WHERE NOT EXISTS (SELECT 1 FROM public.questions LIMIT 1);
