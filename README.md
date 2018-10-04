# SEM2018_Group1

## Fantasy E-Sports Application

### About
This application is a project at UWF for a software engineering management class. This project's goal is to create a "fantasy football for esports." All development will be committed to this repository during the duration of the project. 
### Git Organization
For this project there is a specific flow in place for development. 
 * master: Release Candidate -- sprint releases
 * stable: Code that is stable, possible to release from, tested code
 * development: Code that needs integration testing, code that doesn't crash on its own
 * feature/<featurename>: Branch used if members need to work together on a feature?... perhaps this is like a topical developer branch
 * developer/<membername>: Member Specific Feature Branch -- personal work branch.
### Locations
#### public
This is our folder for "static routes" which would include any client side javascript or css files

#### tests
For now this will include any server side tests we wish to use. 

#### views
This is a handlebars folder, it contains "pseudo-html" that can use variables. Variables are identified like this:
```handlebars
{{variable}}
```

#### views/layouts
This is where the master template file is held, this is also in handlebars but looks more like the normal html page you are used to. The more you can incorporate in this file the better to improve the flow and continuity between pages in the site. Treat this like normal html (or anything else you'd use with a .html extension) and then add 
```handlebars
{{{body}}}
```
in order to add the views to this template. this would look something like this:
##### main.handlebars (/views/layouts/main.handlebars)
```handlebars
<!doctype html>
<head>
</head>
<body>
{{{body}}}
</body>
```
##### view.handlebars (/views/view.handlebars)
```handlebars
<h1>This is a demo</h1>
<p>You are logged in as {{user}}</p>
```

### Installation
* To install this, (for development), clone or download this to your computer and open a terminal in that folder (for unix based systems -- windows instructions pending)

* Install npm and nodejs

* Type into the terminal: 
```sh
npm install
```

* When it finishes, type this to run:
```sh
npm start
```

