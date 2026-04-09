This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

Hi,

I would be happy, if you can help me with this job that has on the word description on the file attached to the post.

I need a little web project for my assessment.

I prefer to do it on .net core, but if you want, you can do it also in nodejs.

Thank you :).

In this exercise we will implement a Library web application
The Library will connect to a DB, either Mongo or SqlExpress.
The database should be called Library.
Books will have an Id, a Title, an Author name and a Genre. (no need for type or count of books)
Subscribers will have an Id, a First name, a Last name and a list of all Books under loan – either the book id, or an entire Book object. A subscriber can loan up to 3 books.
The same book can be loaned as many times as we want.
If using Mongo, create two collections under the Library database.
If using SqlExpress, create two tables in the Library database.

The application should include at least 4 razor pages:
Home- will contain links or button to the other 3 pages
Manage Library- Add subscribers, Add Books
Loan/Return Books- by Id
Display Information – about a subscriber, about a book, about a genre

Use Forms for supplying the data. 
Use Tag handlers, Binding and routing where it is appropriate.
The DB should be registered as a service and its configuration should also be registered.
You don’t have to use asynchronous programming, but it is recommended.
Feel free to add behavior if you wish – delete book (but only if it is not on loan), delete subscriber, loan book by name..
Use CSS and html/js as much as you can


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
