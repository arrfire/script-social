
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface BibleVerse {
  id: string;
  verse_number: number;
  text_esv: string | null;
  text_niv: string | null;
  text_nasb: string | null;
  text_kjv: string | null;
}

export const useBibleVerses = (bookName?: string, chapterNumber?: number, translation: string = 'ESV') => {
  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!bookName || !chapterNumber) return;

    const fetchVerses = async () => {
      setLoading(true);
      try {
        // First get the book
        const { data: book } = await supabase
          .from('bible_books')
          .select('id')
          .eq('name', bookName)
          .single();

        if (!book) return;

        // Then get the chapter
        const { data: chapter } = await supabase
          .from('bible_chapters')
          .select('id')
          .eq('book_id', book.id)
          .eq('chapter_number', chapterNumber)
          .single();

        if (!chapter) return;

        // Finally get the verses
        const { data: versesData, error } = await supabase
          .from('bible_verses')
          .select('id, verse_number, text_esv, text_niv, text_nasb, text_kjv')
          .eq('chapter_id', chapter.id)
          .order('verse_number');

        if (error) {
          console.error('Error fetching verses:', error);
          return;
        }

        setVerses(versesData || []);
      } catch (error) {
        console.error('Error fetching verses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVerses();
  }, [bookName, chapterNumber, translation]);

  return { verses, loading };
};
