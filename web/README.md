# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### Deployment

Setup a remote called `pages` with 

```bash
git add remote pages git@github.com:kevinnowland/kevinnowland.github.io.git
```

then run

```bash
npm run deploy
```

This will deploy a version for github pages to that repo on the
`gh-pages` branch. This can be selected as the deployed branch
by going to `Settings > Pages` and choosing the branch.

Will apparently always need to update dns on that same settings page
to point to `kevinnowland.com`
