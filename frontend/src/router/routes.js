const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/LoginPage.vue') },
      { path: 'home', component: () => import('pages/IndexPage.vue') }
    ]
  },

  // SVE ADMIN STVARI NA JEDNOM MJESTU
  {
    path: '/admin',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresSupervisor: true }, // Zaključavamo cijelu admin granu
    children: [
      {
        path: '', 
        component: () => import('pages/AdminDashboard.vue') 
      },
      {
        path: 'admin-list',
        component: () => import('pages/admin/AdminList.vue')
      },
      {
        path: 'uloge-manager',
        component: () => import('pages/admin/UlogeManager.vue')
      },
      {
        path: 'nova-godina', 
        component: () => import('pages/admin/NovaGodina.vue')
      }
    ]
  },

  {
    path: '/nalozi',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/nalozi/NaloziIndex.vue') },
      { path: 'ove-godine', component: () => import('pages/nalozi/NaloziOveGodine.vue') },
      { path: 'nadolazeci', component: () => import('pages/nalozi/NaloziNadolazeci.vue') },
      { path: 'kasni', component: () => import('pages/nalozi/NaloziKasne.vue') },
      { path: 'zavrseni-kasni', component: () => import('pages/nalozi/NaloziZavrseniKasno.vue') },
      { path: 'novi', component: () => import('pages/nalozi/NaloziCrud.vue') }
    ]
  },

  {
    path: '/kategorije',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresSupervisor: true },
    children: [
      {
        path: '',
        name: 'tipovi-naloga',
        component: () => import('pages/kategorije/KategorijeIndex.vue')
      }
    ]
  },

  {
    path: '/notifikacije-pravila',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresSupervisor: true },
    children: [
      { path: '', component: () => import('pages/notifikacije/NotifikacijePravila.vue') }
    ]
  },

  {
    path: '/profil',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/ProfilManage.vue') }
    ]
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes