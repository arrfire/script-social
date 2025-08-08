
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBibleVerses } from '@/hooks/useBibleVerses';
import { BookOpen } from 'lucide-react';

interface BibleChapterDisplayProps {
  bookName: string;
  chapterNumber: number;
  translation: string;
}

const BibleChapterDisplay: React.FC<BibleChapterDisplayProps> = ({
  bookName,
  chapterNumber,
  translation
}) => {
  const { verses, loading, error } = useBibleVerses(bookName, chapterNumber, translation);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <BookOpen className="h-5 w-5 animate-pulse" />
            <span>Loading Bible text...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-red-500">Error loading Bible text: {error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!verses || verses.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">No verses found for {bookName} {chapterNumber}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          {bookName} {chapterNumber} ({translation})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {verses.map((verse) => (
            <div key={verse.verse_number} className="flex gap-3">
              <span className="text-sm font-medium text-muted-foreground min-w-[2rem]">
                {verse.verse_number}
              </span>
              <p className="text-sm leading-relaxed">{verse.text}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BibleChapterDisplay;
