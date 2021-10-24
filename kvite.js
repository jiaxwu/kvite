/**
 * 打开数据库，打开后可以对数据库进行操作
 * @param {String} dbName 数据库名
 * @throws {Error}
 */
 export const openDb = async (dbName) => {
    await new Promise((resolve, _) => {
        plus.sqlite.openDatabase({
            name: dbName,
            path: `_doc/${dbName}.db`,
            success(_) {
                resolve()
            },
            fail(e) {
                throw new Error(e)
            }
        })
    })
}

/**
 * 关闭数据库，关闭后会释放资源，对数据库的操作将失败
 * @param {String} dbName 数据库名
 * @throws {Error}
 */
export const closeDb = async (dbName) => {
    await new Promise((resolve, _) => {
        plus.sqlite.closeDatabase({
            name: dbName,
            success(_) {
                resolve()
            },
            fail(e) {
                throw new Error(e)
            }
        })
    })
}

/**
 * 判断数据库是否打开
 * @param {String} dbName 数据库名
 * @returns {Boolean} 是否打开
 */
const isOpenDb = (dbName) => {
    return plus.sqlite.isOpenDatabase({
        name: dbName,
        path: `_doc/${dbName}.db`
    })
}

/**
 * 创建表
 * @param {String} dbName 数据库名
 * @param {String} tableName 表名
 * @throws {Error}
 */
const createTable = async (dbName, tableName) => {
    // 先保证数据库打开
    if (!isOpenDb(dbName)) {
        await openDb(dbName)
    }

    // 创建表
    return new Promise((resolve, _) => {
        plus.sqlite.executeSql({
            name: dbName,
            sql: `CREATE TABLE IF NOT EXISTS ${tableName} ("key" TEXT PRIMARY KEY NOT NULL, "value" TEXT NOT NULL)`,
            success(_) {
                resolve()
            },
            fail(e) {
                throw new Error(e)
            }
        })
    })
}

/**
 * Kvite
 */
export class Kvite {
    /**
     * 数据库名
     */
    dbName

    /**
     * 表名
     */
    tableName

    constructor(dbName, tableName) {
        this.dbName = dbName
        this.tableName = tableName
    }

    /**
     * 创建一个Kvite
     *
     * @param {String} dbName 数据库名
     * @param {String} tableName 表名
     * @returns {Kvite}
     * @throws {Error}
     */
    static async NewKvite(dbName, tableName) {
        const kvite = new Kvite(dbName, tableName)
        await createTable(dbName, tableName)
        return kvite
    }

    /**
     * 设置值
     * @param {String} key 键
     * @param {Object} value 值
     * @throws {Error}
     */
    async put(key, value) {
        await new Promise((resolve, _) => {
            plus.sqlite.executeSql({
                name: this.dbName,
                sql: `INSERT OR REPLACE INTO ${
                    this.tableName
                } (key, value) VALUES('${key}', '${JSON.stringify(value)}')`,
                success(_) {
                    resolve()
                },
                fail(e) {
                    throw new Error(e)
                }
            })
        })
    }

    /**
     * 获取值
     * @param {String} key 键
     * @returns {Object | null} 值，找不到返回null
     * @throws {Error}
     */
    async get(key) {
        const res = await new Promise((resolve, _) => {
            plus.sqlite.selectSql({
                name: this.dbName,
                sql: `SELECT key, value FROM ${this.tableName} WHERE key = '${key}'`,
                success(res) {
                    resolve(res)
                },
                fail(e) {
                    throw new Error(e)
                }
            })
        })
        return res.length > 0 ? JSON.parse(res[0].value) : null
    }

    /**
     * 移除值
     * @param {String} key  键
     * @throws {Error}
     */
    async remove(key) {
        await new Promise((resolve, _) => {
            plus.sqlite.executeSql({
                name: this.dbName,
                sql: `DELETE FROM ${this.tableName} WHERE key = '${key}'`,
                success(_) {
                    resolve()
                },
                fail(e) {
                    throw new Error(e)
                }
            })
        })
    }

