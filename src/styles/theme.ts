import { extendTheme } from '@chakra-ui/react'
import { Button } from './components/button'

export const theme = extendTheme({
  semanticTokens: {
    colors: {
      brand: 'red.500',
      success: 'green.500',
    },
  },
  components: {
    Button
  }
})