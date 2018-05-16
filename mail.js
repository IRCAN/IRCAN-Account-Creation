var config = require('./config')

module.exports = {
  /**
   * Opens the connexion to gmail.
   */
  connexion: function () {
    const nodemailer = require('nodemailer')
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'service.ircan@gmail.com',
        pass: config.MAIL_PWD
      }
    })
    return transporter
  },
  /**
  * Sends a email of acceptance.
  *
  * @param {Object} req - request send by client.
  * @param {Object} transporter - mail account.
  * @param {Object} db - Database in json file.
  * @param {Object} reslt - response send to client.
  */
  sendMailAccept: function (req, transporter, db, reslt) {
    let contentMailEn = `<p>Your ${req.body.o} has access to <a href="${config.LEMONLDAP}">the IRCAN intranet</a>.</p>
    <p>You also have access to IRCAN's <a href="${config.NEXTCLOUD}/index.php/login">private cloud (Nextcloud)</a></p>
    <p>Personal information of your Nextcloud account:</p>
    <ul>
      <li>login: ${req.body.uid}</li>
      <li>Password: ${req.body.pwd}</li>
    </ul>
    <p>Reminder: the nextcloud password is managed on the page <a href="${config.NEXTCLOUD}/index.php/settings/user">nextcloud parameters</a></p>`

    let contentMailFr = `<p>Votre compte ${req.body.o} a accès à <a href="${config.LEMONLDAP}">l'intranet de l'IRCAN</a>.</p>
    <p>Vous avez également accès au <a href="${config.NEXTCLOUD}/index.php/login">cloud privé de l'IRCAN (Nextcloud)</a></p>
    <p>Informations personnelles de votre compte Nextcloud :</p>
    <ul>
      <li>Identifiant : ${req.body.uid}</li>
      <li>Mot de passe : ${req.body.pwd}</li>
    </ul>
    <p>Rappel : la gestion du mot de passe du compte nextcloud s'effectue sur la page <a href="${config.NEXTCLOUD}/index.php/settings/user">paramétres de nextcloud</a></p>`

    let contentMail = contentMailEn // default

    let subjectEn = 'IRCAN account creation request'
    let subjectFr = 'Demande de compte IRCAN acceptée'

    let subject = subjectEn // default

    if (req.body.lang === 'fr') {
      contentMail = contentMailFr
      subject = subjectFr
    } else if (req.body.lang === 'en') {
      contentMail = contentMailEn
      subject = subjectEn
    }

    let mailOptions = {
      from: 'service.ircan@gmail.com',
      to: req.body.mail,
      subject: subject,
      html: contentMail
    }
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error)
        reslt.json(String(error))
      } else {
        console.log('Email sent: ' + info.response)
        db.delete('/users/' + req.body.uid) // deletes this user to the DB
        reslt.json(db.getData('/users'))
      }
    })
  },
  /**
  * Sends a email of refusal.
  *
  * @param {Object} req - request send by client.
  * @param {Object} transporter - mail account.
  * @param {Object} db - Database in json file.
  * @param {Object} reslt - response send to client.
  */
  sendMailRefuse: function (req, transporter, db, reslt) {
    let contentMailEn = `<p>Your request for access to the IRCAN intranet has been refused.</p>`

    let contentMailFr = `<p>Votre demande d'accès à l'intranet de l'IRCAN a été refusée.</p>`

    let contentMail = contentMailEn // default

    let subjectEn = 'IRCAN account creation refuse'
    let subjectFr = 'Demande de compte IRCAN refusée'

    let subject = subjectEn // default

    if (req.body.lang === 'fr') {
      contentMail = contentMailFr
      subject = subjectFr
    } else if (req.body.lang === 'en') {
      contentMail = contentMailEn
      subject = subjectEn
    }

    let mailOptions = {
      from: 'service.ircan@gmail.com',
      to: req.body.mail,
      subject: subject,
      html: contentMail
    }
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error)
        reslt.json(String(error))
      } else {
        console.log('Email sent: ' + info.response)
        db.delete('/users/' + req.body.uid) // deletes this user to the DB
        reslt.json(db.getData('/users'))
      }
    })
  },
  /**
  * Sends a email to administrator.
  *
  * @param {Object} req - request send by client.
  * @param {Object} transporter - mail account.
  * @param {Object} db - Database in json file.
  * @param {Object} reslt - response send to client.
  */
  sendMailAdmin: function (req, transporter, db, reslt) {
    let contentMail = `<p>Une nouvelle demande de compte IRCAN a été effectué.</p>
    <p>Pour la traiter, veuillez accéder à cette <a href="${config.APP_URL}/Process">page web</a>.</p>`

    let subject = 'Nouvelle demande de compte IRCAN'

    let mailOptions = {
      from: 'service.ircan@gmail.com',
      to: config.MAIL_ADMIN,
      subject: subject,
      html: contentMail
    }
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error)
        reslt.json(String(error))
      } else {
        console.log('Email sent: ' + info.response)
        db.push('/users/' + req.body.uid, req.body) // adds this user to the DB
        reslt.json(true)
      }
    })
  }
}
