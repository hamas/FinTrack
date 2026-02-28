import db from '../data-sources/sqlite.data-source';
import { Category } from '../../domain/entities/types';

/**
 * Handles database operations for Financial Categories.
 */
export class CategoryRepository {
    /**
     * Retrieves all categories.
     */
    async getAll(): Promise<Category[]> {
        return db.prepare('SELECT * FROM categories').all() as Category[];
    }

    /**
     * Creates a new category.
     */
    async create(category: Category): Promise<void> {
        const { id, name, iconName, color, type, budget } = category;
        const insert = db.prepare('INSERT INTO categories (id, name, iconName, color, type, budget) VALUES (?, ?, ?, ?, ?, ?)');
        insert.run(id, name, iconName, color, type, budget || null);
    }

    /**
     * Updates an existing category.
     */
    async update(id: string, updates: Partial<Category>): Promise<void> {
        const validKeys = ['name', 'iconName', 'color', 'type', 'budget'].filter(k => k in updates);
        if (validKeys.length === 0) return;

        const sets = validKeys.map(k => `${k} = ?`).join(', ');
        const values = validKeys.map(k => (updates as any)[k]);

        const stmt = db.prepare(`UPDATE categories SET ${sets} WHERE id = ?`);
        stmt.run(...values, id);
    }

    /**
     * Deletes a category by id.
     */
    async delete(id: string): Promise<void> {
        const stmt = db.prepare('DELETE FROM categories WHERE id = ?');
        stmt.run(id);
    }
}

export const categoryRepository = new CategoryRepository();
