export type MockLanguage = "ko" | "ja" | "zh" | "en";

export type MockPostCategory = "review" | "question" | "tip" | "general";

export type MockGuideCategory =
  | "attraction"
  | "restaurant"
  | "accommodation"
  | "shopping"
  | "culture";

export type MockProvider = "google" | "line" | "wechat" | "facebook";

export interface MockUser {
  id: string;
  name: string;
  email: string;
  openId: string;
  provider: MockProvider;
  preferredLanguage: MockLanguage;
}

export interface MockProfile {
  userId: string;
  nickname: string;
  bio: string;
  preferredLanguage: MockLanguage;
}

export interface MockPost {
  id: number;
  title: string;
  content: string;
  category: MockPostCategory;
  originalLanguage: MockLanguage;
  language: MockLanguage;
  authorId: string;
  author: string;
  authorName: string;
  createdAt: string;
  viewCount: number;
  views: number;
  commentCount: number;
  tags: string[];
}

export interface MockComment {
  id: number;
  postId: number;
  authorId: string;
  authorName: string;
  content: string;
  originalLanguage: MockLanguage;
  createdAt: string;
}

export interface MockGuideSpot {
  id: number;
  category: MockGuideCategory;
  tags: string[];
  address: string | null;
  rating: number | null;
  latitude: string | null;
  longitude: string | null;
  image: string | null;
  imageUrl: string | null;
  url: string | null;
  nameKo: string;
  nameJa: string;
  nameZh: string;
  nameEn: string;
  descriptionKo: string;
  descriptionJa: string;
  descriptionZh: string;
  descriptionEn: string;
}

export interface MockDatabase {
  currentUserId: string | null;
  users: MockUser[];
  profiles: Record<string, MockProfile>;
  posts: MockPost[];
  comments: MockComment[];
  guideSpots: MockGuideSpot[];
}

export interface MockTranslationResult {
  translated: string;
}

