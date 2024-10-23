import { GraphQLHTTP } from 'jsr:@deno-libs/gql@3.0.1/'
import { makeExecutableSchema } from 'npm:@graphql-tools/schema@10.0.3'
import { gql } from 'https://deno.land/x/graphql_tag@0.1.2/mod.ts'

const typeDefs = gql`
  type Query {
    hello: String
    user: User
  }

  type User {
    id: ID!
    name: String
  }
`

const resolvers = {
  Query: {
    hello: () => 'Hello World',
    user: () => ({
      id: 123,
      name: 'vlad'
    })
  }
}

const schema = makeExecutableSchema({ typeDefs, resolvers })

const handler = async (req: Request) => {
  const { pathname } = new URL(req.url)
  return pathname === '/graphql'
    ? await GraphQLHTTP<Request>({
      schema,
      graphiql: true,
    })(req)
    : new Response('Please go to /graphql to query the server', { status: 200 })
}

Deno.serve({
  port: 3000,
  onListen({ hostname, port }) {
    console.info(`Server started on host: http://${hostname}:${port}`);
  }
}, handler);
