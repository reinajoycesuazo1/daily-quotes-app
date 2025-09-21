export type Quote = {
  q: string;
  a: string;
};

export const sampleQuotes: Quote[] = [
  {
    q: "The only way to do great work is to love what you do.",
    a: "Steve Jobs"
  },
  {
    q: "Innovation distinguishes between a leader and a follower.",
    a: "Steve Jobs"
  },
  {
    q: "The future belongs to those who believe in the beauty of their dreams.",
    a: "Eleanor Roosevelt"
  },
  {
    q: "It is during our darkest moments that we must focus to see the light.",
    a: "Aristotle"
  },
  {
    q: "The way to get started is to quit talking and begin doing.",
    a: "Walt Disney"
  },
  {
    q: "Life is what happens to you while you're busy making other plans.",
    a: "John Lennon"
  },
  {
    q: "The mind is everything. What you think you become.",
    a: "Buddha"
  },
  {
    q: "The best time to plant a tree was 20 years ago. The second best time is now.",
    a: "Chinese Proverb"
  },
  {
    q: "Your time is limited, so don't waste it living someone else's life.",
    a: "Steve Jobs"
  },
  {
    q: "Strive not to be a success, but rather to be of value.",
    a: "Albert Einstein"
  },
  {
    q: "The only impossible journey is the one you never begin.",
    a: "Tony Robbins"
  },
  {
    q: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    a: "Winston Churchill"
  },
  {
    q: "Believe you can and you're halfway there.",
    a: "Theodore Roosevelt"
  },
  {
    q: "I have not failed. I've just found 10,000 ways that won't work.",
    a: "Thomas Edison"
  },
  {
    q: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
    a: "Nelson Mandela"
  },
  {
    q: "If you look at what you have in life, you'll always have more.",
    a: "Oprah Winfrey"
  },
  {
    q: "The best and most beautiful things in the world cannot be seen or even touched - they must be felt with the heart.",
    a: "Helen Keller"
  },
  {
    q: "It is never too late to be what you might have been.",
    a: "George Eliot"
  },
  {
    q: "You miss 100% of the shots you don't take.",
    a: "Wayne Gretzky"
  },
  {
    q: "The journey of a thousand miles begins with one step.",
    a: "Lao Tzu"
  }
];

// Function to get a random quote from the sample quotes
export const getRandomSampleQuote = (): Quote => {
  const randomIndex = Math.floor(Math.random() * sampleQuotes.length);
  return sampleQuotes[randomIndex];
};