export const defaultMockDatabase: MockDatabase = {
  currentUserId: null,
  users: [
    {
      id: "user-google",
      name: "Mina Kim",
      email: "mina@busanconnect.mock",
      openId: "google|mina",
      provider: "google",
      preferredLanguage: "ko",
    },
    {
      id: "user-line",
      name: "Sora Tanaka",
      email: "sora@busanconnect.mock",
      openId: "line|sora",
      provider: "line",
      preferredLanguage: "ja",
    },
    {
      id: "user-wechat",
      name: "Chen Yu",
      email: "chen@busanconnect.mock",
      openId: "wechat|chen",
      provider: "wechat",
      preferredLanguage: "zh",
    },
    {
      id: "user-facebook",
      name: "Alex Rivera",
      email: "alex@busanconnect.mock",
      openId: "facebook|alex",
      provider: "facebook",
      preferredLanguage: "en",
    },
  ],
  profiles: {
    "user-google": {
      userId: "user-google",
      nickname: "Mina",
      bio: "Busan local who likes cafe hopping and sunset spots.",
      preferredLanguage: "ko",
    },
    "user-line": {
      userId: "user-line",
      nickname: "Sora",
      bio: "Weekend traveler collecting quiet neighborhood routes.",
      preferredLanguage: "ja",
    },
    "user-wechat": {
      userId: "user-wechat",
      nickname: "Chen",
      bio: "Food-first traveler searching for seafood and markets.",
      preferredLanguage: "zh",
    },
    "user-facebook": {
      userId: "user-facebook",
      nickname: "Alex",
      bio: "First-time Busan visitor planning a 3-day trip.",
      preferredLanguage: "en",
    },
  },
  posts: [
    {
      id: 1,
      title: "Sunrise walk at Dalmaji Hill",
      content:
        "I started before 6 AM and the coastal view was worth it. The quiet path near the hill feels very different from the main beach crowd.",
      category: "review",
      originalLanguage: "en",
      language: "en",
      authorId: "user-facebook",
      author: "Alex Rivera",
      authorName: "Alex Rivera",
      createdAt: "2026-04-18T07:30:00.000Z",
      viewCount: 128,
      views: 128,
      commentCount: 2,
      tags: ["sunrise", "walk", "haeundae"],
    },
    {
      id: 2,
      title: "Best market lunch near Jagalchi?",
      content:
        "I want a casual seafood lunch close to Jagalchi Market. Fresh sashimi is good, but I also want somewhere friendly for solo travelers.",
      category: "question",
      originalLanguage: "en",
      language: "en",
      authorId: "user-facebook",
      author: "Alex Rivera",
      authorName: "Alex Rivera",
      createdAt: "2026-04-17T12:10:00.000Z",
      viewCount: 84,
      views: 84,
      commentCount: 1,
      tags: ["food", "market", "seafood"],
    },
    {
      id: 3,
      title: "A calm evening route around Gwangalli",
      content:
        "If you want to avoid the busiest time, walk from Millak Waterfront Park toward the bridge after dinner. The view opens up slowly and the breeze is nice.",
      category: "tip",
      originalLanguage: "en",
      language: "en",
      authorId: "user-google",
      author: "Mina Kim",
      authorName: "Mina Kim",
      createdAt: "2026-04-16T10:45:00.000Z",
      viewCount: 203,
      views: 203,
      commentCount: 2,
      tags: ["gwangalli", "night", "walk"],
    },
    {
      id: 4,
      title: "Gamcheon village half-day plan",
      content:
        "The village gets busy around midday. I recommend going early, then moving to nearby cafes after the main photo spots.",
      category: "general",
      originalLanguage: "en",
      language: "en",
      authorId: "user-line",
      author: "Sora Tanaka",
      authorName: "Sora Tanaka",
      createdAt: "2026-04-14T09:00:00.000Z",
      viewCount: 156,
      views: 156,
      commentCount: 1,
      tags: ["gamcheon", "itinerary", "photos"],
    },
  ],
  comments: [
    {
      id: 1,
      postId: 1,
      authorId: "user-google",
      authorName: "Mina Kim",
      content: "Try the small coffee stand near the trail entrance after sunrise.",
      originalLanguage: "en",
      createdAt: "2026-04-18T09:00:00.000Z",
    },
    {
      id: 2,
      postId: 1,
      authorId: "user-line",
      authorName: "Sora Tanaka",
      content: "I liked the same route on a weekday. It was very peaceful.",
      originalLanguage: "en",
      createdAt: "2026-04-18T11:30:00.000Z",
    },
    {
      id: 3,
      postId: 2,
      authorId: "user-wechat",
      authorName: "Chen Yu",
      content: "Look for the small upstairs places behind the main seafood lane.",
      originalLanguage: "en",
      createdAt: "2026-04-17T13:25:00.000Z",
    },
    {
      id: 4,
      postId: 3,
      authorId: "user-facebook",
      authorName: "Alex Rivera",
      content: "This was helpful. The bridge lights were amazing after 8 PM.",
      originalLanguage: "en",
      createdAt: "2026-04-16T15:40:00.000Z",
    },
    {
      id: 5,
      postId: 3,
      authorId: "user-wechat",
      authorName: "Chen Yu",
      content: "Millak also has great takeaway snacks if you want a quick stop.",
      originalLanguage: "en",
      createdAt: "2026-04-16T18:05:00.000Z",
    },
    {
      id: 6,
      postId: 4,
      authorId: "user-google",
      authorName: "Mina Kim",
      content: "Agree. Morning light there is much better for photos.",
      originalLanguage: "en",
      createdAt: "2026-04-14T10:20:00.000Z",
    },
  ],
  guideSpots: [
    {
      id: 1,
      category: "attraction",
      tags: ["beach", "sunrise", "walk"],
      address: "264 Haeundaehaebyeon-ro, Busan",
      rating: 4.8,
      latitude: "35.1587",
      longitude: "129.1604",
      image: "https://picsum.photos/seed/haeundae/800/500",
      imageUrl: "https://picsum.photos/seed/haeundae/800/500",
      url: "https://www.visitbusan.net/",
      nameKo: "Haeundae Beach",
      nameJa: "Haeundae Beach",
      nameZh: "Haeundae Beach",
      nameEn: "Haeundae Beach",
      descriptionKo: "A long urban beach with sunrise views and a lively boardwalk.",
      descriptionJa: "A long urban beach with sunrise views and a lively boardwalk.",
      descriptionZh: "A long urban beach with sunrise views and a lively boardwalk.",
      descriptionEn: "A long urban beach with sunrise views and a lively boardwalk.",
    },
    {
      id: 2,
      category: "culture",
      tags: ["art", "photos", "village"],
      address: "203 Gamnae 2-ro, Saha-gu, Busan",
      rating: 4.6,
      latitude: "35.0977",
      longitude: "129.0103",
      image: "https://picsum.photos/seed/gamcheon/800/500",
      imageUrl: "https://picsum.photos/seed/gamcheon/800/500",
      url: "https://www.visitbusan.net/",
      nameKo: "Gamcheon Culture Village",
      nameJa: "Gamcheon Culture Village",
      nameZh: "Gamcheon Culture Village",
      nameEn: "Gamcheon Culture Village",
      descriptionKo: "A hillside village filled with murals, stairs, and photo spots.",
      descriptionJa: "A hillside village filled with murals, stairs, and photo spots.",
      descriptionZh: "A hillside village filled with murals, stairs, and photo spots.",
      descriptionEn: "A hillside village filled with murals, stairs, and photo spots.",
    },
    {
      id: 3,
      category: "restaurant",
      tags: ["seafood", "market", "local"],
      address: "52 Jagalchihaean-ro, Jung-gu, Busan",
      rating: 4.7,
      latitude: "35.0966",
      longitude: "129.0306",
      image: "https://picsum.photos/seed/jagalchi/800/500",
      imageUrl: "https://picsum.photos/seed/jagalchi/800/500",
      url: "https://www.visitbusan.net/",
      nameKo: "Jagalchi Market",
      nameJa: "Jagalchi Market",
      nameZh: "Jagalchi Market",
      nameEn: "Jagalchi Market",
      descriptionKo: "The go-to market for fresh seafood, casual meals, and local energy.",
      descriptionJa: "The go-to market for fresh seafood, casual meals, and local energy.",
      descriptionZh: "The go-to market for fresh seafood, casual meals, and local energy.",
      descriptionEn: "The go-to market for fresh seafood, casual meals, and local energy.",
    },
    {
      id: 4,
      category: "shopping",
      tags: ["mall", "family", "indoor"],
      address: "35 Centumnam-daero, Busan",
      rating: 4.4,
      latitude: "35.1681",
      longitude: "129.1295",
      image: "https://picsum.photos/seed/centum/800/500",
      imageUrl: "https://picsum.photos/seed/centum/800/500",
      url: "https://www.visitbusan.net/",
      nameKo: "Shinsegae Centum City",
      nameJa: "Shinsegae Centum City",
      nameZh: "Shinsegae Centum City",
      nameEn: "Shinsegae Centum City",
      descriptionKo: "A huge indoor complex for shopping, spa visits, and easy family stops.",
      descriptionJa: "A huge indoor complex for shopping, spa visits, and easy family stops.",
      descriptionZh: "A huge indoor complex for shopping, spa visits, and easy family stops.",
      descriptionEn: "A huge indoor complex for shopping, spa visits, and easy family stops.",
    },
    {
      id: 5,
      category: "accommodation",
      tags: ["stay", "ocean", "luxury"],
      address: "51 Marine city 1-ro, Haeundae-gu, Busan",
      rating: 4.5,
      latitude: "35.1568",
      longitude: "129.1430",
      image: "https://picsum.photos/seed/stay/800/500",
      imageUrl: "https://picsum.photos/seed/stay/800/500",
      url: "https://www.visitbusan.net/",
      nameKo: "Oceanfront Stay District",
      nameJa: "Oceanfront Stay District",
      nameZh: "Oceanfront Stay District",
      nameEn: "Oceanfront Stay District",
      descriptionKo: "A mock accommodation entry for exploring where to stay near the coast.",
      descriptionJa: "A mock accommodation entry for exploring where to stay near the coast.",
      descriptionZh: "A mock accommodation entry for exploring where to stay near the coast.",
      descriptionEn: "A mock accommodation entry for exploring where to stay near the coast.",
    },
  ],
};
