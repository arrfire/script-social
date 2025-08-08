
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, MessageCircle } from 'lucide-react';

interface SocialMediaCardProps {
  content: {
    id: string;
    content_type: 'youtube' | 'twitter';
    url: string;
    title: string;
    author_handle: string;
    reference_text: string;
  };
}

const SocialMediaCard: React.FC<SocialMediaCardProps> = ({ content }) => {
  const renderYouTubeContent = () => {
    const getYouTubeId = (url: string) => {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      return match && match[2].length === 11 ? match[2] : null;
    };

    const videoId = getYouTubeId(content.url);

    return (
      <div className="space-y-4">
        {videoId && (
          <div className="aspect-video w-full">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title={content.title}
              className="w-full h-full rounded-lg"
              allowFullScreen
            />
          </div>
        )}
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="flex items-center gap-1">
            📺 YouTube
          </Badge>
          <a
            href={content.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <ExternalLink className="h-4 w-4" />
            Watch
          </a>
        </div>
      </div>
    );
  };

  const renderTwitterContent = () => {
    const getTweetId = (url: string) => {
      const match = url.match(/status\/(\d+)/);
      return match ? match[1] : null;
    };

    const tweetId = getTweetId(content.url);

    return (
      <div className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-400">
          <div className="flex items-start gap-3">
            <MessageCircle className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
            <div className="space-y-2 flex-1">
              <p className="text-sm text-gray-800 leading-relaxed">
                {content.title}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>@{content.author_handle}</span>
                <span>•</span>
                <span>Twitter</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="flex items-center gap-1">
            🐦 Twitter
          </Badge>
          <a
            href={content.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <ExternalLink className="h-4 w-4" />
            View Tweet
          </a>
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-gray-600">
          {content.reference_text}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {content.content_type === 'youtube' ? renderYouTubeContent() : renderTwitterContent()}
      </CardContent>
    </Card>
  );
};

export default SocialMediaCard;
