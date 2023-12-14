import React from 'react'
import ReactDOM from 'react-dom/client'
import { useState } from 'react'
import App from './App.jsx'
import './index.css'
import StarRating from './StarRating'
import TextExpander from './TextExpander'



function Test() {
  const [rating, setRating] = useState(5)
  return (
    <>
      < StarRating maxStars={10} onSetRating={setRating} />
      <p>Rating is {rating}</p>
    </>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <TextExpander>
      Let's put this all together! You will notice that I didn't have an else statement. This is called the early return. Because a function will end and stop all execution once the return keyword is called. So we won't need an else keyword since that will never be called. We can simply get rid of that else bracket and write all our code in the open. You will see this pattern a lot in the wild, it's a nice refactoring technique you can employ in your own code too!
    </TextExpander>
    <StarRating maxStars={10} /> */}
    <App />
  </React.StrictMode>,
)
