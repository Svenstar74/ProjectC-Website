import DisplayGraph from './components/DisplayGraph'

function App() {
  return (
    <div onContextMenu={(e) => e.preventDefault()}>
      <DisplayGraph />
    </div>
  )
}

export default App
