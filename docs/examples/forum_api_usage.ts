// Types
interface Category {
    id: number;
    name: string;
    description: string;
    order: number;
    created_at: string;
    updated_at: string;
}

interface Topic {
    id: number;
    title: string;
    content: string;
    category: number;
    author: User;
    course: number | null;
    is_pinned: boolean;
    is_locked: boolean;
    views_count: number;
    posts_count: number;
    last_post: Post | null;
    created_at: string;
    updated_at: string;
    last_activity: string;
}

interface User {
    id: number;
    username: string;
}

interface Post {
    id: number;
    content: string;
    author: User;
    parent: number | null;
    is_solution: boolean;
    likes_count: number;
    replies_count: number;
    replies: Post[];
    comments: Comment[];
    attachments: Attachment[];
    created_at: string;
    updated_at: string;
}

interface Comment {
    id: number;
    content: string;
    author: User;
    likes_count: number;
    created_at: string;
    updated_at: string;
}

interface Attachment {
    id: number;
    post: number;
    filename: string;
    file_size: number;
    content_type: string;
    uploaded_at: string;
}

// API Client
class ForumAPI {
    private baseUrl: string;
    private headers: Headers;

    constructor(baseUrl: string, token: string) {
        this.baseUrl = baseUrl;
        this.headers = new Headers({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        });
    }

    // Categories
    async getCategories(): Promise<Category[]> {
        const response = await fetch(`${this.baseUrl}/categories/`, {
            headers: this.headers
        });
        return response.json();
    }

    async createCategory(data: Partial<Category>): Promise<Category> {
        const response = await fetch(`${this.baseUrl}/categories/`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(data)
        });
        return response.json();
    }

    // Topics
    async getTopics(categoryId?: number): Promise<Topic[]> {
        const url = categoryId 
            ? `${this.baseUrl}/topics/?category=${categoryId}`
            : `${this.baseUrl}/topics/`;
        const response = await fetch(url, {
            headers: this.headers
        });
        return response.json();
    }

    async createTopic(data: {
        title: string;
        content: string;
        category: number;
        course?: number;
    }): Promise<Topic> {
        const response = await fetch(`${this.baseUrl}/topics/`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(data)
        });
        return response.json();
    }

    async toggleTopicPin(topicId: number): Promise<{ status: string; is_pinned: boolean }> {
        const response = await fetch(`${this.baseUrl}/topics/${topicId}/toggle_pin/`, {
            method: 'POST',
            headers: this.headers
        });
        return response.json();
    }

    async toggleTopicLock(topicId: number): Promise<{ status: string; is_locked: boolean }> {
        const response = await fetch(`${this.baseUrl}/topics/${topicId}/toggle_lock/`, {
            method: 'POST',
            headers: this.headers
        });
        return response.json();
    }

    // Posts
    async getTopicPosts(topicId: number): Promise<Post[]> {
        const response = await fetch(`${this.baseUrl}/topics/${topicId}/posts/`, {
            headers: this.headers
        });
        return response.json();
    }

    async createPost(topicId: number, content: string): Promise<Post> {
        const response = await fetch(`${this.baseUrl}/topics/${topicId}/posts/`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify({ content })
        });
        return response.json();
    }

    async replyToPost(postId: number, content: string): Promise<Post> {
        const response = await fetch(`${this.baseUrl}/posts/${postId}/reply/`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify({ content })
        });
        return response.json();
    }

    async markPostAsSolution(topicId: number, postId: number): Promise<{ status: string }> {
        const response = await fetch(`${this.baseUrl}/topics/${topicId}/posts/${postId}/mark_as_solution/`, {
            method: 'POST',
            headers: this.headers
        });
        return response.json();
    }

    async togglePostLike(postId: number): Promise<{ status: string; likes_count: number }> {
        const response = await fetch(`${this.baseUrl}/posts/${postId}/toggle_like/`, {
            method: 'POST',
            headers: this.headers
        });
        return response.json();
    }

    // Comments
    async getPostComments(postId: number): Promise<Comment[]> {
        const response = await fetch(`${this.baseUrl}/posts/${postId}/comments/`, {
            headers: this.headers
        });
        return response.json();
    }

    async createComment(postId: number, content: string): Promise<Comment> {
        const response = await fetch(`${this.baseUrl}/posts/${postId}/comments/`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify({ content })
        });
        return response.json();
    }

    async toggleCommentLike(postId: number, commentId: number): Promise<{ status: string; likes_count: number }> {
        const response = await fetch(`${this.baseUrl}/posts/${postId}/comments/${commentId}/toggle_like/`, {
            method: 'POST',
            headers: this.headers
        });
        return response.json();
    }

    // Attachments
    async uploadAttachment(postId: number, file: File): Promise<Attachment> {
        const formData = new FormData();
        formData.append('post', postId.toString());
        formData.append('file', file);
        formData.append('filename', file.name);
        formData.append('file_size', file.size.toString());
        formData.append('content_type', file.type);

        const headers = new Headers(this.headers);
        headers.delete('Content-Type'); // Let the browser set it

        const response = await fetch(`${this.baseUrl}/attachments/`, {
            method: 'POST',
            headers,
            body: formData
        });
        return response.json();
    }

    async deleteAttachment(attachmentId: number): Promise<void> {
        await fetch(`${this.baseUrl}/attachments/${attachmentId}/`, {
            method: 'DELETE',
            headers: this.headers
        });
    }
}

// Example usage
async function example() {
    const api = new ForumAPI('https://api.comlab.com/api/forum', 'your-token-here');

    // Get categories
    const categories = await api.getCategories();
    console.log('Categories:', categories);

    // Create a topic
    const newTopic = await api.createTopic({
        title: 'Mon nouveau sujet',
        content: 'Contenu du sujet',
        category: categories[0].id
    });
    console.log('New topic:', newTopic);

    // Create a post in the topic
    const newPost = await api.createPost(newTopic.id, 'Premier message dans le sujet');
    console.log('New post:', newPost);

    // Reply to the post
    const reply = await api.replyToPost(newPost.id, 'Réponse au message');
    console.log('Reply:', reply);

    // Add a comment
    const comment = await api.createComment(newPost.id, 'Un commentaire');
    console.log('Comment:', comment);

    // Like the post
    const likeResult = await api.togglePostLike(newPost.id);
    console.log('Like result:', likeResult);

    // Upload an attachment
    const file = new File(['Hello, World!'], 'test.txt', { type: 'text/plain' });
    const attachment = await api.uploadAttachment(newPost.id, file);
    console.log('Attachment:', attachment);
}
