import db from '../data-sources/sqlite.data-source';
import { Category } from '../../domain/entities/types';

/**
 * Repository handling database operations for Financial Categories.
 * Provides a clean interface for managing the taxonomies of user spending.
 * 
 * @module data/repositories/category
 */
export class CategoryRepository {
    /**
     * Retrieves all available categories.
     * 
     * @returns {Promise<Category[]>} A complete list of categories.
     */
    async getAll(): Promise<Category[]> {
        return db.prepare('SELECT * FROM categories').all() as Category[];
    }

    /**
     * Inserts a new user-defined category into the SQLite database.
     * 
     * @param {Category} category - The complete category object.
     * @returns {Promise<void>}
     */
    async create(category: Category): Promise<void> {
        const { id, name, iconName, color, type, budget } = category;
        const insert = db.prepare('INSERT INTO categories (id, name, iconName, color, type, budget) VALUES (?, ?, ?, ?, ?, ?)');
        insert.run(id, name, iconName, color, type, budget || null);
    }

    /**
     * Partially updates an existing category based on a dynamic set of fields.
     * 
     * @param {string} id - The Unique ID of the category modifying.
     * @param {Partial<Category>} updates - The fields to modify.
     * @returns {Promise<void>}
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
     * Permanently deletes a given category from the taxonomy.
     * Warning: Relies on SQLite Foreign Key constraints being gracefully handled or cascade enabled.
     * 
     * @param {string} id - The Unique ID of the category.
     * @returns {Promise<void>}
     */
    async delete(id: string): Promise<void> {
        const stmt = db.prepare('DELETE FROM categories WHERE id = ?');
        stmt.run(id);
    }
}

export const categoryRepository = new CategoryRepository();
