import { v4 as uuidv4 } from 'uuid';
import { JsonMap } from '../../../../core/model/json_map';

type TodoJson = {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
};

export class Todo {
  constructor(
    public readonly title: string,
    public readonly id: string = uuidv4(),
    public readonly description: string = '',
    public readonly isCompleted: boolean = false
  ) {
    if (id.length === 0) {
      throw new Error('id must either be null or not empty');
    }
  }

  copyWith({
    id,
    title,
    description,
    isCompleted,
  }: Partial<TodoJson>): Todo {
    return new Todo(
      title ?? this.title,
      id ?? this.id,
      description ?? this.description,
      isCompleted ?? this.isCompleted
    );
  }

  static fromJson(json: TodoJson): Todo {
    return new Todo(
      json.title,
      json.id,
      json.description,
      json.isCompleted
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
    return `Todo{task: ${this.title}, isCompleted: ${this.isCompleted}, description: ${this.description}, id: ${this.id}}`;
  }
}
