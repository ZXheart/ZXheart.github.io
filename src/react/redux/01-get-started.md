# :zzz:

## class component

> 在类组件中使用 redux

### 1. redux 基本使用

> redux 是一个状态管理库，可以使用在任何环境/框架中。在 react 中基础用法：
>
> 1. 初始化仓库，声明`reducer`函数处理`action`，创建`store`。
> 2. 在组件中将`store`中的`state`赋值给组件的`state`。
> 3. 在`componentDidMount`中订阅`store`的变化，更新组件的`state`。
> 4. 在`componentWillUnmount`中取消订阅。

```typescript
// store/action.ts
type counterType = 'INCREMENT' | 'DECREMENT'

export interface CounterState {
  type: counterType
  payload: number
}

// store/reducer.ts
import { CounterState } from './action'

import type { CounterState } from './action'

const initialState = {
  counter: 66,
}

const reducer = (state = initialState, action: CounterState) => {
  switch (action.type) {
    case 'INCREMENT':
      return { counter: state.counter + action.payload }
    case 'DECREMENT':
      return { counter: state.counter - action.payload }
    default:
      return state
  }
}

export default reducer

// store/index.ts
import { createStore } from 'redux'
import reducer from './reducer'

const store = createStore(reducer)
export default store
```

```tsx
// Home.tsx
import { PureComponent } from 'react'

import store from '../store'

interface HomeState {
  count: number
}

class Home extends PureComponent<object, HomeState> {
  private unsubscribe: (() => void) | undefined

  constructor(props: HomeState) {
    super(props)

    this.state = {
      count: store.getState().counter,
    }
  }

  componentDidMount() {
    this.unsubscribe = store.subscribe(() => {
      this.setState({
        count: store.getState().counter,
      })
    })
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  }

  render() {
    const { count } = this.state

    function handleAdd(num: number) {
      store.dispatch({
        type: 'INCREMENT',
        payload: num,
      })
    }

    return (
      <div>
        <h1>home: {count}</h1>
        <button onClick={() => handleAdd(5)}>add 5</button>
      </div>
    )
  }
}

export default Home
```

```tsx
// Profile.tsx
import { PureComponent } from 'react'

import store from '../store'

interface HomeState {
  count: number
}

class Profile extends PureComponent<object, HomeState> {
  unsubscribe: (() => void) | undefined

  constructor(props: object) {
    super(props)
    this.state = {
      count: store.getState().counter,
    }
  }

  componentDidMount() {
    this.unsubscribe = store.subscribe(() => {
      this.setState({ count: store.getState().counter })
    })
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  }

  render() {
    const { count } = this.state

    function handleSub(num: number) {
      store.dispatch({
        type: 'DECREMENT',
        payload: num,
      })
    }

    return (
      <div style={{ border: '1px solid red' }}>
        <h1>Profile:{count}</h1>

        <button onClick={() => handleSub(5)}>sub 5</button>
      </div>
    )
  }
}

export default Profile
```

### 2. react-redux & redux-thunk

> `react-redux` 是`redux`的官方绑定库，类组件中提供了`Provider`和`connect`两个组件，可以更方便的在`react`中使用`redux`。
>
> 1. `Provider`组件提供`store`，将`store`传递给子组件。
> 2. `connect`函数的第一个参数`mapStateToProps`接收`store`中的`state`，返回一个对象，将`state`通过`props`传递给组件。
> 3. `connect`函数的第二个参数`mapDispatchToProps`接收`store`中的`dispatch`，返回一个对象，将`dispatch`通过`props`传递给组件。
> 4. 简化了组件中对`store`中`state`的监听和更新。（不知道是不是类组件使用 ts 的问题，代码是一点也没少，甚至还多了。）

> `redux-thunk`是一个中间件，可以让`action`返回一个函数，这个函数接收`dispatch`和`getState`两个参数，可以在函数中进行异步操作。
>
> 1. `createStore`函数的第二个参数是`enhancer`，可以传入中间件。
> 2. `thunk`中间件允许`dispatch`一个函数`action`，该`action`返回一个函数，返回函数（将被自动执行）会传入`dispatch`和`getState`两个参数。
>    由此，在该函数`action`可以执行异步操作、继续执行其他`action`等。

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux' // [!code ++]
import App from './App.tsx'
import store from './react-redux/store' // [!code ++]

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
)
```

```typescript
// store/action.ts
import type { ThunkAction } from 'redux-thunk'

import type { InitialState } from './reducer'

export interface IncrementAction {
  type: 'INCREMENT'
  payload: number
}

export interface DecrementAction {
  type: 'DECREMENT'
  payload: number
}

export interface OtherAction {
  type: 'OTHER'
  payload: string
}

