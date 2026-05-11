export interface Group {
  id: number;
  name: string;
  members: number;
  avatar: string;
}

const groupsData: Group[] = [
  {
    id: 1,
    name: "DE-30.10.2025",
    members: 7,
    avatar: "/api/placeholder/40/40",
  },
  { id: 2, name: "21321", members: 7, avatar: "/api/placeholder/40/40" },
  { id: 3, name: "Không", members: 6, avatar: "/api/placeholder/40/40" },
  {
    id: 4,
    name: "CB1 - IELTS 0 - 2.5 | 357 20:00 |...",
    members: 22,
    avatar: "/api/placeholder/40/40",
  },
  {
    id: 5,
    name: "CB1 - IELTS 4.5 - 5.5 | 456 18:00...",
    members: 22,
    avatar: "/api/placeholder/40/40",
  },
  {
    id: 6,
    name: "IELTS Preparation Course 01",
    members: 5,
    avatar: "/api/placeholder/40/40",
  },
];

export default groupsData;
