
# IRCAN-Account-Creation
IRCAN-Account-Creation is a web app to creat and to manage IRCAN accounts.

## Versions
![Node 8](https://img.shields.io/badge/node-8.9.x-green.svg)
![npm](https://img.shields.io/badge/npm-5.6.x-yellow.svg)
![express](https://img.shields.io/badge/express-4.16.x-orange.svg)
![VueJS 2](https://img.shields.io/badge/vuejs-2.5.x-brightgreen.svg)
![Webpack 3](https://img.shields.io/badge/webpack-3.11.x-blue.svg)
![Quasar](https://img.shields.io/badge/quasar-0.15.14-ff69b4.svg)

## Backend
- [node.js](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/)
- [nodemon](https://nodemon.io/)
- [express](https://expressjs.com/)
- [body-parser](https://github.com/expressjs/body-parser)
- [cors](https://github.com/expressjs/cors)
- [node-json-db](https://github.com/Belphemur/node-json-db)
- [nodemailer](https://nodemailer.com/about/)
- [ldap-client](https://github.com/jeremycx/node-LDAP)
- [serve-static](https://github.com/expressjs/serve-static)
- [connect-history-api-fallback](https://github.com/bripkens/connect-history-api-fallback)

## Frontend

- [vue.js](https://vuejs.org/)
- [quasar](http://quasar-framework.org/)
- [webpack](https://webpack.js.org/)
- [babel](https://babeljs.io/)
- [esllint](https://eslint.org/)
- [axios](https://github.com/axios)
- [vue-i18n](https://github.com/kazupon/vue-i18n)
- [vee-validate](https://github.com/baianat/vee-validate)
- [md5](https://github.com/pvorb/node-md5)

## Database

- [node-json-db](https://github.com/Belphemur/node-json-db)

## IDE

- [Visual Studio Code](https://code.visualstudio.com/)

> User settings:

```
{
  "editor.mouseWheelZoom": true,
  "editor.tabSize": 2,
  "editor.renderIndentGuides": true,
  "editor.rulers": [
    160
  ],
  "window.zoomLevel": 0,
  "editor.wordWrapColumn": 160,
  "editor.wordWrap": "wordWrapColumn",
  "editor.formatOnSave": true,
  "eslint.enable": true,
  "eslint.autoFixOnSave": true,
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "html",
    "vue"
  ],
  "vetur.format.defaultFormatter.html": "prettier",
  "prettier.semi": false,
  "prettier.singleQuote": true,
  "html.format.wrapLineLength": 160,
  "html.format.preserveNewLines": false,
  "workbench.iconTheme": "vscode-icons",
  "extensions.autoUpdate": true
}
```
 
> Extensions:

 ```
dbaeumer.vscode-eslint
octref.vetur
robertohuertasm.vscode-icons
```

# Usage

Make sure to have [node](https://nodejs.org/en/) installed.<br>
Open a console in project root folders and run:

```
$ npm install
```

## Start Server

To start serving server side files run the following command:

```
$ node server.js
```

### Build Client

To build the client side run the following command:

```
$ quasar build
```

### Deployment

To build the client side run the following command:

```
$ docker build -t paulbach/ircan-account-creation:latest .
$ docker run -d -ti -p 3000:80 paulbach/ircan-account-creation:latest

```

The application is available at: http://localhost:3000/