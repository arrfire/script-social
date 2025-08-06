
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
    if (!bookName || !chapterNumber) {
      setVerses([]);
      return;
    }

    const fetchVerses = async () => {
      setLoading(true);
      try {
        console.log(`Fetching verses for ${bookName} chapter ${chapterNumber}`);
        
        // First get the book
        const { data: book, error: bookError } = await supabase
          .from('bible_books')
          .select('id')
          .eq('name', bookName)
          .maybeSingle();

        if (bookError) {
          console.error('Error fetching book:', bookError);
          return;
        }

        if (!book) {
          console.log(`Book not found: ${bookName}`);
          return;
        }

        console.log(`Found book with ID: ${book.id}`);

        // Then get the chapter
        const { data: chapter, error: chapterError } = await supabase
          .from('bible_chapters')
          .select('id')
          .eq('book_id', book.id)
          .eq('chapter_number', chapterNumber)
          .maybeSingle();

        if (chapterError) {
          console.error('Error fetching chapter:', chapterError);
          return;
        }

        if (!chapter) {
          console.log(`Chapter not found: ${bookName} ${chapterNumber}`);
          return;
        }

        console.log(`Found chapter with ID: ${chapter.id}`);

        // Finally get the verses
        const { data: versesData, error: versesError } = await supabase
          .from('bible_verses')
          .select('id, verse_number, text_esv, text_niv, text_nasb, text_kjv')
          .eq('chapter_id', chapter.id)
          .order('verse_number');

        if (versesError) {
          console.error('Error fetching verses:', versesError);
          return;
        }

        console.log(`Found ${versesData?.length || 0} verses`);
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
