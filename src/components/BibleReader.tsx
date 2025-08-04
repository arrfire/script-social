import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Bookmark, Highlighter, MessageSquare, Settings } from 'lucide-react';

// Sample Bible data - in a real app, this would come from your database or API
const sampleBibleData = {
  book: "John",
  chapter: 3,
  verses: [
    { number: 1, text: "Now there was a Pharisee, a man named Nicodemus who was a member of the Jewish ruling council." },
    { number: 2, text: "He came to Jesus at night and said, \"Rabbi, we know that you are a teacher who has come from God. For no one could perform the signs you are doing if God were not with him.\"" },
    { number: 3, text: "Jesus replied, \"Very truly I tell you, no one can see the kingdom of God unless they are born again.\"" },
    { number: 4, text: "\"How can someone be born when they are old?\" Nicodemus asked. \"Surely they cannot enter a second time into their mother's womb to be born!\"" },
    { number: 5, text: "Jesus answered, \"Very truly I tell you, no one can enter the kingdom of God unless they are born of water and the Spirit." },
    { number: 16, text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life." }
  ]
};

const BibleReader = () => {
  const { user, signOut } = useAuth();
  const [selectedTranslation, setSelectedTranslation] = useState('ESV');
  const [highlightColor, setHighlightColor] = useState('yellow');
  const [highlights, setHighlights] = useState<Set<number>>(new Set());

  const handleHighlight = (verseNumber: number) => {
    const newHighlights = new Set(highlights);
    if (newHighlights.has(verseNumber)) {
      newHighlights.delete(verseNumber);
    } else {
      newHighlights.add(verseNumber);
    }
    setHighlights(newHighlights);
  };

  const getHighlightClass = (verseNumber: number) => {
    if (!highlights.has(verseNumber)) return '';
    switch (highlightColor) {
      case 'yellow': return 'bg-highlight-yellow';
      case 'green': return 'bg-highlight-green';
      case 'blue': return 'bg-highlight-blue';
      case 'pink': return 'bg-highlight-pink';
      case 'purple': return 'bg-highlight-purple';
      default: return 'bg-highlight-yellow';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">Bible Study</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Select value={selectedTranslation} onValueChange={setSelectedTranslation}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ESV">ESV</SelectItem>
                <SelectItem value="NIV">NIV</SelectItem>
                <SelectItem value="NASB">NASB</SelectItem>
                <SelectItem value="KJV">KJV</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
            
            <Button variant="outline" size="sm" onClick={signOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-12 gap-6 p-4">
        {/* Bible Reading Pane */}
        <div className="col-span-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">
                  {sampleBibleData.book} {sampleBibleData.chapter}
                </CardTitle>
                
                {/* Highlighting Tools */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Highlight:</span>
                  {['yellow', 'green', 'blue', 'pink', 'purple'].map((color) => (
                    <button
                      key={color}
                      onClick={() => setHighlightColor(color)}
                      className={`w-6 h-6 rounded border-2 ${
                        highlightColor === color ? 'border-primary' : 'border-border'
                      } ${
                        color === 'yellow' ? 'bg-highlight-yellow' :
                        color === 'green' ? 'bg-highlight-green' :
                        color === 'blue' ? 'bg-highlight-blue' :
                        color === 'pink' ? 'bg-highlight-pink' :
                        'bg-highlight-purple'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {sampleBibleData.verses.map((verse) => (
                <div
                  key={verse.number}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${getHighlightClass(verse.number)}`}
                  onClick={() => handleHighlight(verse.number)}
                >
                  <span className="text-bible-verse font-medium mr-2 select-none">
                    {verse.number}
                  </span>
                  <span className="text-bible-text leading-relaxed">
                    {verse.text}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="col-span-4 space-y-4">
          {/* Study Tools */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Highlighter className="h-5 w-5" />
                Study Tools
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <MessageSquare className="h-4 w-4 mr-2" />
                Add Note
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Bookmark className="h-4 w-4 mr-2" />
                Bookmark Chapter
              </Button>
            </CardContent>
          </Card>

          {/* Recent Highlights */}
          {highlights.size > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Highlights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Array.from(highlights).map((verseNumber) => (
                    <div key={verseNumber} className="flex items-center gap-2">
                      <Badge variant="secondary">v{verseNumber}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {sampleBibleData.book} {sampleBibleData.chapter}:{verseNumber}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Social Content Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Related Content</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Social media integration will display related tweets and videos here.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BibleReader;