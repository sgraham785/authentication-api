import { bookshelf } from '../../middleware/database'

export default bookshelf.Model.extend(
  {
    tableName: 'auth',
    hasTimestamps: true
  })
