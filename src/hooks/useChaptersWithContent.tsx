
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ChapterWithContent {
  book_name: string;
  chapter_number: number;
  video_count: number;
}

// Biblical book order mapping
const BIBLICAL_BOOK_ORDER: { [key: string]: number } = {
  // Old Testament
  'Genesis': 1, 'Exodus': 2, 'Leviticus': 3, 'Numbers': 4, 'Deuteronomy': 5,
  'Joshua': 6, 'Judges': 7, 'Ruth': 8, 'Samuel': 9, 'Kings': 10,
  'Chronicles': 11, 'Ezra': 12, 'Nehemiah': 13, 'Esther': 14, 'Job': 15,
  'Psalms': 16, 'Proverbs': 17, 'Ecclesiastes': 18, 'Song': 19, 'Isaiah': 20,
  'Jeremiah': 21, 'Lamentations': 22, 'Ezekiel': 23, 'Daniel': 24,
  'Hosea': 25, 'Joel': 26, 'Amos': 27, 'Obadiah': 28, 'Jonah': 29,
  'Micah': 30, 'Nahum': 31, 'Habakkuk': 32, 'Zephaniah': 33, 'Haggai': 34,
  'Zechariah': 35, 'Malachi': 36,
  // New Testament
  'Matthew': 37, 'Mark': 38, 'Luke': 39, 'John': 40, 'Acts': 41,
  'Romans': 42, 'Corinthians': 43, 'Galatians': 44, 'Ephesians': 45,
  'Philippians': 46, 'Colossians': 47, 'Thessalonians': 48, 'Timothy': 49,
  'Titus': 50, 'Philemon': 51, 'Hebrews': 52, 'James': 53, 'Peter': 54,
  'John Letters': 55, 'Jude': 56, 'Revelation': 57
};

export const useChaptersWithContent = () => {
  const [chapters, setChapters] = useState<ChapterWithContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChaptersWithContent = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('social_media_bible_references')
          .select(`
            book_name,
            chapter_number,
            content_id
          `);

        if (error) {
          console.error('Error fetching chapters with content:', error);
          return;
        }

        // Group by book and chapter and count videos
        const chapterMap = new Map<string, ChapterWithContent>();
        
        data?.forEach(item => {
          const key = `${item.book_name}-${item.chapter_number}`;
          if (chapterMap.has(key)) {
            const existing = chapterMap.get(key)!;
            existing.video_count += 1;
          } else {
            chapterMap.set(key, {
              book_name: item.book_name,
              chapter_number: item.chapter_number,
              video_count: 1
            });
          }
        });

        // Convert to array and sort by biblical order
        const sortedChapters = Array.from(chapterMap.values()).sort((a, b) => {
          const aOrder = BIBLICAL_BOOK_ORDER[a.book_name] || 999;
          const bOrder = BIBLICAL_BOOK_ORDER[b.book_name] || 999;
          
          if (aOrder !== bOrder) {
            return aOrder - bOrder;
          }
          return a.chapter_number - b.chapter_number;
        });

        setChapters(sortedChapters);
      } catch (error) {
        console.error('Error fetching chapters with content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChaptersWithContent();
  }, []);

  return { chapters, loading };
};