export type CounterState = IncrementAction | DecrementAction | OtherAction

export type AsyncDecrementAction = ThunkAction<Promise<void>, InitialState, unknown, DecrementAction> // [!code ++]

// [!code ++]
export const fetchSubNumber = (): AsyncDecrementAction => {
  return async (dispatch, getState) => {
    console.log(getState())
    const random = Math.floor(Math.random() * 9 + 1 - 2) + 2 // [2, 9]
    const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${random}`)
    const data = await response.json()
    dispatch({ type: 'DECREMENT', payload: data.id })
  }
}

// store/reducer.ts
import type { CounterState } from './action'

const initialState = {
  counter: 66,
  otherState: 'others',
}

export type InitialState = typeof initialState

const reducer = (state = initialState, action: CounterState) => {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, counter: state.counter + action.payload }
    case 'DECREMENT':
      return { ...state, counter: state.counter - action.payload }
    case 'OTHER':
      return { ...state, otherState: action.payload }
    default:
      return state
  }
}

export default reducer

// store/index.ts
import { createStore, compose, applyMiddleware } from 'redux'
import { thunk } from 'redux-thunk' // [!code ++]
import reducer from './reducer'

const composeEnhancers =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)))

export default store
```

```tsx
// Home.tsx

import { PureComponent } from 'react'
import { connect, type ConnectedProps } from 'react-redux'

import type { Dispatch } from 'redux'
import type { InitialState } from '../../react-redux/store/reducer'
import type { IncrementAction } from '../../react-redux/store/action'

function mapStateToProps(state: InitialState) {
  return {
    counter: state.counter,
  }
}

function mapDispatchToProps(dispatch: Dispatch<IncrementAction>) {
  return {
    add: (num: number) => dispatch({ type: 'INCREMENT', payload: num }),
  }
}

const connector = connect(mapStateToProps, mapDispatchToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

interface HomeState {
  count: number
}

class Home extends PureComponent<PropsFromRedux, HomeState> {
  constructor(props: PropsFromRedux) {
    super(props)
  }

  render() {
    const { counter, add } = this.props

    function handleAdd(num: number) {
      add(num)
    }

    return (
      <div>
        <h1>home: {counter}</h1>
        <button onClick={() => handleAdd(5)}>add 5</button>
      </div>
    )
  }
}

const ConnectedHome = connector(Home)
export default ConnectedHome
```

```tsx
// Profile.tsx

import { PureComponent } from 'react'
import { connect, type ConnectedProps } from 'react-redux'

import { fetchSubNumber } from '../../react-redux/store/action'

import type { ThunkDispatch } from 'redux-thunk'
import type { InitialState } from '../../react-redux/store/reducer'
import type { DecrementAction } from '../../react-redux/store/action'

function mapStateToProps(state: InitialState) {
  return {
    counter: state.counter,
  }
}

// async action [!code ++]
function mapDispatchToProps(dispatch: ThunkDispatch<InitialState, unknown, DecrementAction>) {
  return {
    asyncSub: () => {
      dispatch(fetchSubNumber())
    },
  }
}

const connector = connect(mapStateToProps, mapDispatchToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

interface HomeState {
  count: number
}

class Profile extends PureComponent<PropsFromRedux, HomeState> {
  constructor(props: PropsFromRedux) {
    super(props)
  }

  render() {
    const { counter, asyncSub } = this.props

    function handleSub() {
      asyncSub()
    }

    return (
      <div style={{ border: '1px solid red' }}>
        <h1>Profile:{counter}</h1>
        <button onClick={handleSub}>sub random</button>
      </div>
    )
  }
}

const ConnectedProfile = connector(Profile)
export default ConnectedProfile
```

### 3. react-redux & @reduxjs/toolkit

> `@reduxjs/toolkit`是`redux`官方推荐的工具包，提供了一些工具函数，可以更简化使用`redux`的部分。

> 1. `createSlice`函数接收一个对象，对象中包含`name`、`initialState`、`reducers`三个属性，返回一个`slice`对象。
> 2. `configureStore`函数接收一个对象，常用`reducer`、`middleware`两个属性，返回一个`store`对象。（`devTools`默认为`true`）

```typescript
// store/modules/counter/counter-slice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

interface FetchAddCountProps {
  userId: number
  id: number
  title: string
  completed: boolean
}

export const fetchAddCount = createAsyncThunk<FetchAddCountProps, number>(
  'counter/fetchAddCount',
  // args：调用fetchAddCount时传入的参数；store：store对象 [!code ++]
  async (args, store) => {
    console.log(`args:${args}`, store)
    const random = Math.floor(Math.random() * 9 + 1 - 3) + 3 // [3, 9]

    // 方法1 在
    const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${random}`)
    const data: FetchAddCountProps = await response.json()
    return data

    // 方法2 直接调用store.dispatch
    // try {
    //   const response = await fetch(
    //     `https://jsonplaceholder.typicode.com/todos/${random}`,
    //   );
    //   const data: FetchAddCountProps = await response.json();
    //   store.dispatch(add(data.id + args));
    // } catch (e) {
    //   console.log(e);
    // }
  }
)

