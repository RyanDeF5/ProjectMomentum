// Import react library and createRoot function from react-dom
import React from 'react'; 
import { createRoot } from 'react-dom/client'

// Add the react class component signiture 
interface MarketProps{
  marketState: string;
}

class MarketDashboard extends React.Component<MarketProps>{
  render() {
    const { marketState } = this.props;

    return (
      <div>The current state is: {marketState}</div>
    )
  }
}

// Grab the reactRoot container on the html file using getElementByID
const domContainer = document.getElementById("reactRoot");

// If the element exists, create the "root" within that container
if (domContainer){
  const root = createRoot(domContainer);

  // Find the marketDashboard class and call its render method
  // Pass in the marketState attribute into the react component  
  root.render(<MarketDashboard marketState="PRE-MARKET" />)

  setTimeout(() => {
  root.render(<MarketDashboard marketState="OPEN" />);
}, 3000);
}
