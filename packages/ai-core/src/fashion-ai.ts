import { OpenAI } from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { QdrantClient } from '@qdrant/js-client-rest';

export class FashionAI {
  private openai: OpenAI;
  private anthropic: Anthropic;
  private qdrant: QdrantClient;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    });

    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY!,
    });

    this.qdrant = new QdrantClient({
      url: process.env.QDRANT_URL!,
      apiKey: process.env.QDRANT_API_KEY,
    });
  }

  // Text Embeddings
  async generateEmbedding(text: string): Promise<number[]> {
    const response = await this.openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });
    
    return response.data[0].embedding;
  }

  // Product Description Generation
  async generateProductDescription(product: any): Promise<string> {
    const prompt = `
      Generate an engaging product description for a fashion item with these details:
      Name: ${product.name}
      Category: ${product.categories?.join(', ')}
      Price: $${product.price}
      Tags: ${product.tags?.join(', ')}

      Make it compelling, highlight key features, and include styling suggestions.
      Target audience: fashion-conscious millennials and Gen Z.
      Tone: modern, aspirational, but accessible.
    `;

    const response = await this.anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 500,
      messages: [{ role: "user", content: prompt }],
    });

    return response.content[0].text;
  }

  // Semantic Search
  async semanticSearch(query: string, filters: any = {}): Promise<any[]> {
    try {
      const queryEmbedding = await this.generateEmbedding(query);
      
      const results = await this.qdrant.search('products', {
        vector: queryEmbedding,
        limit: 20,
        filter: filters,
        with_payload: true,
      });

      return results.map((result: any) => ({
        ...result.payload,
        similarity: result.score,
      }));
    } catch (error) {
      console.warn('Qdrant search failed, falling back to mock results');
      return this.mockSearch(query);
    }
  }

  // Personalization Engine
  async getPersonalizedRecommendations(userId: string, limit: number = 10): Promise<any[]> {
    try {
      const userEmbedding = await this.getUserEmbedding(userId);
      
      if (!userEmbedding) {
        return this.getTrendingProducts(limit);
      }

      const results = await this.qdrant.search('products', {
        vector: userEmbedding,
        limit,
        with_payload: true,
      });

      return results.map((result: any) => result.payload);
    } catch (error) {
      console.warn('Qdrant recommendations failed, using trending products');
      return this.getTrendingProducts(limit);
    }
  }

  // Mock implementations for offline development
  private async mockSearch(query: string): Promise<any[]> {
    // Return mock products for development
    return [
      {
        id: '1',
        name: 'Classic White T-Shirt',
        description: 'Premium cotton t-shirt with perfect fit',
        price: 29.99,
        categories: ['tops', 'basics'],
        tags: ['casual', 'essential', 'cotton'],
        similarity: 0.85
      },
      {
        id: '2', 
        name: 'Slim Fit Jeans',
        description: 'Comfortable slim fit jeans with stretch',
        price: 89.99,
        categories: ['bottoms', 'denim'],
        tags: ['denim', 'slim-fit', 'casual'],
        similarity: 0.78
      }
    ];
  }

  private async getTrendingProducts(limit: number): Promise<any[]> {
    // Mock trending products
    return [
      {
        id: '1',
        name: 'Classic White T-Shirt',
        description: 'Premium cotton t-shirt with perfect fit',
        price: 29.99,
        categories: ['tops', 'basics'],
        tags: ['casual', 'essential', 'cotton'],
      },
      {
        id: '2',
        name: 'Slim Fit Jeans', 
        description: 'Comfortable slim fit jeans with stretch',
        price: 89.99,
        categories: ['bottoms', 'denim'],
        tags: ['denim', 'slim-fit', 'casual'],
      },
      {
        id: '3',
        name: 'Leather Jacket',
        description: 'Genuine leather jacket with modern cut',
        price: 299.99,
        categories: ['outerwear', 'jackets'],
        tags: ['leather', 'premium', 'statement'],
      }
    ].slice(0, limit);
  }

  private async getUserEmbedding(userId: string): Promise<number[] | null> {
    // Mock user embedding - in production, this would be stored in vector DB
    return null;
  }
}

export const fashionAI = new FashionAI();
