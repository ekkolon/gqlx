export default `
query blogQuery($authorId: ID, $postCategory: CategoryEnum = TECH) {
    post(id: "1") {
      id
      title
      content
      published
      author {
        id
        name
        email
      }
      category
      comments {
        id
        content
        author {
          name
        }
        createdAt
      }
    }
  
    posts(filter: { category: $postCategory, authorId: $authorId, published: true }) {
      id
      title
      published
    }
  
    user(id: "123") {
      id
      name
      bio
    }
  }
  
  mutation createComment {
    addComment(content: "Great post!", postId: "1") {
      id
      content
      author {
        id
        name
      }
    }
  }
  
  subscription newComments {
    commentAdded(postId: "1") {
      id
      content
      author {
        id
        name
      }
      createdAt
    }
  }
  
  fragment authorDetails on User {
    id
    name
    bio
  }
`;