    /**
     * 是否包含key
     * @param {String} key 键
     * @returns {Boolean} 是否包含key
     * @throws {Error}
     */
    async containsKey(key) {
        const res = await new Promise((resolve, _) => {
            plus.sqlite.selectSql({
                name: this.dbName,
                sql: `SELECT key FROM ${this.tableName} WHERE key = '${key}'`,
                success(res) {
                    resolve(res)
                },
                fail(e) {
                    throw new Error(e)
                }
            })
        })
        return res.length > 0
    }

    /**
     * 清空表
     * @throws {Error}
     */
    async clear() {
        await new Promise((resolve, _) => {
            plus.sqlite.executeSql({
                name: this.dbName,
                sql: `DELETE FROM ${this.tableName}`,
                success(_) {
                    resolve()
                },
                fail(e) {
                    throw new Error(e)
                }
            })
        })
    }

    /**
     * 获取表的记录数
     * @returns {Number} 数量
     * @throws {Error}
     */
    async size() {
        const res = await new Promise((resolve, _) => {
            plus.sqlite.selectSql({
                name: this.dbName,
                sql: `SELECT COUNT(*) AS size FROM ${this.tableName}`,
                success(res) {
                    resolve(res)
                },
                fail(e) {
                    throw new Error(e)
                }
            })
        })
        return res[0].size
    }

    /**
     * 获取全部key，返回Array集合
     * @returns {Array<String>} keys
     * @throws {Error}
     */
    async keys() {
        const res = await new Promise((resolve, _) => {
            plus.sqlite.selectSql({
                name: this.dbName,
                sql: `SELECT key FROM ${this.tableName}`,
                success(res) {
                    resolve(res)
                },
                fail(e) {
                    throw new Error(e)
                }
            })
        })
        const keys = new Array(res.length)
        for (let i = 0; i < res.length; i++) {
            keys[i] = res[i].key
        }
        return keys
    }

    /**
     * 获取全部key，返回Set集合
     * @returns {Set<String>} keySet
     * @throws {Error}
     */
    async keySet() {
        const res = await new Promise((resolve, _) => {
            plus.sqlite.selectSql({
                name: this.dbName,
                sql: `SELECT key FROM ${this.tableName}`,
                success(res) {
                    resolve(res)
                },
                fail(e) {
                    throw new Error(e)
                }
            })
        })
        const keySet = new Set()
        for (let i = 0; i < res.length; i++) {
            keySet.add(res[i].key)
        }
        return keySet
    }

    /**
     * 获取全部value，返回Array集合
     * @returns {Array<Object>} values
     * @throws {Error}
     */
    async values() {
        const res = await new Promise((resolve, _) => {
            plus.sqlite.selectSql({
                name: this.dbName,
                sql: `SELECT value FROM ${this.tableName}`,
                success(res) {
                    resolve(res)
                },
                fail(e) {
                    throw new Error(e)
                }
            })
        })
        const values = new Array(res.length)
        for (let i = 0; i < res.length; i++) {
            values[i] = JSON.parse(res[i].value)
        }
        return values
    }

    /**
     * 获取全部key-value，返回Map集合
     * @returns {Map<String, Object>} map
     * @throws {Error}
     */
    async map() {
        const res = await new Promise((resolve, _) => {
            plus.sqlite.selectSql({
                name: this.dbName,
                sql: `SELECT key, value FROM ${this.tableName}`,
                success(res) {
                    resolve(res)
                },
                fail(e) {
                    throw new Error(e)
                }
            })
        })
        const map = new Map()
        for (let i = 0; i < res.length; i++) {
            map.set(res[i].key, JSON.parse(res[i].value))
        }
        return map
    }

    /**
     * 表是否为空
     * @returns {Boolean} 是否为空
     * @throws {Error}
     */
    async isEmpty() {
        const res = await new Promise((resolve, _) => {
            plus.sqlite.selectSql({
                name: this.dbName,
                sql: `SELECT key FROM ${this.tableName} LIMIT 1`,
                success(res) {
                    resolve(res)
                },
                fail(e) {
                    throw new Error(e)
                }
            })
        })
        return res.length === 0
    }
}
