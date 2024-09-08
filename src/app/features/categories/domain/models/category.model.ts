import { v4 as uuidv4 } from 'uuid';
import { JsonMap } from '../../../../core/model/json_map';

type CategoryJson = {
  id: string;
  name: string;
  active: boolean;
};

export class Category {
  constructor(
    public readonly name: string,
    public readonly id: string = uuidv4(),
    public readonly active: boolean = true
  ) {
    if (id.length === 0) {
      throw new Error('id must either be null or not empty');
    }
  }

  copyWith({
    id,
    name,
    active,
  }: Partial<CategoryJson>): Category {
    return new Category(
      name ?? this.name,
      id ?? this.id,
      active ?? this.active
    );
  }

  static fromJson(json: CategoryJson): Category {
    return new Category(
      json.name,
      json.id,
      json.active
    );
  }

  toJson(): JsonMap {
    return {
      id: this.id,
      name: this.name,
      active: this.active,
    };
  }

  equals(other: Category): boolean {
    if (this === other) return true;
    if (!(other instanceof Category)) return false;
    return (
      this.id === other.id &&
      this.name === other.name &&
      this.active === other.active
    );
  }

  toString(): string {
    return `Category{task: ${this.name}, active: ${this.active}, id: ${this.id}}`;
  }
}
