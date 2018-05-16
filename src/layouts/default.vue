<template>
  <q-layout-header>
    <q-toolbar color=secondary class="q-py-md">
      <q-toolbar-title>
        IRCAN
        <span slot="subtitle">{{$t('ircan')}}</span>
      </q-toolbar-title>
      <img alt="Quasar logo" class="absolute-center" src="statics/ircan-logo.png">
      <!-- <br><br><br> -->
      <q-btn-toggle @input="onLanguageIconClick($event)" v-model="model" toggle-color="primary" :options="[ {label: 'FR', value: 'fr'}, {label: 'EN', value: 'en'} ]" />
    </q-toolbar>
  </q-layout-header>
</template>

<script>
export default {
  data() {
    return {
      model: this.$i18n.locale
    }
  },
  methods: {
    /**
     * Change the language.
     *
     * @param {String} selectedLanguage - language.
     */
    onLanguageIconClick(selectedLanguage) {
      this.$i18n.locale = selectedLanguage
    }
  }
}
</script>

<style>

</style>
