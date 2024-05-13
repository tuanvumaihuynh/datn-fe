export interface Tag {
  id: string;
  name: string;
  createdAt: string;
}

export interface TagWithSelected extends Tag {
  selected: boolean;
}
