# kvite

一个基于uni-app plus.sqlite 的kv数据库，支持增删查改，多数据库，多表，自定义序列化器，反序列化器等



# 快速开始

### Step 1 引入文件

拷贝[kvite.js](https://github.com/XiaoHuaShiFu/kvite/blob/main/kvite.js)到目录下，并导入

```javascript
import Kvite from './kvite'
```

### Step 2 创建表

第一个参数是数据库名，第二个参数是表名

```javascript
const userTable = await Kvite.buildDefaultKvite('testDb', 'user')
```

### Step 3 增删查改

#### put：添加或修改数据

注：key默认不处理，会被转换成字符串类型，value默认使用JSON序列化器

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

# API

API都在Kvite类上，一个Kvite代表一个数据库的一个表

| api                                               | 参数1类型        | 参数2类型 | 返回值类型          | 说明                             |
| ------------------------------------------------- | ---------------- | --------- | ------------------- | -------------------------------- |
| static async buildDefaultKvite(dbName, tableName) | String           | String    | Kvite               | 创建一个Kvite，会自动初始化      |
| async put(key, value)                             | Object           | Object    |                     | 设置值，不存在插入，存在则更新   |
| async get(key)                                    | Object           |           | Object              | 获取值，不存在返回null           |
| async remove(key)                                 | Object           |           |                     | 移除值                           |
| async containsKey(key)                            | Object           |           | Boolean             | 表是否包含key                    |
| async clear()                                     |                  |           |                     | 清空表                           |
| async size()                                      |                  |           | Number              | 获取表的记录数                   |
| async keys()                                      |                  |           | Array<Object>       | 获取全部key，返回Array集合       |
| async keySet()                                    |                  |           | Set<Object>         | 获取全部key，返回Set集合         |
| async values()                                    |                  |           | Array<Object>       | 获取全部value，返回Array集合     |
| async entries()                                   |                  |           | Array<Object>       | 获取全部key-value，返回Array集合 |
| async map()                                       |                  |           | Map<Object, Object> | 获取全部key-value，返回Map集合   |
| async isEmpty()                                   |                  |           | Boolean             | 表是否为空                       |
| setKeySerializer(serializer)                      | Object => Object |           |                     | 设置key序列化器                  |
| setKeyDeserializer(deserializer)                  | Object => Object |           |                     | 设置key反序列化器                |
| setValueSerializer(serializer)                    | Object => Object |           |                     | 设置value序列化器                |
| setValueDeserializer(deserializer)                | Object => Object |           |                     | 设置value反序列化器              |
| getDbName()                                       |                  |           | String              | 获取数据库名                     |
| getTableName()                                    |                  |           | String              | 获取表名                         |

其他API，同样在Kvite上，用于实现上面的API，有风险，若使用请谨慎

| api                            | 参数1类型 | 参数2类型 | 返回值类型    | 说明                                               |
| ------------------------------ | --------- | --------- | ------------- | -------------------------------------------------- |
| constructor(dbName, tableName) | String    | String    | Kvite         | 构造器，构造一个Kvite，需要自行初始化              |
| async init()                   |           |           |               | 初始化（通过new Kvite()创建实例时需要调用）        |
| async openDb()                 |           |           |               | 打开数据库，打开后可以对数据库进行操作             |
| async closeDb()                |           |           |               | 关闭数据库，关闭后会释放资源，对数据库的操作将失败 |
| isOpenDb()                     |           |           | Boolean       | 数据库是否打开                                     |
| async createTable()            |           |           |               | 创建表                                             |
| async removeTable()            |           |           |               | 删除表                                             |
| checkDb()                      |           |           |               | 检查数据库是否正常                                 |
| async executeSQL(sql)          | String    |           |               | 执行SQL的封装                                      |
| async selectSQL(sql)           | String    |           | Array<Object> | 查询SQL的封装                                      |
