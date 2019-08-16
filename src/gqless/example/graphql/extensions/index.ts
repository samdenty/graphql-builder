import { GET_KEY, INDEX } from 'gqless'

// export const String = (value: string) => {
//   return `string_${value}`
// }

export const User /*: Extension<g.User>*/ = user => {
  return {
    testFn() {},
    name: (name: string) => `user_${name}`,
    // get name() {
    //   return `user_${name}`
    // },
    // set name(name) {
    //   mutation.renameUser(user.id, name)
    // },
    isAUser: true as const,
    following: {
      isFollowing: true,
    },

    [GET_KEY]: data => data.id,
  }
}
export const Query /*: Extension<g.User>*/ = query => {
  return {
    whatIsMyName() {
      return query.me.name
    },
    users: {
      get(id: string) {},
      [INDEX]: {
        isAQueryUser: true,
      },
    },
    getUser: {
      queryGetUsers: true as const,
    },
    me: {
      name: (name: string) => `me_${name}`,
      isMe: true,
      following: {
        isMeFollowing: true,
        doesIt: {
          work: true,
        },
        [INDEX]: {
          meIsFollowing: true,
        },
      },
    },
    isQuery: true,
  }
}
