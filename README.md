# node-stream-utils

## Example
Contrived example just to show most of the utility functions.

Job to add a large list of users avaliable in a `csv` file.

Steps:
- stream file content
- parse csv lines into objects
- convert the csv line objects into user domain objects
- disregard the users with invalid email
- create batches of 100
- insert the batches

```js
const fs = require('fs')
const { pipeline } = require('stream/promises')

const { parse: parseCSV } = require('csv-parse')

const { 
  batch,
  map,
  filter,
  tap,
  eachP,
} = require('node-stream-utils')


const csvRecordToUser = (record) => {
  //... return a User domain object
}

const hasValidEmail = (user) =>
  /[A-Z0-9._%+-]+@[A-Z0-9.-]{1}\.[A-Z]{2,4}/i.test(user.email)

const debugUser = user =>
  console.log(`will insert user ${user.email}`)

const bulkAddToDabase = async (users) => {
  // ... performs query to add list of users in a single operation
}

console.log('Starting user insert job')

pipeline(
  fs.createReadStream('large_list_of_users.csv'),
  parseCSV({ columns: true, skipEmptyLines: true }),
  map(csvRecordToUser),
  filter(hasValidEmail), // equivalent to `reject(user => !hasValidEmail(user))`
  tap(debugUser),
  batch(100),
  eachP(bulkAddToDabase)
)
  .then(() => console.log('User insert job finished with success!'))
  .catch((error) => console.error(error, 'User insert job failed'))

```
