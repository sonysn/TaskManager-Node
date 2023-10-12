# Task Manager

Task Manager Project Written in NodeJS by Stephen.  

## Installation

- Clone the repository and Move to the root directory

- Node Version v16.16.0

- Install dependencies

```bash
npm install
```

- Run tests

```bash
npm test
```

- Build the project

```bash
npm run build
```

- Start the Server

```bash
npm start
```

## Dependencies

- [Express](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com/)
- [Morgan](https://www.npmjs.com/package/morgan)
- [Redis](https://www.npmjs.com/package/redis)
- [Node-Cron](https://www.npmjs.com/package/node-cron)
- [Jest](https://jestjs.io/)
- [dotenv](https://www.npmjs.com/package/dotenv)

## Usage

- List all tasks using `GET /list`
- Retrieve a task by id using `GET /tasks?taskID=`

```js
const { taskID } = req.query; //query parameter
```

- Create a new task using `POST /create`

```js
const { title, description, due_date } = req.body;
```

Example request body:

```json
{
    "title": "{{$randomCatchPhrase}}",
    "description": "{{$randomPhrase}}",
    "due_date": "2023-11-11T15:04:05Z"
}
```

- Update a task using `PUT /update?id=`

```js
const { id } = req.query; //query parameter
const { title, description, due_date, completed } = req.body;
```

Example request body:

```json
{
    "title": "Multi-channelled mobile superstructure",
    "description": "{{$randomPhrase}}",
    "due_date": "2023-11-11T15:04:05Z",
    "completed": "true"
}
```

- Delete a task using `DELETE /delete?id=`

```js
const { id } = req.query; //query parameter
```

Thanks for reading!  
