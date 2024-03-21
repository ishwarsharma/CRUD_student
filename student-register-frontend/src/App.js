import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import Students from './components/Students';
const client = new ApolloClient({
  uri: 'http://localhost:4000', // URL of your GraphQL server
  cache: new InMemoryCache()
});

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        {<Students />}
      </div>
    </ApolloProvider>
  );
}

export default App;
