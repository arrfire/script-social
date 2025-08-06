
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SocialMediaContent {
  id: string;
  content_type: 'youtube' | 'twitter';
  url: string;
  title: string;
  author_handle: string;
  reference_text: string;
  book_name: string;
  chapter_number: number;
}

export const useSocialContent = (bookName?: string, chapterNumber?: number) => {
  const [content, setContent] = useState<SocialMediaContent[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!bookName || !chapterNumber) return;

    const fetchRelatedContent = async () => {
      setLoading(true);
      try {
        // First get the bible references that match our book and chapter
        const { data: references, error: referencesError } = await supabase
          .from('social_media_bible_references')
          .select('content_id, reference_text')
          .eq('book_name', bookName)
          .eq('chapter_number', chapterNumber);

        if (referencesError) {
          console.error('Error fetching bible references:', referencesError);
          return;
        }

        if (!references || references.length === 0) {
          setContent([]);
          return;
        }

        // Get the content IDs
        const contentIds = references.map(ref => ref.content_id);

        // Now get the social media content for these IDs
        const { data: socialContent, error: contentError } = await supabase
          .from('social_media_content')
          .select('id, content_type, url, title, author_handle')
          .in('id', contentIds);

        if (contentError) {
          console.error('Error fetching social content:', contentError);
          return;
        }

        // Combine the data
        const formattedContent = socialContent?.map(item => {
          const reference = references.find(ref => ref.content_id === item.id);
          return {
            id: item.id,
            content_type: item.content_type as 'youtube' | 'twitter',
            url: item.url,
            title: item.title || '',
            author_handle: item.author_handle || '',
            reference_text: reference?.reference_text || '',
            book_name: bookName,
            chapter_number: chapterNumber,
          };
        }) || [];

        setContent(formattedContent);
      } catch (error) {
        console.error('Error fetching social content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedContent();
  }, [bookName, chapterNumber]);

  return { content, loading };
};
