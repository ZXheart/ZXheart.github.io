:zzz:

## connect

> 通过`connect`函数，将`store`中的`state`和`dispatch`映射到组件的`props`上。

```tsx
// HOC/StoreContext.tsx
import { createContext } from 'react'
import type { Store } from 'redux'

export const StoreContext = createContext<Store<any, any, any> | null>(null)
```

```tsx
// HOC/connect.tsx
import React, { PureComponent, useContext, useEffect, useState, ContextType } from 'react'
import type { Store } from 'redux'

// import store from '../react-redux/store'
import { StoreContext } from './StoreContext'

/**
 * @description 类组件的connect；类组件+ts用起来真是吃了屎了
 * @param mapStateToProps
 * @param mapDispatchToProps
 * @returns
 */
export function connect(mapStateToProps: any, mapDispatchToProps?: any) {
  return function <P extends object>(WrappedComponent: React.ComponentType<P>) {
    return class extends PureComponent<P> {
      static contextType = StoreContext
      private unsubscribe: (() => void) | undefined
      declare context: ContextType<typeof StoreContext>

      constructor(props: P, context: ContextType<typeof StoreContext>) {
        super(props)

        this.state = this.getPropsFromStore(context!)
      }

      getPropsFromStore = (store: Store<any, any, any>) => {
        if (!store) {
          throw new Error('Store is not found. Make sure you wrapped the component with <StoreProvider>')
        }
        return {
          ...mapStateToProps(store.getState()),
          ...(mapDispatchToProps ? mapDispatchToProps(store.dispatch) : {}),
        }
      }

      componentDidMount() {
        const store = this.context

        if (!store) {
          throw new Error('Store is not found. Make sure you wrapped the component with <StoreProvider>')
        }
        this.unsubscribe = store.subscribe(() => {
          this.setState(mapStateToProps(store.getState()))
          console.log(this.state)
        })
      }

      componentWillUnmount() {
        if (this.unsubscribe) {
          this.unsubscribe()
        }
      }

      render() {
        return <WrappedComponent {...this.props} {...this.state} />
      }
    }
  }
}

/**
 * @description 函数组件的connect
 * @param mapstateToProps
 * @param mapDispatchToProps
 * @returns
 */
export function connectFn(mapstateToProps: any, mapDispatchToProps: any) {
  return function (WrappedComponent: any) {
    return function (props: any) {
      const store = useContext(StoreContext)
      if (!store) {
        throw new Error('StoreContext.Provider is not found')
      }

      const [state, setState] = useState(store.getState())

      useEffect(() => {
        const unsubscribe = store.subscribe(() => {
          setState(store.getState())
        })
        return () => {
          unsubscribe()
        }
      }, [store])

      const states = mapstateToProps(state)
      const dispatches = mapDispatchToProps(store.dispatch)
      return <WrappedComponent {...props} {...states} {...dispatches} />
    }
  }
}
```

```ts
// src/main.ts
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { StoreContext } from './HOC/StoreContext.ts'

import App from './App.tsx'
import store from './react-redux/store' // 1. redux-react & redux-thunk

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    // [!code ++]
    <StoreContext.Provider value={store}>
      <App />
    </StoreContext.Provider>
  </StrictMode>
)
```

### loggerMiddleware

```ts
import { configureStore, type Middleware } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import counterReducer from './modules/counter/counter-slice'
import productReducer from './modules/product/product-slice'

const loggerMiddleware: Middleware = store => next => action => {
  console.log(`dispatching`, action)
  const result = next(action)
  console.log(`next state`, store.getState())
  return result
}

const store = configureStore({
  reducer: {
    counter: counterReducer,
    product: productReducer,
  },
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware().concat(loggerMiddleware)
  },
})

// logger
function logger() {
  const next = store.dispatch
  // monkey patching
  store.dispatch = ((action: PayloadAction): any => {
    console.log('dispatching', action)
    next(action)
    console.log(`next state`, store.getState())
  }) as typeof store.dispatch
}

// logger()

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```
