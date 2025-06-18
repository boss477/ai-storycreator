
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { BookOpen, Sparkles, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const StoryGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [story, setStory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateStory = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Please enter a story prompt",
        description: "We need a creative prompt to generate your story!",
        variant: "destructive"
      });
      return;
    }

    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your Gemini API key to generate stories.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    console.log('Starting story generation with prompt:', prompt);

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Write a creative, engaging short story (300-500 words) based on this prompt: "${prompt}". Make it vivid, with interesting characters and a compelling narrative. Include dialogue and descriptive details to bring the story to life.`
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
          title: "Story Generated!",
          description: "Your creative story is ready to read.",
        });
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (error) {
      console.error('Error generating story:', error);
      toast({
        title: "Error generating story",
        description: "Please check your API key and try again.",
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
              AI Story Generator
            </h1>
            <Sparkles className="h-12 w-12 text-yellow-300" />
          </div>
          <p className="text-xl text-purple-200">
            Transform your imagination into captivating stories with AI
          </p>
        </div>

        {/* API Key Input */}
        <Card className="mb-6 bg-white/10 backdrop-blur border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <span>🔑</span> Gemini API Key
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="apiKey" className="text-purple-200">
                Enter your Gemini API key to start generating stories
              </Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Enter your Gemini API key..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="bg-white/20 border-white/30 text-white placeholder:text-purple-200"
              />
              <p className="text-sm text-purple-300">
                Get your free API key from{' '}
                <a 
                  href="https://makersuite.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-yellow-300 hover:underline"
                >
                  Google AI Studio
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Story Input */}
        <Card className="mb-6 bg-white/10 backdrop-blur border-white/20">
          <CardHeader>
            <CardTitle className="text-white">What story would you like to create?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prompt" className="text-purple-200">Story Prompt</Label>
              <Textarea
                id="prompt"
                placeholder="A time traveler visits ancient Egypt and discovers something that changes history..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyPress={handleKeyPress}
                className="min-h-[100px] bg-white/20 border-white/30 text-white placeholder:text-purple-200 resize-none"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-purple-300">Try these prompts:</span>
              {[
                "A robot learns to paint emotions",
                "The last bookstore in a digital world",
                "A chef who can taste memories in food",
                "Two strangers share an umbrella during a meteor shower"
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
                  Crafting your story...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Story
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
                Your Generated Story
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-lg max-w-none">
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap font-serif">
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
