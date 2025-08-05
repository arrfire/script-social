-- Create table for social media content
CREATE TABLE public.social_media_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_type TEXT NOT NULL CHECK (content_type IN ('youtube', 'twitter')),
  url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  thumbnail_url TEXT,
  author_handle TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table to link social media content with Bible references
CREATE TABLE public.social_media_bible_references (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id UUID NOT NULL REFERENCES public.social_media_content(id) ON DELETE CASCADE,
  book_name TEXT NOT NULL,
  chapter_number INTEGER,
  verse_start INTEGER,
  verse_end INTEGER,
  reference_text TEXT NOT NULL, -- e.g., "Matthew 13:24-30"
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.social_media_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_media_bible_references ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Anyone can view social media content" 
ON public.social_media_content 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can view bible references" 
ON public.social_media_bible_references 
FOR SELECT 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_social_media_content_updated_at
BEFORE UPDATE ON public.social_media_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert the YouTube shorts data
INSERT INTO public.social_media_content (content_type, url, title, author_handle) VALUES
('youtube', 'https://www.youtube.com/shorts/xH8zeXcOjm0', 'Parable of the Trees: How the Wrong Leaders Get Chosen', '@SpiritualMusingsrp'),
('youtube', 'https://www.youtube.com/shorts/NOxqTos18aA', 'The Ewe Lamb: The Parable That Exposed a King', '@SpiritualMusingsrp'),
('youtube', 'https://www.youtube.com/shorts/VWROX8BG5GU', 'The Tenants in the Vineyard: When Stewards Betray Trust', '@SpiritualMusingsrp'),
('youtube', 'https://www.youtube.com/shorts/GCn9GFfOzUg', 'Pharisee and Tax Collector: Two Prayers, One Shocking Result', '@SpiritualMusingsrp'),
('youtube', 'https://www.youtube.com/shorts/tAnx9mjSO7E', 'An Unjust Steward: Praise for a Dishonest Manager', '@SpiritualMusingsrp'),
('youtube', 'https://www.youtube.com/shorts/HIjUnC44CDA', 'The Rich Man and Lazarus: Wealth Creates a Chasm', '@SpiritualMusingsrp'),
('youtube', 'https://www.youtube.com/shorts/6W8OAUtOD9k', 'The Great Banquet: When the "Wrong People" Get Invited', '@SpiritualMusingsrp'),
('youtube', 'https://www.youtube.com/shorts/9egutsEjz-c', 'The Parable of the Weeds: Why Rushing to Judge Destroys What''s Good', '@SpiritualMusingsrp'),
('youtube', 'https://www.youtube.com/shorts/oaYwbC8gGYI', 'The Workers in the Vineyard: Grace vs. Fairness', '@SpiritualMusingsrp'),
('youtube', 'https://www.youtube.com/shorts/tlJ7sbZuO0k', 'The Parable of the Sower: Same Seeds, Different Outcomes', '@SpiritualMusingsrp'),
('youtube', 'https://www.youtube.com/shorts/iWBsJxLz1mc', 'The Unforgiving Servant: The Guilt of Hypocrisy', '@SpiritualMusingsrp'),
('youtube', 'https://www.youtube.com/shorts/0PV2XXZE1Ew', 'Parable of the Ten Virgins: Need For Steadfast Dedication', '@SpiritualMusingsrp'),
('youtube', 'https://www.youtube.com/shorts/SlS-BcF62ak', 'Parable of the Lost Sheep: Every Person Matters', '@SpiritualMusingsrp'),
('youtube', 'https://www.youtube.com/shorts/zO20Fc9U6qQ', 'The Parable of Talents: Wise Choice & Positive Action', '@SpiritualMusingsrp'),
('youtube', 'https://www.youtube.com/shorts/032C4_WDXbc', 'Good Samaritan - Compassion Sans Borders', '@SpiritualMusingsrp'),
('youtube', 'https://www.youtube.com/shorts/BQcHzZ0FyWc', 'The Wise & Foolish Builders - On Solid Ground', '@SpiritualMusingsrp'),
('youtube', 'https://www.youtube.com/shorts/E2yDNqiE27c', 'A Prodigal Son – Parable of Grace and Redemption', '@SpiritualMusingsrp'),
('youtube', 'https://www.youtube.com/shorts/BYktY7KKc5k', 'Blessed Are the Persecuted | Strength In Adversity', '@SpiritualMusingsrp'),
('youtube', 'https://www.youtube.com/shorts/TJfFtKYqMtg', 'Blessed Are the Peacemakers | Building Bridges', '@SpiritualMusingsrp'),
('youtube', 'https://www.youtube.com/shorts/PrJ3zTzyndE', 'Blessed Are the Pure in Heart | Discovering Authentic Faith', '@SpiritualMusingsrp'),
('youtube', 'https://www.youtube.com/shorts/dhszQAhxlI8', 'Blessed Are the Merciful | The Power of Compassion', '@SpiritualMusingsrp'),
('youtube', 'https://www.youtube.com/shorts/-n6FR1gJKnM', 'Hunger for Righteousness | True Blessedness', '@SpiritualMusingsrp'),
('youtube', 'https://www.youtube.com/shorts/9Qn4wmRLM2I', 'Blessed Are The Meek: True Strength', '@SpiritualMusingsrp'),
('youtube', 'https://www.youtube.com/shorts/GlFst7joPHk', 'Blessed Are Those Who Mourn | Finding Comfort in Grief', '@SpiritualMusingsrp'),
('youtube', 'https://www.youtube.com/shorts/nwB6XoLsskY', 'Blessed Are the Poor in Spirit | First Beatitude Unravelled', '@SpiritualMusingsrp');

-- Insert Bible references for each content
INSERT INTO public.social_media_bible_references (content_id, book_name, chapter_number, verse_start, verse_end, reference_text) 
SELECT id, 'Judges', 9, 8, 15, 'Judges 9:8-15' FROM public.social_media_content WHERE url = 'https://www.youtube.com/shorts/xH8zeXcOjm0';

INSERT INTO public.social_media_bible_references (content_id, book_name, chapter_number, verse_start, verse_end, reference_text) 
SELECT id, '2 Samuel', 12, 1, 7, '2 Samuel 12:1-7' FROM public.social_media_content WHERE url = 'https://www.youtube.com/shorts/NOxqTos18aA';

INSERT INTO public.social_media_bible_references (content_id, book_name, chapter_number, verse_start, verse_end, reference_text) 
SELECT id, 'Matthew', 21, 33, 46, 'Matthew 21:33-46' FROM public.social_media_content WHERE url = 'https://www.youtube.com/shorts/VWROX8BG5GU';

INSERT INTO public.social_media_bible_references (content_id, book_name, chapter_number, verse_start, verse_end, reference_text) 
SELECT id, 'Luke', 18, 9, 14, 'Luke 18:9-14' FROM public.social_media_content WHERE url = 'https://www.youtube.com/shorts/GCn9GFfOzUg';

INSERT INTO public.social_media_bible_references (content_id, book_name, chapter_number, verse_start, verse_end, reference_text) 
SELECT id, 'Luke', 16, 1, 13, 'Luke 16:1-13' FROM public.social_media_content WHERE url = 'https://www.youtube.com/shorts/tAnx9mjSO7E';

INSERT INTO public.social_media_bible_references (content_id, book_name, chapter_number, verse_start, verse_end, reference_text) 
SELECT id, 'Luke', 16, 19, 31, 'Luke 16:19-31' FROM public.social_media_content WHERE url = 'https://www.youtube.com/shorts/HIjUnC44CDA';

INSERT INTO public.social_media_bible_references (content_id, book_name, chapter_number, verse_start, verse_end, reference_text) 
SELECT id, 'Luke', 14, 15, 24, 'Luke 14:15-24' FROM public.social_media_content WHERE url = 'https://www.youtube.com/shorts/6W8OAUtOD9k';

INSERT INTO public.social_media_bible_references (content_id, book_name, chapter_number, verse_start, verse_end, reference_text) 
SELECT id, 'Matthew', 13, 24, 30, 'Matthew 13:24-30' FROM public.social_media_content WHERE url = 'https://www.youtube.com/shorts/9egutsEjz-c';

INSERT INTO public.social_media_bible_references (content_id, book_name, chapter_number, verse_start, verse_end, reference_text) 
SELECT id, 'Matthew', 20, 1, 16, 'Matthew 20:1-16' FROM public.social_media_content WHERE url = 'https://www.youtube.com/shorts/oaYwbC8gGYI';

INSERT INTO public.social_media_bible_references (content_id, book_name, chapter_number, verse_start, verse_end, reference_text) 
SELECT id, 'Matthew', 13, 3, 9, 'Matthew 13:3-9' FROM public.social_media_content WHERE url = 'https://www.youtube.com/shorts/tlJ7sbZuO0k';

INSERT INTO public.social_media_bible_references (content_id, book_name, chapter_number, verse_start, verse_end, reference_text) 
SELECT id, 'Matthew', 18, 21, 35, 'Matthew 18:21-35' FROM public.social_media_content WHERE url = 'https://www.youtube.com/shorts/iWBsJxLz1mc';

INSERT INTO public.social_media_bible_references (content_id, book_name, chapter_number, verse_start, verse_end, reference_text) 
SELECT id, 'Matthew', 25, 1, 13, 'Matthew 25:1-13' FROM public.social_media_content WHERE url = 'https://www.youtube.com/shorts/0PV2XXZE1Ew';

INSERT INTO public.social_media_bible_references (content_id, book_name, chapter_number, verse_start, verse_end, reference_text) 
SELECT id, 'Luke', 15, 3, 7, 'Luke 15:3-7' FROM public.social_media_content WHERE url = 'https://www.youtube.com/shorts/SlS-BcF62ak';

INSERT INTO public.social_media_bible_references (content_id, book_name, chapter_number, verse_start, verse_end, reference_text) 
SELECT id, 'Matthew', 25, 14, 30, 'Matthew 25:14-30' FROM public.social_media_content WHERE url = 'https://www.youtube.com/shorts/zO20Fc9U6qQ';

INSERT INTO public.social_media_bible_references (content_id, book_name, chapter_number, verse_start, verse_end, reference_text) 
SELECT id, 'Luke', 10, 25, 37, 'Luke 10:25-37' FROM public.social_media_content WHERE url = 'https://www.youtube.com/shorts/032C4_WDXbc';

INSERT INTO public.social_media_bible_references (content_id, book_name, chapter_number, verse_start, verse_end, reference_text) 
SELECT id, 'Matthew', 7, 24, 27, 'Matthew 7:24-27' FROM public.social_media_content WHERE url = 'https://www.youtube.com/shorts/BQcHzZ0FyWc';

INSERT INTO public.social_media_bible_references (content_id, book_name, chapter_number, verse_start, verse_end, reference_text) 
SELECT id, 'Luke', 15, 11, 32, 'Luke 15:11-32' FROM public.social_media_content WHERE url = 'https://www.youtube.com/shorts/E2yDNqiE27c';

INSERT INTO public.social_media_bible_references (content_id, book_name, chapter_number, verse_start, verse_end, reference_text) 
SELECT id, 'Matthew', 5, 10, 12, 'Matthew 5:10-12' FROM public.social_media_content WHERE url = 'https://www.youtube.com/shorts/BYktY7KKc5k';

INSERT INTO public.social_media_bible_references (content_id, book_name, chapter_number, verse_start, verse_end, reference_text) 
SELECT id, 'Matthew', 5, 9, 9, 'Matthew 5:9' FROM public.social_media_content WHERE url = 'https://www.youtube.com/shorts/TJfFtKYqMtg';

INSERT INTO public.social_media_bible_references (content_id, book_name, chapter_number, verse_start, verse_end, reference_text) 
SELECT id, 'Matthew', 5, 8, 8, 'Matthew 5:8' FROM public.social_media_content WHERE url = 'https://www.youtube.com/shorts/PrJ3zTzyndE';

INSERT INTO public.social_media_bible_references (content_id, book_name, chapter_number, verse_start, verse_end, reference_text) 
SELECT id, 'Matthew', 5, 7, 7, 'Matthew 5:7' FROM public.social_media_content WHERE url = 'https://www.youtube.com/shorts/dhszQAhxlI8';

INSERT INTO public.social_media_bible_references (content_id, book_name, chapter_number, verse_start, verse_end, reference_text) 
SELECT id, 'Matthew', 5, 6, 6, 'Matthew 5:6' FROM public.social_media_content WHERE url = 'https://www.youtube.com/shorts/-n6FR1gJKnM';

INSERT INTO public.social_media_bible_references (content_id, book_name, chapter_number, verse_start, verse_end, reference_text) 
SELECT id, 'Matthew', 5, 5, 5, 'Matthew 5:5' FROM public.social_media_content WHERE url = 'https://www.youtube.com/shorts/9Qn4wmRLM2I';

INSERT INTO public.social_media_bible_references (content_id, book_name, chapter_number, verse_start, verse_end, reference_text) 
SELECT id, 'Matthew', 5, 4, 4, 'Matthew 5:4' FROM public.social_media_content WHERE url = 'https://www.youtube.com/shorts/GlFst7joPHk';

INSERT INTO public.social_media_bible_references (content_id, book_name, chapter_number, verse_start, verse_end, reference_text) 
SELECT id, 'Matthew', 5, 3, 3, 'Matthew 5:3' FROM public.social_media_content WHERE url = 'https://www.youtube.com/shorts/nwB6XoLsskY';