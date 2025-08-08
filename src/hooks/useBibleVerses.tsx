
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

interface BibleVerseWithText extends BibleVerse {
  text: string;
}

export const useBibleVerses = (bookName?: string, chapterNumber?: number, translation: string = 'ESV') => {
  const [verses, setVerses] = useState<BibleVerseWithText[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookName || !chapterNumber) {
      setVerses([]);
      return;
    }

    const fetchVerses = async () => {
      setLoading(true);
      setError(null);
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
          setError('Error fetching book');
          return;
        }

        if (!book) {
          console.log(`Book not found: ${bookName}`);
          setError('Book not found');
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
          setError('Error fetching chapter');
          return;
        }

        if (!chapter) {
          console.log(`Chapter not found: ${bookName} ${chapterNumber}`);
          setError('Chapter not found');
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
          setError('Error fetching verses');
          return;
        }

        console.log(`Found ${versesData?.length || 0} verses`);
        
        // Map verses to include the text property based on selected translation
        const mappedVerses: BibleVerseWithText[] = (versesData || []).map(verse => ({
          ...verse,
          text: getTranslationText(verse, translation)
        }));
        
        setVerses(mappedVerses);
      } catch (error) {
        console.error('Error fetching verses:', error);
        setError('Error fetching verses');
      } finally {
        setLoading(false);
      }
    };

    fetchVerses();
  }, [bookName, chapterNumber, translation]);

  return { verses, loading, error };
};

const getTranslationText = (verse: BibleVerse, translation: string): string => {
  switch (translation.toUpperCase()) {
    case 'ESV':
      return verse.text_esv || '';
    case 'NIV':
      return verse.text_niv || '';
    case 'NASB':
      return verse.text_nasb || '';
    case 'KJV':
      return verse.text_kjv || '';
    default:
      return verse.text_esv || '';
  }
};
