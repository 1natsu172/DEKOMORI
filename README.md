# DEKOMORI

![](build/src/assets/images/siteImage/dekomori-keyVisual@2x.png)

## What is this?

### DEKOMORI is handcrafted static web-page kit.

##### So-called my([@1natsu172](https://github.com/1natsu172)'s) static web-page boilerplate.

The good minimum settings for handcrafted static web pages has been almost completed, and stable ES.next is also supported. ≒ **Chaos.**

DEKOMORI is big and heavy structure, but doesn't include generic components and HTML frameworks (like Bootstrap, Foundation) .

[https://1natsu172.github.io/DEKOMORI/](https://1natsu172.github.io/DEKOMORI/)

## Getting Started

##### Requires

* Node.js
* version `>=7.4.0`
* npm(yarn supported)
* Git

***

### ☄️ If you have already a netlify account.

#### 1. Click button and setup Netlify site.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/1natsu172/DEKOMORI)

DEKOMORI based repository is automatically created for your git service.

> With this method, Git service and Netlify are automatically integrated and deployed automatically every `git push`.
If you don't want to deploy, manually cancel the integration of Netlify or do "🚀 Another way" below.

#### 2. Clone to your local.

```
$ git clone <your-repository-url>
$ cd <your-repository-name>
$ npm install
```

#### 3. Start development

```
$ npm run dev
```

#### 4. 🙆

> SVG sprite preview is displayed on the googleChrome tab, then the local server will start up.

##### [Let's setup web site settings and ready go!](#-lets-setup-web-site-settings-and-ready-go)


***

### 🚀 Another way

#### 1. Get DEKOMORI

```
$ git clone https://github.com/1natsu172/DEKOMORI.git trial-DEKOMORI
$ cd trial-DEKOMORI
$ npm install
```

#### 2. Start development

```
$ npm run dev
```

#### 3. 🙆

> SVG sprite preview is displayed on the googleChrome tab, then the local server will start up.

##### [Let's setup web site settings and ready go!](#-lets-setup-web-site-settings-and-ready-go)




#### We recommend that you do the next steps (if you plan to deploy)

##### 1. Create a new remote repository with your git service

> Supported services by netlify (GitHub, GitLab, Bitbucket, …)

##### 2. Change git remote-url

```
$ git remote set-url origin <created-repository-URL>
```

##### 3. 👌

***

#### 🔧 Let's setup web site settings and ready go!

* 1st step: Let's setup pug's `_siteSetting.pug`.

> `./build/src/pug/_inc/settings/_siteSetting.pug`

* 2nd step: Let's setup pug's `block pageSummary` for each page.

> Example: `./build/src/pug/index.pug`



## Good luck, handcrafted static web-page 💁


### [More documents here.](https://1natsu172.gitbooks.io/dekomori/content/)


***

## Author

1natsu

GitHub: https://github.com/1natsu172  
Twitter: [@1natsu172](https://twitter.com/1natsu172)
