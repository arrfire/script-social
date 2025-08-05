import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Youtube, ExternalLink } from 'lucide-react';

interface SocialMediaContent {
  id: string;
  content_type: 'youtube' | 'twitter';
  url: string;
  title: string;
  author_handle: string;
  reference_text: string;
}

interface SocialMediaCardProps {
  content: SocialMediaContent;
}

const SocialMediaCard = ({ content }: SocialMediaCardProps) => {
  const handleClick = () => {
    window.open(content.url, '_blank', 'noopener,noreferrer');
  };

  const getVideoId = (url: string) => {
    const match = url.match(/(?:shorts\/|v=|embed\/|youtu\.be\/)([^&?\s]{11})/);
    return match ? match[1] : null;
  };

  const videoId = content.content_type === 'youtube' ? getVideoId(content.url) : null;

  return (
    <Card className="transition-colors hover:bg-muted/50 cursor-pointer" onClick={handleClick}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {content.content_type === 'youtube' ? (
              <Youtube className="h-4 w-4 text-destructive" />
            ) : (
              <div className="h-4 w-4 bg-primary rounded" />
            )}
            <Badge variant="secondary" className="text-xs">
              {content.reference_text}
            </Badge>
          </div>
          <ExternalLink className="h-3 w-3 text-muted-foreground" />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {content.content_type === 'youtube' && videoId && (
          <div className="aspect-video w-full overflow-hidden rounded-md">
            <img 
              src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
              alt="Video thumbnail"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        )}
        
        <div>
          <h4 className="font-medium text-sm leading-tight line-clamp-2 mb-1">
            {content.title}
          </h4>
          <p className="text-xs text-muted-foreground">
            {content.author_handle}
          </p>
        </div>

        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
        >
          {content.content_type === 'youtube' ? 'Watch Video' : 'View Tweet'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SocialMediaCard;