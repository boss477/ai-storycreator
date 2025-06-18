
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { BookOpen, Sparkles, Loader2, Crown, Rocket, TreePine, Castle, Heart, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const StoryGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [storyType, setStoryType] = useState('adventure');
  const [character, setCharacter] = useState('brave-kid');
  const [setting, setSetting] = useState('magical-forest');
  const [story, setStory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Hardcoded API key
  const apiKey = 'AIzaSyBPIluo0P8oUrWj2yQSCR6ix-sLZ_ZbADE';

  const storyTypes = [
    { id: 'adventure', name: 'Adventure Quest', icon: '🗺️', description: 'Exciting journeys and discoveries' },
    { id: 'friendship', name: 'Friendship Tale', icon: '👫', description: 'Stories about making friends' },
    { id: 'mystery', name: 'Kid Detective', icon: '🔍', description: 'Fun mysteries to solve' },
    { id: 'fantasy', name: 'Magic & Wonder', icon: '✨', description: 'Magical creatures and spells' },
    { id: 'superhero', name: 'Super Powers', icon: '🦸', description: 'Heroes saving the day' },
    { id: 'animal', name: 'Animal Friends', icon: '🐾', description: 'Talking animals and pets' }
  ];

  const characters = [
    { id: 'brave-kid', name: 'Brave Explorer', icon: '🏔️' },
    { id: 'smart-detective', name: 'Smart Detective', icon: '🕵️' },
    { id: 'kind-helper', name: 'Kind Helper', icon: '💝' },
    { id: 'creative-artist', name: 'Creative Artist', icon: '🎨' },
    { id: 'animal-lover', name: 'Animal Lover', icon: '🐕' },
    { id: 'inventor-kid', name: 'Young Inventor', icon: '🔧' }
  ];

  const settings = [
    { id: 'magical-forest', name: 'Enchanted Forest', icon: '🌲' },
    { id: 'underwater-city', name: 'Underwater Kingdom', icon: '🏰' },
    { id: 'space-station', name: 'Space Adventure', icon: '🚀' },
    { id: 'candy-land', name: 'Sweet Candy Land', icon: '🍭' },
    { id: 'dinosaur-world', name: 'Dinosaur Valley', icon: '🦕' },
    { id: 'cloud-city', name: 'City in the Clouds', icon: '☁️' }
  ];

  const generateStory = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Please enter a story idea",
        description: "Tell us what adventure you'd like to read about!",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    console.log('Starting story generation with prompt:', prompt);

    const selectedStoryType = storyTypes.find(t => t.id === storyType);
    const selectedCharacter = characters.find(c => c.id === character);
    const selectedSetting = settings.find(s => s.id === setting);

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Write a fun, exciting ${selectedStoryType?.name.toLowerCase()} story for 9-year-old kids (350-450 words) based on this idea: "${prompt}". 

Story Details:
- Main Character: A ${selectedCharacter?.name.toLowerCase()} who is curious and brave
- Setting: ${selectedSetting?.name}
- Story Type: ${selectedStoryType?.description}

Requirements:
- Use simple, age-appropriate language that 9-year-olds can easily understand
- Include the main character as a brave, curious kid hero
- Set the story in ${selectedSetting?.name} with vivid descriptions
- Make it full of wonder, magic, and exciting discoveries
- Add fun dialogue and exciting action sequences
- Include a positive message about friendship, courage, or kindness
- Keep it completely appropriate for children - no scary or inappropriate content
- Make it engaging with lots of adventure and imagination
- End with a happy, satisfying conclusion where the character learns something valuable
- Include at least 2-3 other interesting characters they meet along the way

Make this story absolutely captivating and perfect for young readers who love ${selectedStoryType?.description.toLowerCase()}!`
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
          title: "🎉 Your Adventure is Ready!",
          description: "Your amazing story is ready to read!",
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

  const quickPrompts = [
    "A kid discovers their pet hamster is actually a tiny superhero",
    "Two friends find a treasure map in their school library",
    "A magical tree house that travels to different worlds",
    "A young explorer meets friendly dragons in their grandmother's garden",
    "Kids who can talk to toys that come alive at night",
    "A secret club of kids who help lost magical creatures"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="h-12 w-12 text-purple-300 animate-pulse" />
            <h1 className="text-5xl font-bold text-white bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
              Kids Adventure Story Creator
            </h1>
            <Sparkles className="h-12 w-12 text-yellow-300 animate-bounce" />
          </div>
          <p className="text-xl text-purple-200">
            Create amazing personalized adventures just for you! ✨
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Story Configuration */}
          <div className="space-y-6">
            {/* Story Type Selection */}
            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-300" />
                  What kind of story do you want?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={storyType} onValueChange={setStoryType} className="grid grid-cols-2 gap-3">
                  {storyTypes.map((type) => (
                    <div key={type.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={type.id} id={type.id} className="text-purple-300" />
                      <Label 
                        htmlFor={type.id} 
                        className="text-purple-200 cursor-pointer hover:text-white transition-colors flex items-center gap-2"
                      >
                        <span className="text-lg">{type.icon}</span>
                        <div>
                          <div className="font-medium">{type.name}</div>
                          <div className="text-xs text-purple-300">{type.description}</div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Character Selection */}
            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="h-5 w-5 text-green-300" />
                  Who should be the main character?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={character} onValueChange={setCharacter} className="grid grid-cols-2 gap-3">
                  {characters.map((char) => (
                    <div key={char.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={char.id} id={char.id} className="text-green-300" />
                      <Label 
                        htmlFor={char.id} 
                        className="text-purple-200 cursor-pointer hover:text-white transition-colors flex items-center gap-2"
                      >
                        <span className="text-lg">{char.icon}</span>
                        <span className="font-medium">{char.name}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Setting Selection */}
            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TreePine className="h-5 w-5 text-blue-300" />
                  Where should the adventure happen?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={setting} onValueChange={setSetting} className="grid grid-cols-2 gap-3">
                  {settings.map((set) => (
                    <div key={set.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={set.id} id={set.id} className="text-blue-300" />
                      <Label 
                        htmlFor={set.id} 
                        className="text-purple-200 cursor-pointer hover:text-white transition-colors flex items-center gap-2"
                      >
                        <span className="text-lg">{set.icon}</span>
                        <span className="font-medium">{set.name}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Story Input */}
          <div className="space-y-6">
            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Heart className="h-5 w-5 text-pink-300" />
                  Tell us your story idea!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="prompt" className="text-purple-200">What should happen in your adventure?</Label>
                  <Textarea
                    id="prompt"
                    placeholder="A magical doorway appears in my backyard that leads to a world where..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="min-h-[120px] bg-white/20 border-white/30 text-white placeholder:text-purple-200 resize-none text-lg"
                  />
                </div>
                
                <div className="space-y-3">
                  <span className="text-sm text-purple-300 font-medium">✨ Need inspiration? Try these ideas:</span>
                  <div className="grid gap-2">
                    {quickPrompts.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => setPrompt(suggestion)}
                        className="text-sm bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 hover:text-white px-4 py-2 rounded-lg transition-all duration-200 text-left transform hover:scale-[1.02]"
                      >
                        💫 {suggestion}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={generateStory}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white font-bold py-4 text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Creating your magical adventure...
                    </>
                  ) : (
                    <>
                      <Rocket className="mr-2 h-5 w-5" />
                      🌟 Create My Amazing Story! 🌟
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Generated Story */}
        {story && (
          <Card className="mt-8 bg-white/95 backdrop-blur border-white/50 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100">
              <CardTitle className="text-gray-800 flex items-center gap-2 text-2xl">
                <Castle className="h-6 w-6 text-purple-600" />
                🎉 Your Amazing Adventure Story! 🎉
                <Sparkles className="h-6 w-6 text-yellow-500" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="prose prose-lg max-w-none">
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap font-serif text-lg line-height-loose">
                  {story}
                </div>
              </div>
              <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border-l-4 border-yellow-400">
                <p className="text-gray-600 font-medium">
                  🌟 Great job reading your adventure! Share it with your friends and family! 🌟
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StoryGenerator;
