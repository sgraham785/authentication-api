import { bookshelf } from '../middleware/database'
import ModelBase from 'bookshelf-modelbase'

export const Auth = ModelBase(bookshelf).extend(
  {
    tableName: 'auth',
    idAttribute: 'uuid',
    hasTimestamps: true,
    uuid: () => {
      return this.hasOne(Info)
    }
  })

export const Info = ModelBase(bookshelf).extend(
  {
    tableName: 'info',
    hasTimestamps: true,
    uuid: () => {
      return this.belongsTo(Auth)
    }
  })

export const Profiles = bookshelf.Collection.extend({
  model: Info,
  orderBy (column, order) {
    return this.query(qb => {
      qb.orderBy(column, order)
    })
  }
})
