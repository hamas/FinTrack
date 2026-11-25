/**
 * Domain Entities & Type Definitions
 * 
 * Defines the core data structures used throughout the FinTrack application,
 * bridging the gap between SQLite rows and TypeScript strict typing.
 * 
 * @module domain/entities
 */

/** Defines the supported chronological intervals for recurring generation */
export type Frequency = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'weekday' | 'custom';

/**
 * Complex configuration objects for custom recurring rules.
 * Handled via JSON stringification in the SQLite data source.
 */
export interface RecurringMetadata {
  dayOfWeek?: number; // 0-6 (Sunday-Saturday)
  weekOfMonth?: number; // 1-5 (Week index)
  dayOfMonth?: number; // 1-31 (Date integer)
}

/**
 * Represents a user-defined classification for financial grouping.
 */
export interface Category {
  id: string; // UUID or generated ID
  name: string; // The display name (e.g., 'Groceries')
  iconName: string; // The literal Lucide-React icon component name
  color: string; // Hexadecimal color code for UI badging
  type: 'income' | 'expense'; // The core financial modality
  budget?: number; // Optional monthly spending restriction
}

/**
 * Represents a single executed financial event.
 */
export interface Transaction {
  id: string; // UUID or generated ID
  name: string; // The encrypted (at rest) or decrypted (in flight) title
  amount: number; // The financial value
  date: string; // ISO 8601 Date string (YYYY-MM-DD)
  categoryId: string; // Foreign key referencing a Category
  
  // Virtual joined fields via TransactionRepository.getAll()
  categoryName?: string;
  categoryColor?: string;
  categoryIcon?: string;
  
  isRecurring: boolean; // Flag indicating if this was spawned by automation
  frequency?: Frequency; // Denormalized frequency tracking
  recurringId?: string; // Foreign key referencing the parent RecurringTransaction
}

/**
 * Represents the configuration rule for generating future transactions.
 */
export interface RecurringTransaction {
  id: string;
  name: string; // Encrypted title applied to generated children
  amount: number;
  categoryId: string;
  frequency: Frequency;
  nextDate: string; // The UTC date when the next execution is due
  endDate?: string; // Optional hard stop date for generation
  metadata?: string; // JSON string payload mapping to RecurringMetadata interface
}
