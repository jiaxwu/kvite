/**
 * Kvite
 */
export default class Kvite {
  /**
   * 数据库名
   */
  dbName;

  /**
   * 表名
   */
  tableName;

  /**
   * key的序列化器
   */
  keySerializer = Kvite.emptySerializer;

  /**
   * key的反序列化器
   */
  keyDeserializer = Kvite.emptyDeserializer;

  /**
   * value的序列化器
   */
  valueSerializer = Kvite.jsonSerializer;

  /**
   * value的反序列化器
   */
  valueDeserializer = Kvite.jsonDeserializer;

  /**
   * 空序列化器
   * @param {Object} o
   * @returns {Object}
   */
  static emptySerializer = (o) => o;

  /**
   * 空反序列化器
   * @param {Object} o
   * @returns {Object}
   */
  static emptyDeserializer = (o) => o;

  /**
   * JSON序列化器
   * @param {Object} o
   * @returns {String}
   */
  static jsonSerializer = (o) => JSON.stringify(o);

  /**
   * JSON反序列化器
   * @param {String} s
   * @returns {Object}
   */
  static jsonDeserializer = (s) => JSON.parse(s);

  /**
   * 创建Kvite实例
   * @param {String} dbName 数据库名
   * @param {String} tableName 表名
   * @throws {Error}
   */
  constructor(dbName, tableName) {
    if (!dbName) {
      throw new Error("数据库名不能为空");
    }
    if (!tableName) {
      throw new Error("表名不能为空");
    }
    this.dbName = dbName;
    this.tableName = tableName;
  }

  /**
   * 创建一个默认的Kvite
   *
   * @param {String} dbName 数据库名
   * @param {String} tableName 表名
   * @returns {Kvite} Kvite
   * @throws {Error}
   */
  static async buildDefaultKvite(dbName, tableName) {
    const kvite = new Kvite(dbName, tableName);
    await kvite.init();
    return kvite;
  }

  /**
   * 初始化Kvite
   * @throws {Error}
   */
  async init() {
    await this.openDb();
    return this.createTable();
  }

  /**
   * 设置值
   * @param {Objec} key 键
   * @param {Object} value 值
   * @throws {Error}
   */
  async put(key, value) {
    return this.executeSQL(
      `INSERT OR REPLACE INTO ${
        this.tableName
      } (key, value) VALUES (${this.keySerializer(
        key
      )}, '${this.valueSerializer(value)}')`
    );
  }

  /**
   * 获取值
   * @param {Object} key 键
   * @returns {Objec} 值，找不到返回null
   * @throws {Error}
   */
  async get(key) {
    const res = await this.selectSQL(
      `SELECT key, value FROM ${
        this.tableName
      } WHERE key = ${this.keySerializer(key)}`
    );
    return res.length > 0 ? this.valueDeserializer(res[0].value) : null;
  }

  /**
   * 移除值
   * @param {Object} key 键
   * @throws {Error}
   */
  async remove(key) {
    return this.executeSQL(
      `DELETE FROM ${this.tableName} WHERE key = ${this.keySerializer(key)}`
    );
  }

  /**
   * 是否包含key
   * @param {Object} key 键
   * @returns {Boolean} 是否包含key
   * @throws {Error}
   */
  async containsKey(key) {
    const res = await this.selectSQL(
      `SELECT key FROM ${this.tableName} WHERE key = ${this.keySerializer(key)}`
    );
    return res.length > 0;
  }

  /**
   * 清空表
   * @throws {Error}
   */
  async clear() {
    return this.executeSQL(`DELETE FROM ${this.tableName}`);
  }

  /**
   * 获取表的记录数
   * @returns {Number} 数量
   * @throws {Error}
   */
  async size() {
    const res = await this.selectSQL(
      `SELECT COUNT(*) AS size FROM ${this.tableName}`
    );
    return res[0].size;
  }

  /**
   * 获取全部key，返回Array集合
   * @returns {Array<Object>} keys
   * @throws {Error}
   */
  async keys() {
    const res = await this.selectSQL(`SELECT key FROM ${this.tableName}`);
    const keys = new Array(res.length);
    for (let i = 0; i < res.length; i++) {
      keys[i] = this.keyDeserializer(res[i].key);
    }
    return keys;
  }

  /**
   * 获取全部key，返回Set集合
   * @returns {Set<Object>} keySet
   * @throws {Error}
   */
  async keySet() {
    const res = await this.selectSQL(`SELECT key FROM ${this.tableName}`);
    const keySet = new Set();
    for (let i = 0; i < res.length; i++) {
      keySet.add(this.keyDeserializer(res[i].key));
    }
    return keySet;
  }

  /**
   * 获取全部value，返回Array集合
   * @returns {Array<Object>} values
   * @throws {Error}
   */
  async values() {
    const res = await this.selectSQL(`SELECT value FROM ${this.tableName}`);
    const values = new Array(res.length);
    for (let i = 0; i < res.length; i++) {
      values[i] = this.valueDeserializer(res[i].value);
    }
    return values;
  }

