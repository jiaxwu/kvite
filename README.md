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

