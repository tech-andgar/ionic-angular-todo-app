import { v4 as uuidv4 } from 'uuid';
import { JsonMap } from '../../../../core/model/json_map';

type TodoJson = {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  categoryId: string;
};

export class Todo {
  public readonly id: string;
  public readonly isCompleted: boolean;
  public readonly description: string;
  public readonly categoryId: string;

  constructor(
    public readonly title: string,
    {
      id,
      isCompleted = false,
      description = '',
      categoryId
    }: {
      id: string | undefined;
      isCompleted: boolean | undefined;
      description: string | undefined;
      categoryId: string | undefined;
    }
  ) {
    this.id = id ?? uuidv4();
    this.isCompleted = isCompleted;
    this.description = description;
    this.categoryId = categoryId ?? '-1';
  }

  copyWith({
    id,
    title,
    description,
    isCompleted,
    categoryId,
  }: Partial<TodoJson>): Todo {
    return new Todo(
      title ?? this.title,
      {
        id: id ?? this.id,
        isCompleted: isCompleted ?? this.isCompleted,
        description: description ?? this.description,
        categoryId: categoryId ?? this.categoryId,
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
        categoryId: json.categoryId,
      }
    );
  }

  toJson(): JsonMap {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      isCompleted: this.isCompleted,
    };
  }

  equals(other: Todo): boolean {
    if (this === other) return true;
    if (!(other instanceof Todo)) return false;
    return (
      this.id === other.id &&
      this.title === other.title &&
      this.description === other.description &&
      this.isCompleted === other.isCompleted
    );
  }

  toString(): string {
    return `Todo{id: ${this.id}, task: ${this.title}, isCompleted: ${this.isCompleted}, description: ${this.description}, categoryId: ${this.categoryId} }`;
  }
}
