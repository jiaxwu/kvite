# kvite
一个基于uni-app plus.sqlite 的kv数据库



# 快速开始

### Step 1 引入文件

拷贝[kvite.js](https://github.com/XiaoHuaShiFu/kvite/blob/main/kvite.js)到目录下，并导入

```javascript
import { Kvite } from './kvite'
```

### Step 2 创建表

第一个参数是数据库名，第二个参数是表名

```javascript
const userTable = await Kvite.NewKvite('testDb', 'user')
```

### Step 3 增删查改

#### put：添加或修改数据

```javascript
await userTable.put('小红', {gender: '女', age: 18})
```

#### get：获取数据，若不存在返回null

```javascript
await userTable.get('小红')
```

#### remove：删除数据

```javascript
await userTable.remove('小红')
```

# Kvite API

在Kvite类上的api，全部api均为异步，异常情况均抛出异常

| api                         | 参数1类型 | 参数2类型 | 返回值类型          | 说明                           |
| --------------------------- | --------- | --------- | ------------------- | ------------------------------ |
| NewKvite(dbName, tableName) | String    | String    | Kvite               | 创建一个表，会自动打开数据库   |
| put(key, value)             | String    | Object    |                     | 设置值，不存在插入，存在则更新 |
| get(key)                    | String    |           | Object \| null      | 获取值，不存在返回null         |
| remove(key)                 | String    |           |                     | 移除值                         |
| containsKey(key)            | String    |           | Boolean             | 表是否包含key                  |
| clear()                     |           |           |                     | 清空表                         |
| size()                      |           |           | Number              | 获取表的记录数                 |
| keys()                      |           |           | Array<String>       | 获取全部key，返回Array集合     |
| keySet()                    |           |           | Set<String>         | 获取全部key，返回Set集合       |
| values()                    |           |           | Array<Object>       | 获取全部value，返回Array集合   |
| map()                       |           |           | Map<String, Object> | 获取全部key-value，返回Map集合 |
| isEmpty()                   |           |           | Boolean             | 表是否为空                     |

# 其他API

其他与kvite有关的api，全部api均为异步，异常情况均抛出异常

| api             | 参数1类型 | 参数2类型 | 返回值类型 | 说明                                               |
| --------------- | --------- | --------- | ---------- | -------------------------------------------------- |
| openDb(dbName)  | String    |           |            | 打开数据库，打开后可以对数据库进行操作             |
| closeDb(dbName) | String    |           |            | 关闭数据库，关闭后会释放资源，对数据库的操作将失败 |

