export interface User {
  id: number | string;
  email: string;
  password: string;
  name: string;
  createdAt: string;
}

export interface Post {
  id: number | string;
  title: string;
  content: string;
  imageUrl: string;
  createdAt: string;
  userId: number | string;
}

export interface Comment {
  id: number | string;
  content: string;
  postId: number | string;
  userId: number | string;
  createdAt: string;
}

export interface CreatePostData {
  title: string;
  content: string;
  imageUrl: string;
}

export interface UpdatePostData extends CreatePostData {
  id: number | string;
}

export interface CreateUserData {
  email: string;
  password: string;
  name: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface CreateCommentData {
  content: string;
  postId: number | string;
} 