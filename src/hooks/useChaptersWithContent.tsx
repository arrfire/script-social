import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ChapterWithContent {
  book_name: string;
  chapter_number: number;
  video_count: number;
}

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

        // Convert to array and sort
        const sortedChapters = Array.from(chapterMap.values()).sort((a, b) => {
          if (a.book_name !== b.book_name) {
            return a.book_name.localeCompare(b.book_name);
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