const counterSlice = createSlice({
  name: 'counter',
  initialState: 99,
  reducers: {
    add(state, action) {
      return state + action.payload
    },
    subtract(state, action) {
      return state - action.payload
    },
  },
  // 方法1
  extraReducers: builder => {
    builder.addCase(fetchAddCount.fulfilled, (state, { payload, meta }) => {
      console.log('fetchAddCount.fulfilled', state, meta) // meta.arg === fetchAddCount的args
      return state + payload.id + meta.arg // 如果是对象类型可以直接修改，基本类型则需要返回新值
    })
  },
  // extraReducers也有另一种写法（计算属性名）
})

export const { add, subtract } = counterSlice.actions
export default counterSlice.reducer

// store/modules/product/product-slice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

const initialState = ['Apple', 'Banana', 'Cherry', 'Date']

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    addProduct(state, action: PayloadAction<string>) {
      state.push(action.payload)
    },
    removeByIndex(state, action: PayloadAction<number>) {
      state.splice(action.payload, 1)
    },
  },
})

export type ProductState = typeof initialState
export const { addProduct, removeByIndex } = productSlice.actions
export default productSlice.reducer

// store/index.ts
import { configureStore } from '@reduxjs/toolkit'

import counterReducer from './modules/counter/counter-slice'
import productReducer from './modules/product/product-slice'

const store = configureStore({
  reducer: {
    counter: counterReducer,
    product: productReducer,
  },
  // devTools: true, // 使用@reduxjs/toolkit时 默认为 true
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

```tsx
// Counter.tsx

import { PureComponent } from 'react'
import { connect, type ConnectedProps } from 'react-redux'

import type { RootState } from '../store'

import { add, subtract, fetchAddCount } from '../store/modules/counter/counter-slice'

class Counter extends PureComponent<PropsFromRedux, RootState> {
  constructor(props: PropsFromRedux) {
    super(props)
  }

  render() {
    const { add, subtract, fetchAddCount, count } = this.props

    return (
      <div>
        <h1>Counter: {count}</h1>
        <button onClick={() => add(5)}>+ 5</button>
        <button onClick={() => subtract(8)}>- 8</button>
        <button onClick={() => fetchAddCount(33)}>add random + 33</button>
      </div>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  count: state.counter,
})

const mapDispatchToProps = {
  add,
  subtract,
  fetchAddCount,
}

const connector = connect(mapStateToProps, mapDispatchToProps)
type PropsFromRedux = ConnectedProps<typeof connector>

const ConnectedCounter = connector(Counter)

export default ConnectedCounter
```

```tsx
// Product.tsx

import { PureComponent } from 'react'
import { connect } from 'react-redux'

import type { RootState } from '../store'

import { addProduct, removeByIndex } from '../store/modules/product/product-slice'

interface SeflState {
  removeIndex: number
  inputProduct: string
}

class Product extends PureComponent<PropsFromRedux, SeflState> {
  constructor(props: PropsFromRedux) {
    super(props)

    this.state = {
      removeIndex: 0,
      inputProduct: '',
    }
    // this.handleProductChange = this.handleProductChange.bind(this);
  }

  // handleProductChange(e: React.ChangeEvent<HTMLInputElement>) {
  //   this.setState({ inputProduct: e.target.value });
  // }

  render() {
    const { products, removeByIndex, addProduct } = this.props
    const { removeIndex, inputProduct } = this.state

    const handleAdd = () => {
      if (inputProduct.trim()) {
        addProduct(inputProduct)
        this.setState({ inputProduct: '' })
      }
    }

    const handleRemove = () => {
      removeByIndex(removeIndex)
      this.setState({ removeIndex: 0 })
    }

    return (
      <div>
        <h1>Counter: {products.join(', ')}</h1>
        <input type="text" value={inputProduct} onChange={e => this.setState({ inputProduct: e.target.value })} />
        <button onClick={() => handleAdd()}>add product</button>
        <input type="number" value={removeIndex} onChange={e => this.setState({ removeIndex: +e.target.value })} />
        <button onClick={() => handleRemove()}>remove product by index</button>
      </div>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  products: state.product,
})

const mapDispatchToProps = {
  addProduct,
  removeByIndex,
}

type PropsFromRedux = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps

export default connect(mapStateToProps, mapDispatchToProps)(Product)
```

## function component
