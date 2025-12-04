export const sampleUsers = [
  {
    tempId: "creator1",
    userId: "seed_creator_1",
    email: "alex@example.com",
    name: "Alex Thompson",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    role: "creator" as const,
  },
  {
    tempId: "creator2",
    userId: "seed_creator_2",
    email: "sarah@example.com",
    name: "Sarah Chen",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    role: "creator" as const,
  },
  {
    tempId: "creator3",
    userId: "seed_creator_3",
    email: "marcus@example.com",
    name: "Marcus Johnson",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    role: "creator" as const,
  },
  {
    tempId: "creator4",
    userId: "seed_creator_4",
    email: "emily@example.com",
    name: "Emily Rodriguez",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    role: "creator" as const,
  },
  {
    tempId: "admin1",
    userId: "seed_admin_1",
    email: "admin@fundit.com",
    name: "Admin User",
    role: "admin" as const,
  },
  {
    tempId: "user1",
    userId: "seed_user_1",
    email: "john@example.com",
    name: "John Doe",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    role: "user" as const,
  },
  {
    tempId: "user2",
    userId: "seed_user_2",
    email: "jane@example.com",
    name: "Jane Smith",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    role: "user" as const,
  },
];

export const sampleCampaigns = [
  {
    creatorTempId: "creator1",
    title: "EcoCharge - Solar Powered Phone Charger",
    slug: "ecocharge-solar-phone-charger",
    shortDescription:
      "A portable solar charger that powers your devices anywhere.",
    description: `
## About This Project

EcoCharge is a revolutionary portable solar charger designed for the modern adventurer. Whether you're hiking, camping, or just spending a day at the beach, EcoCharge ensures your devices never run out of power.

### Key Features

- **High-Efficiency Solar Panels**: Our panels convert sunlight to energy 40% more efficiently than competitors.
- **Fast Charging**: Charge your phone in just 2 hours under direct sunlight.
- **Waterproof Design**: IP67 rated for all weather conditions.
- **Lightweight**: Only 200g - lighter than your phone!

### Why We Need Your Support

We've spent 2 years perfecting this technology. Your backing will help us:
- Finalize manufacturing partnerships
- Complete safety certifications
- Launch our first production run

Join us in making sustainable charging accessible to everyone!
    `,
    category: "Technology",
    goalAmount: 50000,
    currentAmount: 32500,
    currency: "USD",
    imageUrl:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800",
    daysLeft: 18,
    status: "active" as const,
  },
  {
    creatorTempId: "creator2",
    title: "Whispers in the Wind - Indie Album",
    slug: "whispers-in-the-wind-album",
    shortDescription:
      "Help us record our debut indie folk album in a professional studio.",
    description: `
## Our Story

We are Meadow Lane, a four-piece indie folk band from Portland, Oregon. After 5 years of playing local venues and self-producing EPs, we're ready to create something truly special.

### The Album

"Whispers in the Wind" will be a 12-track journey through:
- Love and loss
- Nature and connection
- Hope and renewal

### What Your Support Provides

- **$15,000**: Professional studio time (10 days)
- **$5,000**: Mixing and mastering
- **$3,000**: Album artwork and design
- **$2,000**: Vinyl pressing (limited edition)

### Rewards

Every backer gets exclusive access to behind-the-scenes content and early releases!
    `,
    category: "Music",
    goalAmount: 25000,
    currentAmount: 18750,
    currency: "USD",
    imageUrl:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800",
    daysLeft: 25,
    status: "active" as const,
  },
  {
    creatorTempId: "creator3",
    title: "Urban Gardens Initiative",
    slug: "urban-gardens-initiative",
    shortDescription:
      "Transforming abandoned city lots into thriving community gardens.",
    description: `
## The Problem

In our city, there are over 200 abandoned lots collecting trash and attracting crime. Meanwhile, many residents lack access to fresh, healthy produce.

## Our Solution

The Urban Gardens Initiative will transform 10 abandoned lots into beautiful, productive community gardens.

### What We'll Create

- **10 Community Gardens**: Each serving 50+ families
- **Education Programs**: Teaching sustainable gardening
- **Job Training**: For unemployed youth
- **Fresh Produce**: Free vegetables for low-income families

### Budget Breakdown

| Item | Cost |
|------|------|
| Land preparation | $20,000 |
| Seeds & plants | $5,000 |
| Tools & equipment | $8,000 |
| Water systems | $7,000 |

Together, we can grow something beautiful!
    `,
    category: "Community",
    goalAmount: 40000,
    currentAmount: 41200,
    currency: "USD",
    imageUrl:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800",
    daysLeft: 5,
    status: "active" as const,
  },
  {
    creatorTempId: "creator4",
    title: "CodeKids - Programming for Children",
    slug: "codekids-programming-children",
    shortDescription:
      "Free coding bootcamps for underprivileged children ages 8-14.",
    description: `
## Empowering the Next Generation

CodeKids is on a mission to bring coding education to children who wouldn't otherwise have access to it.

### Our Program

- **8-week bootcamps** teaching Python, Scratch, and web development
- **Free laptops** for every participant
- **Mentorship** from industry professionals
- **Project showcase** at the end of each cohort

### Impact So Far

We've already helped 150 children learn to code. With your support, we can reach 500 more this year.

### How Funds Will Be Used

- Laptops and equipment: $15,000
- Instructor salaries: $10,000
- Venue rental: $3,000
- Supplies and materials: $2,000
    `,
    category: "Education",
    goalAmount: 30000,
    currentAmount: 12400,
    currency: "USD",
    imageUrl:
      "https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?w=800",
    daysLeft: 35,
    status: "active" as const,
  },
  {
    creatorTempId: "creator1",
    title: "Realm of Shadows - Fantasy Board Game",
    slug: "realm-of-shadows-board-game",
    shortDescription:
      "An immersive fantasy board game with stunning artwork and deep strategy.",
    description: `
## Enter the Realm

Realm of Shadows is a cooperative board game for 2-5 players, set in a dark fantasy world where light is fading and heroes must rise.

### Game Features

- **60+ unique cards** with original artwork
- **5 playable heroes** each with unique abilities
- **Campaign mode** with 12 connected scenarios
- **2-3 hour playtime** per session

### Components

- 1 Game board (24" x 24")
- 200+ cards
- 50 miniatures
- 100+ tokens
- Rulebook & Campaign guide

### Stretch Goals

- $75k: Metal coins upgrade
- $100k: Expansion pack
- $150k: Painted miniatures option
    `,
    category: "Games",
    goalAmount: 60000,
    currentAmount: 78500,
    currency: "USD",
    imageUrl:
      "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=800",
    daysLeft: 12,
    status: "active" as const,
  },
  {
    creatorTempId: "creator2",
    title: "Sustainable Fashion Line - EcoWear",
    slug: "sustainable-fashion-ecowear",
    shortDescription:
      "Stylish clothing made from 100% recycled ocean plastics.",
    description: `
## Fashion That Saves Our Oceans

Every piece in the EcoWear collection is made from recycled ocean plastics, turning pollution into fashion.

### Our Process

1. Partner with ocean cleanup organizations
2. Process plastics into durable fabric
3. Design timeless, versatile pieces
4. Manufacture ethically in certified facilities

### The Collection

- 5 t-shirt designs
- 3 hoodie styles
- 2 jacket options
- Accessories (bags, hats)

### Environmental Impact

Each garment removes approximately 2 lbs of plastic from our oceans.
    `,
    category: "Fashion",
    goalAmount: 35000,
    currentAmount: 22100,
    currency: "USD",
    imageUrl:
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800",
    daysLeft: 20,
    status: "active" as const,
  },
  {
    creatorTempId: "creator3",
    title: "Documentary: Life on Mars Prep",
    slug: "documentary-life-mars-prep",
    shortDescription: "Following scientists preparing humans for life on Mars.",
    description: `
## The Next Giant Leap

This documentary follows the incredible scientists and engineers working to make human life on Mars a reality.

### What We'll Cover

- NASA's Mars habitat research
- SpaceX's Starship development  
- Food production in space
- Psychological challenges of isolation
- The Mars Society's simulation missions

### Production Plan

- 18 months of filming
- Interviews with 50+ experts
- Visits to 10+ research facilities
- Original score by award-winning composer

### Distribution

We're in talks with major streaming platforms and have confirmed festival submissions.
    `,
    category: "Film & Video",
    goalAmount: 80000,
    currentAmount: 45600,
    currency: "USD",
    imageUrl:
      "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800",
    daysLeft: 28,
    status: "active" as const,
  },
  {
    creatorTempId: "creator4",
    title: "Artisan Coffee Roastery",
    slug: "artisan-coffee-roastery",
    shortDescription:
      "Small-batch, ethically sourced coffee roasted to perfection.",
    description: `
## Craft Coffee, Done Right

We're opening a small-batch coffee roastery focused on quality, sustainability, and community.

### Our Promise

- **Direct Trade**: We pay farmers 50% above market rate
- **Small Batch**: Each roast is 10 lbs or less
- **Fresh**: Roasted and shipped within 24 hours
- **Transparent**: Full traceability for every bean

### Equipment Needed

- Probat sample roaster: $8,000
- 5kg production roaster: $15,000
- Packaging equipment: $3,000
- Initial green coffee inventory: $4,000

### Subscription Options

Backers can receive monthly coffee deliveries at special rates!
    `,
    category: "Food & Craft",
    goalAmount: 30000,
    currentAmount: 31500,
    currency: "USD",
    imageUrl:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800",
    daysLeft: 8,
    status: "active" as const,
  },
  {
    creatorTempId: "creator1",
    title: "AI-Powered Fitness Coach",
    slug: "ai-fitness-coach-app",
    shortDescription:
      "Your personal trainer powered by artificial intelligence.",
    description: `
## The Future of Fitness

FitAI is a mobile app that provides personalized workout plans, real-time form correction, and nutrition guidance—all powered by AI.

### Features

- **Smart Workouts**: AI creates plans based on your goals
- **Form Analysis**: Camera-based posture correction
- **Nutrition Tracking**: Meal suggestions and macro counting
- **Progress Analytics**: Detailed insights and predictions

### Development Roadmap

- Month 1-3: Core app development
- Month 4-5: AI model training
- Month 6: Beta testing
- Month 7: Public launch

### Team

Our team includes former Google engineers and certified fitness professionals.
    `,
    category: "Health & Fitness",
    goalAmount: 100000,
    currentAmount: 67800,
    currency: "USD",
    imageUrl:
      "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800",
    daysLeft: 22,
    status: "active" as const,
  },
  {
    creatorTempId: "creator2",
    title: "Children's Book: The Brave Little Star",
    slug: "childrens-book-brave-little-star",
    shortDescription:
      "An illustrated children's book about courage and self-belief.",
    description: `
## A Story for Every Child

"The Brave Little Star" tells the story of Stella, a small star who thinks she's not bright enough to shine. Through her journey, she discovers that everyone has their own unique light.

### The Book

- 32 beautifully illustrated pages
- For ages 4-8
- Themes of courage, self-worth, and kindness
- Hardcover and softcover options

### Creative Team

- **Author**: Maria Chen (award-winning children's author)
- **Illustrator**: James Wright (Disney background artist)

### Stretch Goals

- $10k: Audiobook narration
- $15k: Spanish translation
- $20k: Activity book companion
    `,
    category: "Publishing",
    goalAmount: 8000,
    currentAmount: 9200,
    currency: "USD",
    imageUrl:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800",
    daysLeft: 15,
    status: "active" as const,
  },
  {
    creatorTempId: "creator3",
    title: "Interactive Digital Art Installation",
    slug: "interactive-digital-art-installation",
    shortDescription:
      "A mesmerizing light installation that responds to human movement.",
    description: `
## Art Meets Technology

"Resonance" is an interactive digital art installation where light and sound respond to the movements and presence of viewers.

### The Experience

Visitors walk through a room of hanging LED panels that:
- Change colors based on movement
- Create sound from gestures
- Connect multiple visitors in shared patterns
- Evolve over time based on collective interaction

### Exhibition Plan

- 3-month installation at City Art Museum
- Free admission on weekends
- Educational workshops for schools
- Documentation for virtual tour

### Technical Specs

- 500+ custom LED panels
- 20 motion sensors
- Custom software and sound design
    `,
    category: "Art",
    goalAmount: 45000,
    currentAmount: 28900,
    currency: "USD",
    imageUrl: "https://images.unsplash.com/photo-1549490349-8643362247b5?w=800",
    daysLeft: 30,
    status: "active" as const,
  },
  {
    creatorTempId: "creator4",
    title: "Ocean Cleanup Drone Fleet",
    slug: "ocean-cleanup-drone-fleet",
    shortDescription:
      "Autonomous drones that collect plastic waste from our oceans.",
    description: `
## Technology for a Cleaner Ocean

We're developing a fleet of solar-powered autonomous drones designed to collect floating plastic waste from the ocean.

### How It Works

1. Drones patrol designated ocean areas
2. AI identifies and targets plastic waste
3. Collection mechanism gathers debris
4. Drones return to base for emptying
5. Waste is processed for recycling

### Prototype Results

Our prototype collected 50 lbs of plastic in 8 hours during testing.

### Funding Goals

- 5 production drones: $60,000
- Base station: $15,000
- Operations (1 year): $10,000
- Research & improvements: $15,000
    `,
    category: "Technology",
    goalAmount: 100000,
    currentAmount: 72300,
    currency: "USD",
    imageUrl:
      "https://images.unsplash.com/photo-1484291470158-b8f8d608850d?w=800",
    daysLeft: 18,
    status: "active" as const,
  },
];

