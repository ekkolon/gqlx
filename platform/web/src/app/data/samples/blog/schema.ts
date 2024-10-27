import {
  DirectiveLocation,
  GraphQLBoolean,
  GraphQLDirective,
  GraphQLEnumType,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLInterfaceType,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

/** Category Enum */
export const CategoryEnum = new GraphQLEnumType({
  name: 'CategoryEnum',
  values: {
    TECH: {},
    LIFESTYLE: {},
    TRAVEL: {},
    FOOD: {},
  },
});

/** User Type */
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    bio: { type: GraphQLString },
  }),
});

/** Post Interface */
const PostInterface = new GraphQLInterfaceType({
  name: 'PostInterface',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    published: { type: GraphQLBoolean },
    author: { type: UserType },
  }),
  resolveType: (() => PostType as never) as never,
});

/** Post Type */
const PostType = new GraphQLObjectType({
  name: 'Post',
  interfaces: [PostInterface],
  fields: (() => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    published: { type: GraphQLBoolean },
    author: { type: UserType },
    category: { type: CategoryEnum },
    comments: { type: new GraphQLList(CommentType) },
  })) as never,
});

/** Comment Type */
const CommentType = new GraphQLObjectType({
  name: 'Comment',
  fields: () => ({
    id: { type: GraphQLID },
    content: { type: GraphQLString },
    author: { type: UserType },
    post: { type: PostType },
    createdAt: { type: GraphQLString },
  }),
});

/** Post Filter Input */
const PostFilterInput = new GraphQLInputObjectType({
  name: 'PostFilterInput',
  fields: {
    category: { type: CategoryEnum },
    published: { type: GraphQLBoolean },
    authorId: { type: GraphQLID },
  },
});

/** Query Type */
const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    post: {
      type: PostType,
      args: { id: { type: GraphQLID } },
      resolve: () => ({}), // Implementation goes here
    },
    posts: {
      type: new GraphQLList(PostType),
      args: { filter: { type: PostFilterInput } },
      resolve: () => ({}), // Implementation goes here
    },
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve: () => ({}), // Implementation goes here
    },
  }),
});

/** Custom Directive */
const IsAuthenticatedDirective = new GraphQLDirective({
  name: 'isAuthenticated',
  locations: [DirectiveLocation.FIELD_DEFINITION, DirectiveLocation.OBJECT],
});

/** BlogSchema */
export const BlogSchema = new GraphQLSchema({
  query: QueryType,
  types: [PostType, CommentType, UserType],
  directives: [IsAuthenticatedDirective],
});
