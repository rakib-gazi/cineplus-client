export interface CastMember {
  name: string;
  role?: string;
  image: string;
}

export interface Show {
  title: string;
  category: string;
  image: string;
  rating: string;
  desc: string;
  cast: CastMember[];
}

const DEFAULT_CAST: CastMember[] = [
  {
    name: "Jitendra Kumar",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
  },
  {
    name: "Naveen Kasturia",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80",
  },
  {
    name: "Ahsaas Channa",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
  },
  {
    name: "Maanvi Gagroo",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
  },
];

export const SHOWS_DATA: Show[] = [
  {
    title: "Panchayat",
    category: "Family Drama",
    image: "https://api.theviralfever.com/wp-content/uploads/2025/06/Screenshot-2025-07-05-at-13.28.01-1.webp",
    rating: "8.9",
    desc: "A comedy-drama, which captures the journey of an engineering graduate Abhishek, who joins as secretary of a Panchayat office in a remote village of Uttar Pradesh.",
    cast: [
      {
        name: "Jitendra Kumar",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
      },
      {
        name: "Raghubir Yadav",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
      },
      {
        name: "Neena Gupta",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80",
      },
      {
        name: "Faisal Malik",
        image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&h=150&q=80",
      },
      {
        name: "Chandan Roy",
        image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&h=150&q=80",
      },
      {
        name: "Sanvikaa",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
      },
    ],
  },
  {
    title: "Sapne vs Everyone",
    category: "Drama",
    image: "https://api.theviralfever.com/wp-content/uploads/2025/07/Untitled-design.jpg",
    rating: "9.4",
    desc: "The story of two guys who have very different dreams but their paths cross and they have to fight against everyone to achieve what they deserve.",
    cast: [
      {
        name: "Paramvir Cheema",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
      },
      {
        name: "Ambrish Verma",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
      },
      {
        name: "Naveen Kasturia",
        image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&h=150&q=80",
      },
      {
        name: "Sukhwinder Chahal",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80",
      },
    ],
  },
  {
    title: "Kota Factory",
    category: "Youth/Drama",
    image: "https://api.theviralfever.com/wp-content/uploads/2025/07/WhatsApp-Image-2025-07-02-at-5.44.14-PM.webp",
    rating: "9.0",
    desc: "Dedicated to Shrimati Shakuntala Devi, Kota Factory captures the life of IIT-JEE aspirants in Kota, their struggles, friendship and the mentorship of Jeetu Bhaiya.",
    cast: [
      {
        name: "Mayur More",
        image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&h=150&q=80",
      },
      {
        name: "Ranjan Raj",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
      },
      {
        name: "Ahsaas Channa",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
      },
      {
        name: "Revathi Pillai",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80",
      },
      {
        name: "Urvi Singh",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
      },
      {
        name: "Alam Khan",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80",
      },
      {
        name: "Jitendra Kumar",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
      },
      {
        name: "Tillotama Shome",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80",
      },
    ],
  },
  {
    title: "Aspirants",
    category: "Drama",
    image: "https://api.theviralfever.com/wp-content/uploads/2025/07/Screenshot-2025-07-03-184453-1.webp",
    rating: "8.9",
    desc: "A story of the struggle, companionship, and dynamic of three UPSC aspirants, Abhilash, Guri, and SK, set in the UPSC coaching hub of Rajinder Nagar, Delhi.",
    cast: [
      {
        name: "Naveen Kasturia",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
      },
      {
        name: "Shivankit Singh",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
      },
      {
        name: "Abhilash Thapliyal",
        image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&h=150&q=80",
      },
      {
        name: "Sunny Hinduja",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80",
      },
      {
        name: "Namita Dubey",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
      },
    ],
  },
  {
    title: "Gullak",
    category: "Family Comedy",
    image: "https://api.theviralfever.com/wp-content/uploads/2025/07/Untitled-design-1.jpg",
    rating: "9.1",
    desc: "Set in a quaint town in North India, Gullak centers around the Mishra family, capturing their day-to-day squabbles, love, and sweet-sour moments.",
    cast: [
      {
        name: "Jameel Khan",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80",
      },
      {
        name: "Geetanjali Kulkarni",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80",
      },
      {
        name: "Vaibhav Raj Gupta",
        image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&h=150&q=80",
      },
      {
        name: "Harsh Mayar",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
      },
    ],
  },
  {
    title: "Pitchers",
    category: "Tech/Drama",
    image: "https://api.theviralfever.com/wp-content/uploads/2025/07/pitchers-poster.png",
    rating: "9.1",
    desc: "A story of four friends, Naveen, Jitu, Yogi, and Saurabh, who enter the business world by launching their own startup.",
    cast: [
      {
        name: "Naveen Kasturia",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
      },
      {
        name: "Arunabh Kumar",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
      },
      {
        name: "Jitendra Kumar",
        image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&h=150&q=80",
      },
      {
        name: "Abhay Mahajan",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80",
      },
    ],
  },
  {
    title: "Permanent Roommates",
    category: "Romance",
    image: "https://api.theviralfever.com/wp-content/uploads/2025/07/Screenshot-2025-07-05-at-13.29.43-1.webp",
    rating: "8.6",
    desc: "Permanent Roommates follows the story of Tanya and Mikesh, a couple who, after being in a long-distance relationship for 3 years, face the prospect of marriage.",
    cast: [
      {
        name: "Sumeet Vyas",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
      },
      {
        name: "Nidhi Singh",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
      },
      {
        name: "Deepak Kumar Mishra",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
      },
      {
        name: "Sheeba Chaddha",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80",
      },
    ],
  },
  {
    title: "Tripling",
    category: "Comedy/Drama",
    image: "https://api.theviralfever.com/wp-content/uploads/2025/07/Screenshot-2025-07-05-at-20.30.36-1-scaled.webp",
    rating: "8.5",
    desc: "Tripling traces the story of three siblings, Chandan, Chanchal & Chitvan. Together they start a hilarious road trip, to meet themselves and their relationship.",
    cast: [
      {
        name: "Sumeet Vyas",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
      },
      {
        name: "Maanvi Gagroo",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
      },
      {
        name: "Amol Parashar",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
      },
      {
        name: "Kunal Roy Kapoor",
        image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&h=150&q=80",
      },
    ],
  },
  {
    title: "Hostel Daze",
    category: "Youth/Comedy",
    image: "https://api.theviralfever.com/wp-content/uploads/2025/07/hostel-daze.jpg",
    rating: "8.1",
    desc: "Hostel Daze captures the adventures of four hostel roommates - Ankit, Chirag, Jaat and Jhantoo - inside an engineering college hostel in India.",
    cast: DEFAULT_CAST,
  },
  {
    title: "Half CA",
    category: "Drama",
    image: "https://api.theviralfever.com/wp-content/uploads/2025/07/Screenshot-2025-07-05-at-13.15.29-scaled.webp",
    rating: "8.4",
    desc: "The story focuses on the struggle of CA students in India, their dedication, mentorship and failures on their journey to clear the exam.",
    cast: [
      {
        name: "Ahsaas Channa",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
      },
      {
        name: "Gyanendra Tripathi",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
      },
      {
        name: "Anmol Kajani",
        image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&h=150&q=80",
      },
    ],
  },
  {
    title: "College Romance",
    category: "Youth/Comedy",
    image: "https://api.theviralfever.com/wp-content/uploads/2025/07/Screenshot-2025-07-03-190004.webp",
    rating: "8.4",
    desc: "Three best friends look for love, laughs and some lifelong memories while attending college together.",
    cast: DEFAULT_CAST,
  },
  {
    title: "Sandeep Bhaiya",
    category: "Drama",
    image: "https://api.theviralfever.com/wp-content/uploads/2025/07/Screenshot-2025-07-03-192115.webp",
    rating: "8.8",
    desc: "A spin-off of Aspirants, Sandeep Bhaiya tells the inspiring backstory of the beloved mentor Sandeep Singh, his struggle and his transformation.",
    cast: [
      {
        name: "Sunny Hinduja",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80",
      },
      {
        name: "Deepali Gautam",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
      },
      {
        name: "Priti Shroff",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80",
      },
    ],
  },
];
