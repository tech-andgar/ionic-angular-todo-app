
import { v4 as uuidv4 } from 'uuid';
import { JsonMap } from './json_map';

type CategoryJson = {
  id: string;
  name: string;
  active: boolean;
};

export class Category {
  public readonly name: string | null;
  public readonly id: string | null;
  public readonly active: boolean = true
  constructor({
    name = null,
    id = null,
    active = true,
  }: {
    name: string | null,
    id: string | null,
    active: boolean | null
  }) {
    // if (name!.length === 0) {
    //   throw new Error('name must either be null or not empty');
    // }
    this.name = name;
    this.id = id;
    this.active = active!;
  }

  static create({ id, name }: { id: string | null, name: string }): Category {
    return new Category({
      id: id ?? uuidv4(), name: name, active: true
    });
  }

  copyWith({
    id,
    name,
    active,
  }: Partial<CategoryJson>): Category {
    return new Category({
      name: name ?? this.name,
      id: id ?? this.id,
      active: active ?? this.active
    });
  }


  static fromJson(json: CategoryJson): Category {
    return new Category({
      name: json.name,
      id: json.id,
      active: json.active
    });
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

  isEmpty(): boolean {
    return this.id === null &&
      this.name === null &&
      this.active === false;
  }
}