  /**
   * 获取全部key-value，返回Array集合
   * @returns {Array<Object>} entries
   * @throws {Error}
   */
  async entries() {
    const res = await this.selectSQL(
      `SELECT key, value FROM ${this.tableName}`
    );
    const entries = new Array(res.length);
    for (let i = 0; i < res.length; i++) {
      entries[i] = {
        key: this.keyDeserializer(res[i].key),
        value: this.valueDeserializer(res[i].value),
      };
    }
    return entries;
  }

  /**
   * 获取全部key-value，返回Map集合
   * @returns {Map<Object, Object>} map
   * @throws {Error}
   */
  async map() {
    const res = await this.selectSQL(
      `SELECT key, value FROM ${this.tableName}`
    );
    const map = new Map();
    for (let i = 0; i < res.length; i++) {
      map.set(
        this.keyDeserializer(res[i].key),
        this.valueDeserializer(res[i].value)
      );
    }
    return map;
  }

  /**
   * 表是否为空
   * @returns {Boolean} 是否为空
   * @throws {Error}
   */
  async isEmpty() {
    const res = await this.selectSQL(
      `SELECT key FROM ${this.tableName} LIMIT 1`
    );
    return res.length === 0;
  }

  /**
   * 打开数据库，打开后可以对数据库进行操作
   * @throws {Error}
   */
  async openDb() {
    if (this.isOpenDb()) {
      return;
    }
    return new Promise((resolve, reject) => {
      plus.sqlite.openDatabase({
        name: this.dbName,
        path: `_doc/${this.dbName}.db`,
        success(res) {
          resolve();
        },
        fail(e) {
          reject(e);
        },
      });
    });
  }

  /**
   * 关闭数据库，关闭后会释放资源，对数据库的操作将失败
   * @throws {Error}
   */
  async closeDb() {
    if (!this.isOpenDb()) {
      return;
    }
    return new Promise((resolve, reject) => {
      plus.sqlite.closeDatabase({
        name: this.dbName,
        success(res) {
          resolve();
        },
        fail(e) {
          reject(e);
        },
      });
    });
  }

  /**
   * 数据库是否打开
   * @returns {Boolean} 是否打开
   */
  isOpenDb() {
    return plus.sqlite.isOpenDatabase({
      name: this.dbName,
      path: `_doc/${this.dbName}.db`,
    });
  }

  /**
   * 创建表
   * @throws {Error}
   */
  async createTable() {
    return this.executeSQL(
      `CREATE TABLE IF NOT EXISTS ${this.tableName} ("key" TEXT PRIMARY KEY NOT NULL, "value" TEXT NOT NULL)`,
      false
    );
  }

  /**
   * 删除表
   * @throws {Error}
   */
  async removeTable() {
    return this.executeSQL(`DROP TABLE IF EXISTS ${this.tableName}`, false);
  }

  /**
   * 设置key序列化器
   * @param {Object => Object} 序列化器
   */
  setKeySerializer(serializer) {
    this.keySerializer = serializer;
  }

  /**
   * 设置key反序列化器
   * @param {Object => Object} 反序列化器
   */
  setKeyDeserializer(deserializer) {
    this.keyDeserializer = deserializer;
  }

  /**
   * 设置value序列化器
   * @param {Object => Object} 序列化器
   */
  setValueSerializer(serializer) {
    this.valueSerializer = serializer;
  }

  /**
   * 设置value反序列化器
   * @param {Object => Object} 反序列化器
   */
  setValueDeserializer(deserializer) {
    this.valueDeserializer = deserializer;
  }

  /**
   * 获取数据库名
   * @returns {String} 数据库名
   */
  getDbName() {
    return this.dbName;
  }

  /**
   * 获取表名
   * @returns {String} 表名
   */
  getTableName() {
    return this.tableName;
  }

  /**
   * 检查数据库是否正常
   * @throws {Error}
   */
  checkDb() {
    if (!this.isOpenDb()) {
      throw new Error("请先打开数据库");
    }
  }

  /**
   * 执行SQL的封装
   * @param {String} sql SQL
   */
  async executeSQL(sql) {
    this.checkDb();
    return new Promise((resolve, reject) => {
      plus.sqlite.executeSql({
        name: this.dbName,
        sql: sql,
        success(res) {
          resolve();
        },
        fail(e) {
          reject(e);
        },
      });
    });
  }

  /**
   * 查询SQL的封装
   * @param {String} sql SQL
   * @returns {Array<Object>} 执行结果
   */
  async selectSQL(sql) {
    this.checkDb();
    return new Promise((resolve, reject) => {
      plus.sqlite.selectSql({
        name: this.dbName,
        sql: sql,
        success(res) {
          resolve(res);
        },
        fail(e) {
          reject(e);
        },
      });
    });
  }
}
