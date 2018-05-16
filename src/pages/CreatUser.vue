<template>
  <q-page padding class="row justify-center">
    <div style="width: 700px; max-width: 90vw;">
      <p class="caption">{{$t('open_account_title')}}</p>
      <q-stepper ref="stepper" color="secondary" vertical>
        <q-step default name="complete_account" :title="$t('complete_account')">
          <!-- Organism -->
          <q-field :label="$t('organism')" icon="home">
            <q-input disable v-model="organism" />
          </q-field>

          <!-- Email -->
          <q-field label="Email" icon="email">
            <q-input disable v-model="email" />
          </q-field>

          <!-- Full name -->
          <q-field :label="$t('full_name')" icon="account circle">
            <q-input disable v-model="surname" />
            <q-input disable v-model="first_name" />
          </q-field>

          <!-- Team -->
          <q-field :label="$t('team')+' *'" icon="group" icon-color=secondary :error="errors.has('team')" :error-label="errors.first('team')">
            <q-select filter v-model="team" :options="select_team" v-validate="'required'" name="team" />
          </q-field>

          <!-- Pref Language -->
          <q-field class="q-mt-md" :label="$t('lang_pref')+' *'" icon="language" icon-color=secondary>
            <q-radio v-model="lang" val="en" :label="$t('en')" class="q-mr-md" />
            <q-radio v-model="lang" val="fr" :label="$t('fr')" />
          </q-field>
          <q-stepper-navigation>
            <q-btn color="primary" @click="validate($refs.stepper, 'nextcloud')">{{$t('continue')}}</q-btn>
          </q-stepper-navigation>
        </q-step>

        <q-step name="second_account" :title="$t('second_account')">
          <!-- user ID -->
          <q-field :label="$t('user_id')" icon="perm identity">
            <q-input disable v-model="user_id" />
          </q-field>

          <!-- user ID -->
          <q-field :label="$t('pwd')+' *'" icon="lock" icon-color=secondary :error="errors.has('password')" :error-label="errors.first('password')">
            <q-input type="password" v-model="pwd" name="password" v-validate="'required|min:5'" />
          </q-field>

          <!-- passsword -->
          <q-field :label="$t('confirm_pwd')+' *'" icon="lock" icon-color=secondary :error="errors.has('confirm password')" :error-label="errors.first('confirm password')">
            <q-input type="password" v-model="confirm_pwd" v-validate="'confirmed:password|required'" name="confirm password" />
          </q-field>
          <q-stepper-navigation>
            <q-btn color="primary" @click="validate($refs.stepper)">{{$t('continue')}}</q-btn>
            <q-btn color="primary" flat @click="$refs.stepper.previous()">{{$t('back')}}</q-btn>
          </q-stepper-navigation>
        </q-step>

        <q-step name="information" :title="$t('information')">
          <p class="text-justify">
            {{$t('content_info')}}
          </p>
          <!-- checked information -->
          <q-field>
            <q-checkbox v-model="checked" :label="$t('confirm_info')" v-validate="'required:true'" name="confirm" />
          </q-field>
          <q-stepper-navigation>
            <q-btn color="primary" @click="validateAndSubmit()">{{$t('end')}}</q-btn>
            <q-btn color="primary" flat @click="$refs.stepper.previous()">{{$t('back')}}</q-btn>
          </q-stepper-navigation>
        </q-step>
      </q-stepper>
    </div>
  </q-page>
</template>

<script>
import axios from 'axios'
import { date } from 'quasar'

export default {
  name: 'CreatUser',
  data() {
    return {
      lang: 'fr',
      organism: this.$store.getters.o,
      email: this.$store.getters.mail,
      surname: this.$store.getters.sn,
      first_name: this.$store.getters.givenName,
      team: '',
      select_team: [],
      date: null,
      user_id: this.$store.getters.uid,
      pwd: '',
      confirm_pwd: '',
      checked: false
    }
  },
  created() {
    let v = this
    this.$q.notify({
      message: this.$t('no_ref'),
      type: 'negative',
      timeout: 5000,
      position: 'top'
    })
    // Gets all groups
    axios
      .get(`${process.env.APP_URL_GLO}:${process.env.APP_PORT}/groups`)
      .then(function(response) {
        v.select_team = response.data
      })
      .catch(function(error) {
        console.log(error)
      })
  },
  methods: {
    /**
     * Form validator.
     *
     * @param {Object} next -  next step.
     * @param {String} nc - nextcloud step verify.
     */
    validate(next, nc) {
      this.$validator.validateAll().then(isValid => {
        if (isValid) {
          next.next()
          if (nc === 'nextcloud') {
            this.$q.notify({
              message: this.$t('nextcloud'),
              type: 'info',
              timeout: 10000,
              position: 'top'
            })
          }
        }
      })
    },
    /**
     * Form validator and submit.
     */
    validateAndSubmit() {
      this.$validator.validateAll().then(isValid => {
        if (isValid) {
          let dateLoc = Date.now()
          let dateNow = date.formatDate(dateLoc, 'DD-MM-YYYY-HH:mm')
          axios.post(
            `${process.env.APP_URL_GLO}:${process.env.APP_PORT}/users`,
            {
              o: this.organism,
              mail: this.email,
              sn: this.surname,
              givenName: this.first_name,
              team: this.team,
              team_desc: this.team.description,
              date: this.date,
              uid: this.user_id,
              pwd: this.pwd,
              date_now: dateNow,
              lang: this.lang
            }
          )
          this.$q
            .dialog({
              title: this.$t('title_finish'),
              message: this.$t('finish')
            })
            .then(() => {
              window.location.replace('http://ircan.org/')
            })
            .catch(() => {
              window.location.replace('http://ircan.org/')
            })
        }
      })
    }
  }
}
</script>
