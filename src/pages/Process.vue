<template>
  <q-page padding class="row justify-center">
    <q-table :title="$t('table_title')" :data="tableData" selection='single' :columns="columns" row-key="uid" :selected.sync="selected" color="secondary" @update:selected="icon_manager($event)">
      <template slot="top-right" slot-scope="props">
        <div class="col" />
        <q-btn :disable="check_manager" color="positive" icon="check" round class="q-mr-md" @click="Confirm('add')" />
        <q-btn :disable="check_manager" color="negative" round icon="delete" @click="Confirm('delete')" />
      </template>
      <q-td slot="body-cell-date" slot-scope="props" :props="props">
        <!-- En date -->
        <q-datetime clearable v-model=props.value type="date" name="date" @change="ChangeDate($event, props.row.__index)" />
      </q-td>
    </q-table>
  </q-page>
</template>

<script>
import axios from 'axios'

export default {
  data: () => ({
    check_manager: true,
    selected: [],
    columns: [
      {
        name: 'desc',
        label: 'Identifiant',
        align: 'left',
        field: 'uid',
        sortable: true
      },
      {
        name: 'sn',
        label: 'Nom',
        align: 'left',
        field: 'sn',
        sortable: true
      },
      {
        name: 'givenName',
        label: 'Prénom',
        align: 'left',
        field: 'givenName',
        sortable: true
      },
      {
        name: 'mail',
        label: 'Email',
        align: 'left',
        field: 'mail',
        sortable: true
      },
      {
        name: 'o',
        label: 'Institut lié au compte',
        align: 'left',
        field: 'o',
        sortable: true
      },
      {
        name: 'team',
        label: 'Equipe de référence',
        align: 'left',
        field: 'team_desc',
        sortable: true
      },
      {
        name: 'date',
        label: 'Date de fin de contrat',
        align: 'left',
        field: 'date',
        sortable: true
      },
      {
        name: 'date_now',
        label: 'Date de la demande',
        align: 'left',
        field: 'date_now',
        sortable: true
      }
    ],
    tableData: []
  }),
  created() {
    let v = this
    // Gets all users
    axios
      .get(`${process.env.APP_URL_GLO}:${process.env.APP_PORT}/users`)
      .then(function(response) {
        v.tableData = Object.values(response.data)
      })
      .catch(function(error) {
        console.log(error)
      })
  },
  methods: {
    /**
     * Disable/enable the buttons delete/add
     *
     * @param {Object} event - line selected.
     */
    icon_manager(event) {
      if (event.length > 0) {
        this.check_manager = false
      } else {
        this.check_manager = true
      }
    },
    /**
     * Error display
     *
     * @param {Boolean} bError - error?
     * @param {String} error - error.
     */
    notif(bError, error) {
      if (bError) {
        this.$q.notify({
          message: this.$t('error') + error,
          type: 'negative',
          timeout: 4000,
          position: 'top'
        })
      } else {
        this.$q.notify({
          message: this.$t('add_title'),
          type: 'positive',
          timeout: 2000,
          position: 'top'
        })
      }
    },
    /**
     * Process a request to create IRCAN account
     */
    Add() {
      let v = this
      axios
        .post(
          `${process.env.APP_URL_GLO}:${process.env.APP_PORT}/usersAdd`,
          this.selected[0]
        )
        .then(function(response) {
          if (typeof response.data === 'string') {
            v.notif(true, response.data)
          } else {
            v.tableData = Object.values(response.data)
            v.notif(false)
          }
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    /**
     * Deletes a request to create IRCAN account
     */
    Delete() {
      let v = this
      axios
        .post(
          `${process.env.APP_URL_GLO}:${process.env.APP_PORT}/usersDelete`,
          this.selected[0]
        )
        .then(function(response) {
          v.tableData = Object.values(response.data)
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    /**
     * Confirm the request
     */
    Confirm(deleteOrAdd) {
      this.$q
        .dialog({
          title: this.$t('confirm'),
          message: this.$t(deleteOrAdd),
          ok: this.$t('agree'),
          cancel: this.$t('disagree')
        })
        .then(() => {
          if (deleteOrAdd === 'add') {
            this.Add()
          } else {
            this.Delete()
            this.$q.notify({
              message: this.$t('delete_title'),
              type: 'negative',
              timeout: 2000,
              position: 'top'
            })
          }
        })
        .catch(() => {
          console.log('CANCEL')
        })
    },
    /**
     * End date
     */
    ChangeDate(event, i) {
      this.tableData[i].date = event
    }
  }
}
</script>
