import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { DialogProvider } from '@/components/Dialog/DialogProvider'
import Loader from '@/components/Loader'
import { persistor, store } from '@/redux/store'
import AppRoutes from '@/routes'
import '@/styles/global.scss'
import '@/styles/data-table.scss'

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={<Loader label="Restoring session…" />} persistor={persistor}>
        <DialogProvider>
          <AppRoutes />
        </DialogProvider>
      </PersistGate>
    </Provider>
  )
}

export default App
