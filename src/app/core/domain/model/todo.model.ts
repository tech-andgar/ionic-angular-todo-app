import { v4 as uuidv4 } from 'uuid';
import { JsonMap } from './json_map';
import { Category } from './category.model';

type TodoJson = {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  category: Category;
};

export class Todo {
  public readonly id: string;
  public readonly isCompleted: boolean;
  public readonly description: string;
  public readonly category: Category;

  constructor(
    public readonly title: string,
    {
      id,
      isCompleted = false,
      description = '',
      category: category
    }: {
      id: string;
      isCompleted: boolean;
      description: string;
      category: Category;
    }
  ) {
    this.id = id;
    this.isCompleted = isCompleted;
    this.description = description;
    this.category = category ?? new Category({ name: null, id: null, active: null });
  }

  static create(
    { id, title, description, category }:
    { id: string | null, title: string, description: string, category: Category }
  ): Todo {
    return new Todo(
      title,
      {
        id: id ?? uuidv4(),
        description: description,
        isCompleted: false,
        category: category
      });
  }

  isEmpty(): boolean {
    return this.id === '' &&
      this.title === '' &&
      this.description === '' &&
      this.isCompleted === false &&
      this.category.isEmpty();
  }

  copyWith({
    id,
    title,
    description,
    isCompleted,
    category,
  }: Partial<TodoJson>): Todo {
    return new Todo(
      title ?? this.title,
      {
        id: id ?? this.id,
        isCompleted: isCompleted ?? this.isCompleted,
        description: description ?? this.description,
        category: category ?? this.category,
      }
    );
  }

  static fromJson(json: TodoJson): Todo {
    return new Todo(
      json.title,
      {
        id: json.id,
        isCompleted: json.isCompleted,
        description: json.description,
        category: json.category,
      }
    );
  }

  toJson(): JsonMap {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      isCompleted: this.isCompleted,
      category: this.category,
    };
  }

  equals(other: Todo): boolean {
    if (this === other) return true;
    if (!(other instanceof Todo)) return false;
    return (
      this.id === other.id &&
      this.title === other.title &&
      this.description === other.description &&
      this.isCompleted === other.isCompleted &&
      this.category === other.category
    );
  }

  toString(): string {
    return `Todo{id: ${this.id}, task: ${this.title}, isCompleted: ${this.isCompleted}, description: ${this.description}, category: ${this.category} }`;
  }
}