export const samplePledges = [
  {
    campaignSlug: "ecocharge-solar-phone-charger",
    userTempId: "user1",
    amount: 55,
    currency: "USD",
    message: "Love this idea! Can't wait to take it camping!",
    isAnonymous: false,
    paymentStatus: "completed" as const,
  },
  {
    campaignSlug: "ecocharge-solar-phone-charger",
    userTempId: "user2",
    amount: 140,
    currency: "USD",
    message: "Getting one for the whole family!",
    isAnonymous: false,
    paymentStatus: "completed" as const,
  },
  {
    campaignSlug: "whispers-in-the-wind-album",
    userTempId: "user1",
    amount: 40,
    currency: "USD",
    message: "Been following you guys for years. So excited for this!",
    isAnonymous: false,
    paymentStatus: "completed" as const,
  },
  {
    campaignSlug: "realm-of-shadows-board-game",
    userTempId: "user2",
    amount: 120,
    currency: "USD",
    message: "The miniatures look amazing!",
    isAnonymous: false,
    paymentStatus: "completed" as const,
  },
  {
    campaignSlug: "urban-gardens-initiative",
    userTempId: "user1",
    amount: 50,
    currency: "USD",
    isAnonymous: true,
    paymentStatus: "completed" as const,
  },
  {
    campaignSlug: "codekids-programming-children",
    userTempId: "user2",
    amount: 100,
    currency: "USD",
    message: "Education is so important. Happy to support!",
    isAnonymous: false,
    paymentStatus: "completed" as const,
  },
];

