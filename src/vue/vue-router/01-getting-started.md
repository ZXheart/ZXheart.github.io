# :zzz:

## 前言

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>test</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@unocss/reset/tailwind.min.css" />
    <script src="https://unpkg.com/vue@3"></script>
    <script src="https://unpkg.com/vue-router@4"></script>
  </head>
  <body>
    <div id="app">
      <h1>Hello App!</h1>
      <p class="text-red grid grid-cols-3 gap-10">
        <router-link to="/">Go to Home</router-link>
        <router-link to="/about">Go to About</router-link>
        <router-link to="/custom">Go to Custom</router-link>
      </p>
      <div class="bg-#f1f3f5 text-center">
        <router-view></router-view>
      </div>
    </div>
    <script>
      const { ref } = Vue
      const app = Vue.createApp({})

      const Home = { template: '<div>Home</div>' }
      const About = { template: '<div>About</div>' }
      app.component('custom', {
        setup() {
          const count = ref(0)
          function increment() {
            count.value++
          }
          return {
            count,
            increment,
          }
        },
        template: `
              <div class="test">{{ count }}</div>
              <button @click='increment'>add</button>
              `,
      })
      const Custom = app.component('custom')

      const routes = [
        { path: '/', component: Home },
        { path: '/about', component: About },
        { path: '/custom', component: Custom },
      ]
      const router = VueRouter.createRouter({
        history: VueRouter.createWebHashHistory(),
        routes, // `routes: routes` 的缩写
      })

      app.use(router)
      app.mount('#app')
    </script>

    <script src="https://cdn.jsdelivr.net/npm/@unocss/runtime"></script>
  </body>
</html>
```
