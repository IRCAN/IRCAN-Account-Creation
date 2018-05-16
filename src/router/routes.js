import md5 from 'md5'
import axios from 'axios'
import store from '../store'

export default [
  { path: '/CreatUser', component: () => import('pages/CreatUser'), meta: { title: 'Account-Creation' }, beforeEnter: integrity },
  { path: '/process', component: () => import('pages/Process'), meta: { title: 'Account-Creation-Processing' } },
  { path: '*', component: () => import('pages/404') }
]

/**
* Verification of data integrity.
*/
function integrity(to, from, next) {
  let url = decodeURIComponent(document.location.href)
  let re = /\?(.+)k=/i
  let md5Compare = /k=(.+)$/i
  let uid = { uid: url.match(/uid=([^&]+)&/)[1] }
  axios
    .post(`${process.env.APP_URL_GLO}:${process.env.APP_PORT}/userSearch`, uid)
    .then(function (response) {
      if (response.data && url.match(md5Compare)[1] === md5(url.match(re)[1] + 'key=YutpkGAT')) {
        store.commit('setO', url.match(/o=([^&]+)&/)[1])
        store.commit('setMail', url.match(/mail=([^&]+)&/)[1])
        store.commit('setSn', url.match(/sn=([^&]+)&/)[1])
        store.commit('setGivenName', url.match(/givenName=([^&]+)&/)[1])
        store.commit('setUid', url.match(/uid=([^&]+)&/)[1])
        next()
      } else {
        next({ path: '404' })
      }
    })
    .catch(function (error) {
      console.log(error)
    })
}
