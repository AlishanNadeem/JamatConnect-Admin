import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import Loader from '@/components/Loader'
import { persistor, store } from '@/redux/store'
import AppRoutes from '@/routes'
import '@/styles/global.scss'

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={<Loader label="Restoring session…" />} persistor={persistor}>
        <AppRoutes />
      </PersistGate>
    </Provider>
  )
}

export default App
