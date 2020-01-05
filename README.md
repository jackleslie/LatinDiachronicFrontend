# Latin Diachronic Frontend

[![Netlify Status](https://api.netlify.com/api/v1/badges/5d6be334-38cd-44f5-b5cb-915105d3d787/deploy-status)](https://app.netlify.com/sites/latin/deploys)

The Latin Diachronic Database is a project of Digital Humanities invented by Tommaso Spinelli (Ph.D. candidate, Classics, St. Andrews University) and co-developed with Giacomo Fenzi (Computer Science and Mathematics student, St. Andrews University). This project aims to create an innovative toolkit for the quantitative computational analysis of the Latin language as well as to support and further enhance the digital study of ancient intertextuality.

For more information on the toolkit view the [original repository](https://github.com/WizardOfMenlo/LatinDiachronicDatabase).

This project is an intuitive and easy to use front-end for the toolkit, developed by **Jack Leslie** in conjunction with the original authors **Tommaso Spinelli** and **Giacomo Fenzi**.

## Using the live web application

Currently the latest build of the `master` branch is deployed via [Netlify](https://www.netlify.com) and is available at the link [latin.netlify.com](https://latin.netlify.com). You can also run and develop it locally by cloning this repository and starting a development server.

## Developing locally

Ensure you have [Node](https://nodejs.org) and [Yarn](https://yarnpkg.com) installed. To run the development server fun the following commands:

```
# This command will install dependencies
yarn

# This command will run the development server
yarn start
```

## Using Docker

You can use the web app in conjunction with the database using Docker, provided you have the database
files necessary in a top level folder called `data/`. You'll also need Docker Compose installed. To
use both the web app and the database, run the following command:

```
docker-compose up
```

To rebuild the frontend without restarting the database, run:

```
docker-compose build latin-diachronic-frontend
docker-compose up -d
```

## Authors

- **Jack Leslie** - _Developer_ - [jackleslie](https://github.com/jackleslie)
- **Giacomo Fenzi** - _Developer_ - [WizardOfMenlo](https://github.com/WizardOfMenlo)
- **Tommaso Spinelli** - _Inventor/Latinist_ - [tommasospinelli](https://github.com/tommasospinelli)
