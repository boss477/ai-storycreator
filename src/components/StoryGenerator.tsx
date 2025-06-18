
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { BookOpen, Sparkles, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const StoryGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [story, setStory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Hardcoded API key
  const apiKey = 'AIzaSyBPIluo0P8oUrWj2yQSCR6ix-sLZ_ZbADE';

  const generateStory = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Please enter a story prompt",
        description: "We need a creative prompt to generate your adventure!",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    console.log('Starting story generation with prompt:', prompt);

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Write a fun, exciting adventure story for 9-year-old kids (300-400 words) based on this prompt: "${prompt}". 

Requirements:
- Use simple, age-appropriate language that 9-year-olds can easily understand
- Include brave, curious kid characters as the main heroes
- Make it full of wonder, magic, and exciting discoveries
- Add fun dialogue and exciting action
- Include a positive message about friendship, courage, or kindness
- Keep it completely appropriate for children - no scary or inappropriate content
- Make it engaging with lots of adventure and imagination
- End with a happy, satisfying conclusion

Make this story absolutely captivating for young readers!`
            }]
          }],
          generationConfig: {
            temperature: 0.9,
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
          },
        }),
      });

      console.log('API response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error:', errorData);
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      console.log('API response data:', data);

      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const generatedStory = data.candidates[0].content.parts[0].text;
        setStory(generatedStory);
        
        toast({
          title: "Adventure Ready!",
          description: "Your exciting story is ready to read!",
        });
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (error) {
      console.error('Error generating story:', error);
      toast({
        title: "Error generating story",
        description: "Please try again with a different prompt.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      generateStory();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="h-12 w-12 text-purple-300" />
            <h1 className="text-5xl font-bold text-white">
              Kids Adventure Story Generator
            </h1>
            <Sparkles className="h-12 w-12 text-yellow-300" />
          </div>
          <p className="text-xl text-purple-200">
            Create amazing adventures and magical stories for young explorers!
          </p>
        </div>

        {/* Story Input */}
        <Card className="mb-6 bg-white/10 backdrop-blur border-white/20">
          <CardHeader>
            <CardTitle className="text-white">What adventure would you like to read about?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prompt" className="text-purple-200">Story Adventure Idea</Label>
              <Textarea
                id="prompt"
                placeholder="A brave kid finds a magical doorway in their backyard that leads to a kingdom where animals can talk..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyPress={handleKeyPress}
                className="min-h-[100px] bg-white/20 border-white/30 text-white placeholder:text-purple-200 resize-none"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-purple-300">Try these kid-friendly adventures:</span>
              {[
                "A kid discovers their pet hamster is actually a tiny superhero",
                "Two friends find a treasure map in their school library",
                "A magical tree house that travels to different worlds",
                "A young explorer meets friendly dragons in their grandmother's garden",
                "Kids who can talk to toys that come alive at night",
                "A secret club of kids who help lost magical creatures"
              ].map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setPrompt(suggestion)}
                  className="text-xs bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 px-3 py-1 rounded-full transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            <Button
              onClick={generateStory}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 transition-all duration-300 transform hover:scale-[1.02]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating your adventure...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Create My Adventure Story!
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Generated Story */}
        {story && (
          <Card className="bg-white/95 backdrop-blur border-white/50 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-gray-800 flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Your Amazing Adventure Story!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-lg max-w-none">
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap font-serif text-lg">
                  {story}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StoryGenerator;
