# 模型层 Model

## 说明

## 目录结构

```
├─Book.ts
└─User.ts
```

因为 `export` 的是一个 `Class` 因此使用大写开头的驼峰命名

## 示例

### 静态方法

```typescript
// 我们通过 class 这样的语法糖使模型这个概念更加具象化，其优点：耦合性低、可维护性。
export default class Book {
  // static 方法修饰的成员不再属于某个对象，而是属于它所在的类。
  // 只需要通过其类名就可以访问，不需要再消耗资源反复创建对象。
  static async getBookList(params) {
    const res = await api.get('url', params);
    return res;
  }
}
```

具体实例

```typescript
// BookList.vue
import Book from '@/model/Book';

// ...
getBookList() {
  const res = Book.getBookList()
  // ...
}
```

### 业务模型

如果存在业务处理，数据结构转换等情况可以使用业务模型，通过实例化一个类来对业务进行处理及封装

```typescript
export default class User {
  username = '';
  
  role = '';

  constructor(username, role) {
    this.username = username;
    this.role = role;
  }

  getUserInfo() {
    return {
      username: this.username,
      role: this.role
    }
  }
}
```