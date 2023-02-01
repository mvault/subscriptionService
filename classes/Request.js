const db = require('../data/arango');

const collections = {
  Notification: 'notifications',
}

module.exports = class Request {
	constructor(data) {
    this._id = data._id;
    this._key = data._key;
	}

  async save() {
		return new Promise((resolve, reject) => {
      const coll = collections[this.constructor.name]
      const collection = db.collection(coll);
      const data = this;
      const d = new Date()
      data.created_at = d.toISOString()
      data.updated_at = d.toISOString()
      const doc = data
      collection.save(doc).then( meta => {
        return resolve(Object.assign(data, meta))
      }).catch(err => {
        return reject('Failed to save document:', err)
      })
		})
	}

	async get({filters, removed, sort, limit, select}) {
		return new Promise(async (resolve, reject) => {
      try {
        const collection = collections[this.constructor.name]
        let query = `FOR i IN ${collection} FILTER `
        if (filters && Object.keys(filters).length !== 0) {
          const filterKeys = Object.keys(filters)
          for (const f of filterKeys) {
            let operator = typeof filters[f] == "object" ? filters[f].operator : "=="
            let value = filters[f] = typeof filters[f] == "object" ? filters[f].value : filters[f]
            if (f == "_key" || f == "_id" || (typeof filters[f] == "string" && operator != "IN")) {
              query += `i.${f} ${operator} "${value}"`
            } else {
              query += `${value} ${operator} i.${f}`
            }
            if (filterKeys.indexOf(f) < filterKeys.length - 1) {
              query += ` && `
            }
          }
          query += ` && i.isremoved != true`
        } else {
          query += `i.isremoved != true`
        }
        if (sort) {
          query += ` SORT `
          for (let s = 0; s < sort.by.length; s++) {
            if(s == sort.by.length-1) {
              query += `i.${sort.by[s]} `
            } else {
              query += `i.${sort.by[s]}, `
            }
          }
          query += `${sort.method}`
        }
        if (limit) {
          query += ` LIMIT ${limit}`
        }
        if (select) {
          query += ` RETURN ${select}`
        } else {
          query += ` RETURN i`
        }
        await db.query(query).then((cursor) => {
          cursor.all()
            .then(vals => {
              return resolve(vals)
            }).catch(e => {
              return reject(e)
            })
        });
      } catch(e) {
        return reject(e.message)
      }
		})
	}

  async getOne({filters, removed, select}) {
		return new Promise(async (resolve, reject) => {
      const constructor = require(`../classes/${this.constructor.name}`);
      const req = new constructor({})
      req.get({filters: filters, removed: removed, select: select, collection:collections[this.constructor.name]}).then(data => {
        return resolve(data[0])
      }).catch(e => {
				return reject(e)
			})
		})
	}

	async update(filters, data) {
		return new Promise(async (resolve, reject) => {
      const coll = collections[this.constructor.name]
      const d = new Date()
      const data1 = JSON.stringify({...data, updated_at: d.toISOString()})
      try {
        let query = `FOR i IN ${coll} FILTER `
        const filterKeys = Object.keys(filters)
        for (const f of filterKeys) {
          let operator = typeof filters[f] == "object" ? filters[f].operator : "=="
          filters[f] = typeof filters[f] == "object" ? filters[f].value : filters[f]
          if (f == "_key" || f == "_id" || (typeof filters[f] == "string" && operator != "IN")) {
            query += `i.${f} ${operator} "${filters[f]}"`
          } else {
            query += `${filters[f]} ${operator} i.${f} `
          }
          if (filterKeys.indexOf(f) < filterKeys.length - 1) {
            query += ` && `
          }
        }
        query += filterKeys.length ? ` && i.isremoved != true` : ` i.isremoved != true`
        query += ` UPDATE i WITH ${data1} in ${coll} RETURN MERGE(i, ${data1})`
        await db.query(query).then((cursor) => {
          cursor.all()
            .then(vals => {
              return resolve(vals[0])
            }).catch(e => {
              return reject(e)
            })
        });
      } catch(e) {
        return reject(e.message)
      }
		})
	}

  async query(query) {
    return new Promise(async (resolve, reject) => {
      if (query) {
        await db.query(query).then((cursor) => {
          cursor.all()
            .then(vals => {
              return resolve(vals)
            }).catch(e => {
              return reject(e)
            })
        });
      } else {
        return reject('Query is required')
      }
    })
  }

  // You can only delete providing the _id; _key value
  // For exampe: object.delete(_id)
	async delete(id) {
		return new Promise(async (resolve, reject) => {
      const coll = collections[this.constructor.name]
      const collection = db.collection(coll);
      const d = new Date
      const data = { isremoved: true, updated_at: d.toISOString() }
      await collection.update(id, data).then(meta => {
        return resolve(Object.assign(data, meta))
      }).catch(e => {
        return reject('Failed to delete document:', e)
      })
    })
  }
}