export const sampleComments = [
  {
    campaignSlug: "ecocharge-solar-phone-charger",
    userTempId: "user1",
    content:
      "This is exactly what I've been looking for! Can't wait to take it camping.",
    daysAgo: 6,
  },
  {
    campaignSlug: "ecocharge-solar-phone-charger",
    userTempId: "user2",
    content: "Will this work in cloudy weather? I live in Seattle 😅",
    daysAgo: 4,
  },
  {
    campaignSlug: "ecocharge-solar-phone-charger",
    userTempId: "creator1",
    content:
      "Great question! Yes, it works in cloudy conditions—just takes about 2x longer to charge. We've tested extensively in the Pacific Northwest!",
    daysAgo: 4,
  },
  {
    campaignSlug: "realm-of-shadows-board-game",
    userTempId: "user1",
    content: "The miniatures look AMAZING. Any chance of a solo mode?",
    daysAgo: 8,
  },
  {
    campaignSlug: "realm-of-shadows-board-game",
    userTempId: "creator1",
    content:
      "Solo mode is confirmed! We'll release the full solo rules next week.",
    daysAgo: 7,
  },
  {
    campaignSlug: "whispers-in-the-wind-album",
    userTempId: "user2",
    content:
      "Your music got me through some tough times. So happy to support this!",
    daysAgo: 10,
  },
  {
    campaignSlug: "urban-gardens-initiative",
    userTempId: "user1",
    content: "This is such a great initiative for the community!",
    daysAgo: 3,
  },
  {
    campaignSlug: "codekids-programming-children",
    userTempId: "user2",
    content:
      "I wish I had something like this when I was growing up. Amazing work!",
    daysAgo: 5,
  },
];
