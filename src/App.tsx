import { DisplayGraph } from './features/display-graph'

function App() {
  return (
    <div onContextMenu={(e) => e.preventDefault()}>
      <DisplayGraph />
    </div>
  )
}

export default App
