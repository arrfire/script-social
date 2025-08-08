
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSocialContent } from '@/hooks/useSocialContent';
import SocialMediaCard from './SocialMediaCard';

interface BibleChapterWithVideosProps {
  bookName: string;
  chapterNumber: number;
  videoCount: number;
  onClick?: () => void;
}

const BibleChapterWithVideos: React.FC<BibleChapterWithVideosProps> = ({
  bookName,
  chapterNumber,
  videoCount,
  onClick
}) => {
  const { content, loading } = useSocialContent(bookName, chapterNumber);

  const youtubeContent = content.filter(item => item.content_type === 'youtube');
  const twitterContent = content.filter(item => item.content_type === 'twitter');

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={onClick}>
      <CardHeader>
        <CardTitle className="text-lg">
          {bookName} {chapterNumber}
        </CardTitle>
        <div className="flex gap-2">
          {youtubeContent.length > 0 && (
            <Badge variant="secondary">
              📺 {youtubeContent.length} video{youtubeContent.length !== 1 ? 's' : ''}
            </Badge>
          )}
          {twitterContent.length > 0 && (
            <Badge variant="outline">
              🐦 {twitterContent.length} tweet{twitterContent.length !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading content...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {content.length > 0 ? (
              content.map((item) => (
                <SocialMediaCard key={item.id} content={item} />
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">
                No related content available for this chapter.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BibleChapterWithVideos;
