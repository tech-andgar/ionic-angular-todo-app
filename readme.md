# # :zap: Ionic Todo App

## Overview

This project is a Todo App developed with Ionic, TypeScript, and Angular. It features a robust interface for managing todo items, including creating, reading, updating, and deleting them, as well as performing batch operations and managing resources. The app uses a Firebase cloud database for data storage and the [Ionic framework](https://ionicframework.com/docs) for its UI. The API is designed to be flexible and consistent, supporting various implementations while maintaining a unified interface.

- All CRUD operations can be performed through the Ionic UI.
- **Note:** To open web links in a new window, use _ctrl+click_ on the link.

![GitHub repo size](https://img.shields.io/github/repo-size/tech-andgar/ionic-angular-todo-app?style=plastic)
![GitHub pull requests](https://img.shields.io/github/issues-pr/tech-andgar/ionic-angular-todo-app?style=plastic)
![GitHub Repo stars](https://img.shields.io/github/stars/tech-andgar/ionic-angular-todo-app?style=plastic)
![GitHub last commit](https://img.shields.io/github/last-commit/tech-andgar/ionic-angular-todo-app?style=plastic)

## :page_facing_up: Table of contents

- [# :zap: Ionic Todo App](#-zap-ionic-todo-app)
  - [Overview](#overview)
  - [:page\_facing\_up: Table of contents](#page_facing_up-table-of-contents)
  - [:cool: Features](#cool-features)
  - [:camera: Screenshots](#camera-screenshots)
  - [:signal\_strength: Technologies](#signal_strength-technologies)
  - [🌳 Project Structure](#-project-structure)
  - [:floppy\_disk: Setup / Installation](#floppy_disk-setup--installation)
  - [Usage](#usage)
  - [Key Components](#key-components)
  - [📚 API Reference](#-api-reference)
    - [TodosApi](#todosapi)
      - [Todo Retrieval Methods](#todo-retrieval-methods)
      - [Todo Modification Methods](#todo-modification-methods)
      - [Todo Deletion Methods](#todo-deletion-methods)
      - [Batch Operations Methods](#batch-operations-methods)
      - [Resource Management Methods](#resource-management-methods)
  - [:computer: Code Examples - Implementation Details](#computer-code-examples---implementation-details)
    - [LocalStorageTodosApi](#localstoragetodosapi)
  - [🧪 Testing](#-testing)
  - [⚠️ Performance Considerations](#️-performance-considerations)
  - [:clipboard: Status \& To-do list](#clipboard-status--to-do-list)
  - [Contributing](#contributing)
  - [:file\_folder: License](#file_folder-license)
  - [:envelope: Contact](#envelope-contact)

## :cool: Features

**CRUD operations:**

- Create: Click '+' to create a to-do item.
- Read: Line items are displayed on the home page.
- Update: Click on item line to edit.
- Delete: swipe left and a colored 'DONE' button appears on the right.
- Batch operations (clear completed, complete all)
- Observable-based API for reactive programming
- Local storage persistence
- TypeScript for type safety
- Abstract API design for flexibility in implementation

## :camera: Screenshots

![todo items shown on ionic frontend and Firestore database](./docs/imgs/todo-app-multilanguage.png)
![todo items shown on ionic frontend and Firestore database](./docs/imgs/todo-app-web.png)
![todo items shown on ionic frontend and Firestore database](./docs/imgs/todo-app-category.png)
![todo items shown on ionic frontend and Firestore database](./docs/imgs/todo-app-filter-category.png)
![todo items shown on ionic frontend and Firestore database](./docs/imgs/todo-app-slide.png)
![todo items shown on ionic frontend and Firestore database](./docs/imgs/todo-app-options.png)
![todo items shown on ionic frontend and Firestore database](./docs/imgs/todo-app-undo.png)
![todo](./docs/video/todo-app.mp4)

## :signal_strength: Technologies

- [Ionic/angular v8](https://ionicframework.com/)
- [Ionic v7](https://ionicframework.com/)
- [Angular v18](https://angular.io/)
- [Firebase cloudstore v10](https://firebase.google.com/)

## 🌳 Project Structure

```
todo/
├── src
│   ├── app
│   │   ├── app.component.html
│   │   ├── app.component.scss
│   │   ├── app.component.spec.ts
│   │   ├── app.component.ts
│   │   ├── app.routes.ts
│   │   ├── core
│   │   │   ├── domain
│   │   │   │   ├── api
│   │   │   │   │   └── todos_api.ts
│   │   │   │   ├── exceptions
│   │   │   │   │   └── exceptions.ts
│   │   │   │   └── model
│   │   │   │       ├── category.model.ts
│   │   │   │       ├── json_map.ts
│   │   │   │       └── todo.model.ts
│   │   │   ├── language
│   │   │   │   ├── language-switcher.component.ts
│   │   │   │   ├── language.service.ts
│   │   │   │   └── model
│   │   │   │       └── language.model.ts
│   │   │   ├── settings
│   │   │   │   └── settings-dropdown.component.ts
│   │   │   └── theme
│   │   │       ├── theme-switcher.component.ts
│   │   │       └── theme.service.ts
│   │   └── features
│   │       ├── categories
│   │       │   ├── data
│   │       │   │   ├── infrastructure
│   │       │   │   │   └── local-storage-api
│   │       │   │   │       └── local.storage.categories.api.ts
│   │       │   │   └── repository
│   │       │   │       └── categories-repository-impl.ts
│   │       │   ├── domain
│   │       │   │   ├── infrastructure
│   │       │   │   │   └── categories_api.ts
│   │       │   │   └── repository
│   │       │   │       └── categories_repository.ts
│   │       │   └── presentation
│   │       │       └── category-list
│   │       │           ├── category-list.page.ts
│   │       │           └── category-list.service.ts
│   │       ├── home
│   │       │   └── presentation
│   │       │       └── home.page.ts
│   │       └── todos
│   │           ├── data
│   │           │   ├── infrastructure
│   │           │   │   └── local_storage
│   │           │   │       └── local.storage.todos.api.ts
│   │           │   └── repository
│   │           │       └── todos-repository-impl.ts
│   │           ├── domain
│   │           │   └── repository
│   │           │       └── todos_repository.ts
│   │           └── presentation
│   │               ├── components
│   │               │   ├── category-badge.component.ts
│   │               │   ├── category-filter.component.ts
│   │               │   ├── stats
│   │               │   │   ├── stats.component.ts
│   │               │   │   └── stats.service.ts
│   │               │   ├── todo-list-item
│   │               │   │   ├── todo-list-item.component.ts
│   │               │   │   └── todo-list-item.service.ts
│   │               │   ├── todos-overview-filter-button.component.ts
│   │               │   └── todos-overview-options-button.component.ts
│   │               ├── edit-todo
│   │               │   ├── edit-todo.page.ts
│   │               │   └── edit-todo.service.ts
│   │               └── todos-overview
│   │                   ├── todos-overview.page.ts
│   │                   └── todos-overview.service.ts
│   ├── app.config.ts
│   ├── assets
│   │   ├── i18n
│   │   │   ├── en.json
│   │   │   └── es.json
│   │   ├── icon
│   │   │   └── favicon.png
│   │   └── shapes.svg
│   ├── environments
│   │   ├── environment.prod.ts
│   │   └── environment.ts
│   ├── global.scss
│   ├── index.html
│   ├── main.ts
│   ├── polyfills.ts
│   ├── test.ts
│   ├── theme
│   │   └── variables.scss
│   └── zone-flags.ts
├── tsconfig.app.json
├── tsconfig.json
└── tsconfig.spec.json
```

- `todo.model.ts`: Defines the `Todo` interface
- `todos.api.ts`: Contains the abstract `TodosApi` class
- `local-storage-todos.api.ts`: Implements `TodosApi` using local storage

## :floppy_disk: Setup / Installation

1. Clone the repository:

   ```shell
   git clone https://github.com/tech-andgar/todo-api-project.git
   ```

2. Navigate to the project directory:

   ```shell
   cd todo-api-project
   ```

3. Install dependencies:

   ```shell
   pnpm i
   ```

   or

   ```shell
   yarn i
   ```

   or

   ```shell
   npm i
   ```

4. Add firebase access credentials in:

   `environment.ts`

5. Run the development server on _localhost://8100_:

   ``` shell
   ionic serve
   ```

6. Create build artifacts in `www` folder:

   ``` shell
   npm run build
   ```

## Usage

To use the Todo API in your Angular application, inject the `TodosApi` service into your component or service:

```typescript
import { Component } from '@angular/core';
import { TodosApi } from './path-to-todos-api';
import { Todo } from './path-to-todo-model';

@Component({
  selector: 'app-todo-list',
  template: '...'
})
export class TodoListComponent {
  todos: Todo[] = [];

  constructor(private todosApi: TodosApi) {
    this.todosApi.getTodos().subscribe(todos => this.todos = todos);
  }

  addTodo(todo: Todo) {
    this.todosApi.saveTodo(todo).subscribe(success => {
      if (success) {
        console.log('Todo added successfully');
      }
    });
  }
}
```

## Key Components

1. `core/domain/model/todo.model.ts`: Defines the `Todo` interface.
2. `core/api/todos.api.ts`: Abstract class defining the API for managing todos.
3. `data/api/local-storage-todos.api.ts`: Concrete implementation of `TodosApi` using local storage.
4. `features/todo/`: Contains components, services, and module for the todo feature.

## 📚 API Reference

### TodosApi

The `TodosApi` abstract class provides the following methods:

#### Todo Retrieval Methods

- `getTodos(): Observable<Todo[]>`
  - Provides an Observable of all todos.

- `getTodo(todoId: string): Observable<Todo>`
  - Retrieves a todo by its ID.

#### Todo Modification Methods

- `saveTodo(todo: Todo): Observable<boolean>`
  - Saves a todo. If a todo with the same ID already exists, it will be replaced.

- `saveTodoAt(todo: Todo, index: number | null): Observable<boolean>`
  - Saves a todo at a specified index. If a todo with the same ID already exists, it will be replaced.

#### Todo Deletion Methods

- `deleteTodo(id: string): Observable<boolean>`
  - Deletes the todo with the given ID.

#### Batch Operations Methods

- `clearCompleted(): Observable<number>`
  - Deletes all completed todos.

- `completeAll(isCompleted: boolean): Observable<number>`
  - Sets the `isCompleted` state of all todos to the given value.

#### Resource Management Methods

- `close(): Observable<void>`
  - Closes the API client and frees up any resources.

## :computer: Code Examples - Implementation Details

### LocalStorageTodosApi

The `LocalStorageTodosApi` class implements the `TodosApi` abstract class using browser's local storage for persistence. Key features include:

- Uses `BehaviorSubject` to manage the stream of todos
- Implements all abstract methods from `TodosApi`
- Persists todos to local storage after each operation
- Retrieves todos from local storage on initialization

Example of saving a todo:

```typescript
saveTodo(todo: Todo): Observable<boolean> {
  const todos = [...this.todoStreamController.value];
  const todoIndex = todos.findIndex(t => t.id === todo.id);
  if (todoIndex >= 0) {
    todos[todoIndex] = todo;
  } else {
    todos.push(todo);
  }

  this.todoStreamController.next(todos);
  localStorage.setItem(LocalStorageTodosApi.kTodosCollectionKey, JSON.stringify(todos));

  return this.getTodo(todo.id).pipe(map(todo => !!todo));
}
```

## 🧪 Testing

To run the tests for this project:

```shell
ng test
```

We use Jasmine for unit testing and Karma as the test runner. Key areas to test include:

- Individual CRUD operations
- Batch operations
- Edge cases (e.g., deleting non-existent todos)
- Local storage persistence

## ⚠️ Performance Considerations

- The current implementation loads all todos into memory, which may not be optimal for large datasets.
- Consider implementing pagination or virtual scrolling for better performance with large lists.
- Local storage has limited capacity; for larger applications, consider using IndexedDB or a backend server.

## :clipboard: Status & To-do list

- Status: Working.
- To-do:
  - [ ] Implementation Firestore
  - [ ] Implementation Feature Flag
  - [ ] Testing
<!-- - To-do: Add more detail/styling to front page. Add ESLint. Limit priority number to `1 to 10` -->

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<!-- ## :clap: Inspiration

- Project inspired by [Simon Grimm´s Youtube video 'How to Create a Simple Ionic 4 App with Firebase and AngularFire'](https://www.youtube.com/watch?v=H20l9ofyR54&t=1375s) -->

## :file_folder: License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## :envelope: Contact

Repo created by [TECH-ANDGAR](https://github.com/tech-andgar), email: <dev@tech-andgar.me>
