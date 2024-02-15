import { SnackbarProvider } from 'notistack'
import { DisplayGraph } from './features/display-graph'
import { StyledMaterialDesignContent } from './shared/hooks/useToastMessage'

function App() {
  return (
    <div onContextMenu={(e) => e.preventDefault()}>
      <DisplayGraph />
      <SnackbarProvider
        autoHideDuration={3000}
        Components={{
          success: StyledMaterialDesignContent,
          error: StyledMaterialDesignContent,
        }}
      />
    </div>
  )
}

export default App
