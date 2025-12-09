const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/LoginPage.vue') },
      { path: 'home', component: () => import('pages/IndexPage.vue') }
    ]
  },

  {
    path: '/admin',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresSupervisor: true },
    children: [
    { 
      path: '', 
      component: () => import('pages/AdminDashboard.vue'),
      meta: { requiresSupervisor: true } 
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
      { path: 'novi', component: () => import('pages/nalozi/NaloziCrud.vue') }
      
    ]
  },

  // NOVA RUTA
{
  path: '/admin', 
  component: () => import('layouts/MainLayout.vue'), // Koristi isti layout
  children: [
    
    { 
      path: 'admin-list', 
      component: () => import('pages/admin/AdminList.vue') 
    },

    {
      path: 'uloge-manager', 
      component: () => import('pages/admin/UlogeManager.vue') 
    },
    
  ]
},

  
  {
    path: '/notifikacije',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'tjedan', component: () => import('pages/notifikacije/NotifikacijeTjedan.vue') }
    ]
  },


  {
    path: '/kategorije',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/kategorije/KategorijeIndex.vue') }
    ]
  },

 
  {
    path: '/notifikacije-pravila',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/notifikacije/NotifikacijePravila.vue') }
    ]
  },

  
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
