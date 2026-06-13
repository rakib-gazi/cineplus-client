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
