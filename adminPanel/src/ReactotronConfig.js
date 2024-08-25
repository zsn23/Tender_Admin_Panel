import Reactotron from 'reactotron-react-js'
import { reactotronRedux } from 'reactotron-redux'
const reactotron = Reactotron
export default Reactotron
  .configure() // we can use plugins here -- more on this later
  .use(reactotronRedux())
  .connect() // let's connect!