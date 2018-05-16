// Gets environment variables.
var config = require('./config')

// LDAP client functions.
module.exports = {
  /**
  * Opens the connexion to LDAP server.
  *
  * @param {Object} reslt - response send to client.
  */
  connexion: function (reslt) {
    const LDAP = require('ldap-client')

    var ldap = new LDAP({
      uri: config.LDAP_URL
    })

    ldap.bind({ binddn: config.LDAP_DN, password: config.LDAP_PWD }, function (err) {
      if (err) {
        console.log(err)
        reslt.json(String(err))
      } else {
        console.log('Connexion LDAP OK')
      }
    })
    return ldap
  },
  /**
  * Adds a new user in LDAP directory.
  *
  * @param {Object} req - request send by client.
  * @param {Object} reslt - response send to client.
  * @param {Object} db - Database in json file.
  */
  addUser: function (req, reslt, db) {
    const LDAP = require('ldap-client')
    var ldap = this.connexion(reslt)
    var mail = require('./mail')

    var searchOptions = { base: 'ou=people,dc=ircan,dc=fr', filter: '(objectClass=inetOrgPerson)', scope: LDAP.SUBTREE, attrs: 'uidNumber' }
    var max = 1999 // default uidNumber
    var v = this
    var changes = [
      {
        op: 'add',
        attr: 'member',
        vals: [`uid=${req.body.uid},ou=people,dc=ircan,dc=fr`]
      }
    ]
    // gets max uidNumber
    ldap.search(searchOptions, function (err, res) {
      if (err) {
        console.log(err)
        reslt.json(String(err))
      } else {
        for (let uidNumber in res) {
          if (max < res[uidNumber].uidNumber[0]) {
            max = res[uidNumber].uidNumber[0]
          }
        }
        let attr = v.paramAddUser(req, max)
        // adds a new user
        ldap.add(`uid=${req.body.uid},ou=people,dc=ircan,dc=fr`, attr, function (err) {
          if (err) {
            console.log(err)
            reslt.json(String(err))
          } else {
            ldap.modify(req.body.team.dn, changes, function (err) {
              if (err) {
                console.log(err)
                reslt.json(String(err))
              } else {
                mail.sendMailAccept(req, mail.connexion(), db, reslt)
              }
            })
          }
        })
      }
    })
  },
  /**
  * Build request parameters.
  *
  * @param {Object} req - request send by client.
  * @param {Number} max - the higher uidNumber.
  */
  paramAddUser: function (req, max) {
    var entry = [
      { attr: 'objectclass', vals: ['inetOrgPerson', 'posixAccount', 'top', 'date'] },
      { attr: 'cn', vals: [`${req.body.sn} ${req.body.givenName}`] },
      { attr: 'o', vals: [`${req.body.o}`] },
      { attr: 'gidNumber', vals: [req.body.team.gidNumber] },
      { attr: 'homeDirectory', vals: ['/home/LDAP/' + req.body.uid] },
      { attr: 'sn', vals: [`${req.body.sn}`] },
      { attr: 'mail', vals: [`${req.body.mail}`] },
      { attr: 'uid', vals: [`${req.body.uid}`] },
      { attr: 'uidNumber', vals: [Number(max) + 1] },
      { attr: 'givenName', vals: [`${req.body.givenName}`] },
      { attr: 'preferredLanguage', vals: [`${req.body.lang}`] },
      { attr: 'endDate', vals: [`${req.body.date}`] },
      { attr: 'loginShell', vals: ['/bin/bash'] },
      { attr: 'userPassword', vals: [`${req.body.pwd}`] }
    ]
    return entry
  },
  /**
  * Gets groups in LDAP directroy.
  *
  * @param {Object} req - request send by client.
  * @param {Number} reslt - response send to client.
  */
  getGroup: function (req, reslt) {
    const LDAP = require('ldap-client')
    var ldap = this.connexion(reslt)
    var searchOptions = { base: 'ou=group,dc=ircan,dc=fr', filter: '(objectClass=groupOfNames)', scope: LDAP.SUBTREE, attrs: ['description', 'cn', 'gidNumber'] }
    var groups = []
    ldap.search(searchOptions, function (err, res) {
      if (err) {
        console.log(err)
        reslt.json(String(err))
      } else {
        for (let group in res) {
          groups.push({ label: res[group].description[0], value: { cn: res[group].cn[0], description: res[group].description[0], gidNumber: res[group].gidNumber[0], dn: res[group].dn } })
        }
        reslt.json(groups)
      }
    })
  }
}
