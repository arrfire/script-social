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
        const { data, error } = await supabase
          .from('social_media_content')
          .select(`
            id,
            content_type,
            url,
            title,
            author_handle,
            social_media_bible_references (
              reference_text,
              book_name,
              chapter_number
            )
          `)
          .eq('social_media_bible_references.book_name', bookName)
          .eq('social_media_bible_references.chapter_number', chapterNumber);

        if (error) {
          console.error('Error fetching social content:', error);
          return;
        }

        const formattedContent = data?.map(item => ({
          id: item.id,
          content_type: item.content_type as 'youtube' | 'twitter',
          url: item.url,
          title: item.title || '',
          author_handle: item.author_handle || '',
          reference_text: item.social_media_bible_references?.[0]?.reference_text || '',
          book_name: item.social_media_bible_references?.[0]?.book_name || '',
          chapter_number: item.social_media_bible_references?.[0]?.chapter_number || 0,
        })) || [];

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