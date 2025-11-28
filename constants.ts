import { Run, UserProfile } from './types';

export const SAFORA_PROFILE: UserProfile = {
  name: "Safora",
  goal: "Stay consistent with running, build a healthy habit",
  preferred_times: "Morning or evening",
  motivations: ["feeling strong", "stress relief", "seeing progress"],
  struggles: ["cold weather", "staying motivated alone", "busy schedule"],
  personality: "Appreciates gentle encouragement, likes seeing her progress visually"
};

export const PAST_RUNS: Run[] = [
  {
    id: '1',
    date: "November 18",
    distance_km: 5.2,
    duration: "31 min",
    pace: "5:58/km",
    route: "Field Path",
    mood: "strong",
    photo_note: "Power pose! Hands on hips, standing in green field with fence behind, curly hair, 'No Problem' t-shirt, looking confident",
    memory: "Felt powerful and strong. That pose says it all!",
    imageUrl: "https://picsum.photos/seed/run1/600/400"
  },
  {
    id: '2',
    date: "November 21",
    distance_km: 7.1,
    duration: "42 min",
    pace: "5:52/km",
    route: "Hill Route",
    mood: "happy",
    photo_note: "Beautiful big smile, sunny golden hour light, green hills behind, hair pulled back, wearing dark jacket with striped shirt",
    memory: "Best run of the week! That golden light made everything better",
    imageUrl: "https://picsum.photos/seed/run2/600/400"
  },
  {
    id: '3',
    date: "November 23",
    distance_km: 4.0,
    duration: "24 min",
    pace: "6:05/km",
    route: "Quick City Run",
    mood: "determined",
    photo_note: "Photo of running shoes - white sneakers with orange details, purple leggings, standing on pavement",
    memory: "Short one but showed up. Sometimes getting out the door is the win",
    imageUrl: "https://picsum.photos/seed/run3/600/400"
  },
  {
    id: '4',
    date: "November 25",
    distance_km: 6.5,
    duration: "38 min",
    pace: "5:51/km",
    route: "Frosty Morning",
    mood: "amazing",
    photo_note: "Bright smile on a cold morning! Frosty landscape behind, blue sky, wearing dark fleece jacket with purple underneath, gold earrings",
    memory: "Cold outside but warm inside. Winter running is the best!",
    imageUrl: "https://picsum.photos/seed/run4/600/400"
  },
  {
    id: '5',
    date: "November 27",
    distance_km: 5.7,
    duration: "34 min",
    pace: "5:58/km",
    route: "Park Loop",
    mood: "tired",
    photo_note: "Tired but real - eyes closed mid-blink, in the park with trees and playground behind, white t-shirt, hair down",
    memory: "Not every run is magic. But I showed up anyway.",
    imageUrl: "https://picsum.photos/seed/run5/600/400"
  }
];

export const SYSTEM_INSTRUCTION = `
You are "RunPal," a warm, supportive AI running coach. You're talking to Safora.

## YOUR CORE BEHAVIORS
1. **Reference her visual memories** - Mention her photos, how she looked, the routes she ran.
2. **Be warm and personal** - Use her name, celebrate small wins.
3. **Keep it simple** - Short messages, easy words.
4. **Motivate through memories** - "Remember how happy you looked after that park run?"
5. **Be honest but kind** - If she's slacking, ask what's wrong, don't lecture.

## CONTEXT
Today is Friday, November 28, 2025.
Days since last run: 1.
Weather: Cool, 6°C, partly cloudy.
Last interaction: Yesterday after her park run.

## HOW TO RESPOND
- **Check-in**: Greet warmly, mention a recent photo/memory, keep it short.
- **New Run**: Celebrate details, connect to streak, ask about the experience.
- **Unmotivated**: Don't push hard. Reference a happy photo. Offer tiny goals (2km).
- **Tone**: Warm, friend-like, 1-2 emojis max.

## RECENT HISTORY
${JSON.stringify(PAST_RUNS.slice(-3))}
`;
