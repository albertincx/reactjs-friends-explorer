import friends from '../friends'

function findById (id) {
  return friends.find(o => o.id === parseInt(id))
}

function findWord (word, str) {
  return word ? (new RegExp(word, 'ig')).test(str) : ''
}

const LIMIT = 30
module.exports = function (app) {

  app.get('/search', (req, res) => {

    let items = []
    let friendsIds = []

    const {text, company, gender} = req.query
    let {age_from, age_to, skip} = req.query

    age_from = parseInt(age_from)
    age_to = parseInt(age_to)
    skip = parseInt(skip)

    if (req.query.age_from && isNaN(age_from)) age_from = 999
    if (req.query.age_to && isNaN(age_to)) age_to = 0

    if (req.query.user) {
      const user = findById(req.query.user)
      if (user.friends) friendsIds = user.friends
    }

    let found = 0
    for (let i = 0; i < friends.length; i++) {

      //offset or friendsList search
      if (req.query.user && friendsIds.indexOf(friends[i].id) === -1) {
        continue
      }

      const item = friends[i]

      if (items.length >= LIMIT) {
        break
      }
      //check query
      if (
        (!text || findWord(text, `${item.name}`))
        && (!company || findWord(company, `${item.company}`))
        && (!age_from || age_from <= item.age)
        && (!age_to || age_to >= item.age)
        && (!gender || gender === item.gender)
      ) {
        found++
        if (skip && found < skip) {
          continue
        }
        items.push(item)
      }
    }

    res.send(items)
  })

  app.get('/search/:id', (req, res) => {

    let user = findById(req.params.id)

    if (user) {
      res.send(user)
    } else {
      res.sendStatus(404)
    }
  })
}