import { authHandlers } from './auth'
import { productsHandlers } from './products'
import { commoditiesHandlers } from './commodities'
import { locationsHandlers } from './locations'
import { kupsHandlers } from './kups'
import { usersHandlers } from './users'
import { analyticsHandlers } from './analytics'
import { collaborationsHandlers } from './collaborations'
import { filesHandlers } from './files'

export const handlers = [
  ...authHandlers,
  ...productsHandlers,
  ...commoditiesHandlers,
  ...locationsHandlers,
  ...kupsHandlers,
  ...usersHandlers,
  ...analyticsHandlers,
  ...collaborationsHandlers,
  ...filesHandlers,
]
