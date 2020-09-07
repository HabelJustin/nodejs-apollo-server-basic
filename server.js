const { ApolloServer, gql } = require("apollo-server");

// Define Schema
const typeDefs = gql`
	type Book {
		name: String
		genre: String
		id: ID
		authorId: ID
	}

	type User {
		id: ID!
		username: String!
	}

	type Error {
		field: String!
		message: String!
	}

	type RegisterResponse {
		errors: [Error!]!
		user: User
	}

	input UserInfo {
		username: String!
		password: String!
		age: Int
	}

	type UsersResponse {
		id: ID!
		username: String!
		books: [Book]!
	}

	type Query {
		sayHi: String!
		user(id: ID): User
		book(id: ID!): Book
		books: [Book]
		users: [UsersResponse]
	}
	type Mutation {
		register(userInfo: UserInfo!): RegisterResponse!
		login(username: String!, password: String!): Boolean!
	}
`;

const books = [
	{ name: "Name of the Wind", genre: "Fantasy", id: "1", authorId: "1" },
	{ name: "The Final Empire", genre: "Fantasy", id: "2", authorId: "2" },
	{ name: "The Long Earth", genre: "Sci-Fi", id: "3", authorId: "3" },
	{ name: "The Hero of Ages", genre: "Fantasy", id: "4", authorId: "2" },
	{ name: "The Colour of Magic", genre: "Fantasy", id: "5", authorId: "3" },
	{ name: "The Light Fantastic", genre: "Fantasy", id: "6", authorId: "3" },
];

const authors = [
	{ username: "Patrick Rothfuss", id: "1" },
	{ username: "Brandon Sanderson", id: "2" },
	{ username: "Terry Pratchett", id: "3" },
];

// function resolvers
const resolvers = {
	UsersResponse: {
		// custom type resolver
		books: (parent) => {
			console.log("User resolve:", parent);
			return books.filter((book) => book.authorId == parent.id);
		},
	},
	Query: {
		books: (parent, args, context, info) => {
			return books;
		},
		book: (parent, args, context, info) => {
			console.log("book", { parent });
			console.log("book", { args });
			return {
				name: "rest",
				genre: "Fantasy",
			};
		},
		users: (parent, args, context, info) => {
			// console.log({ context });
			return authors;
		},
		sayHi: () => "Hi there!",
		user: (parent, args, context, info) => {
			console.log({ parent });
			console.log({ args });

			return {
				id: 1,
				username: "bob",
				books: [
					{
						name: "rest",
						genre: "Fantasy",
					},
				],
			};
		},
	},
	Mutation: {
		register: (parent, args, context, info) => {
			console.log("Mutation arguments:", { args });
			return {
				errors: [
					{
						field: "username",
						message: "invalid",
					},
				],
				user: {
					id: 1,
					username: "bob",
				},
			};
		},
	},
};

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: ({ req, res }) => ({ req, res }),
});

server.listen().then(({ url }) => console.log(`Server started at ${url}`));
