import { ColumnView } from './ColumnView';
import { sampleDoc } from './data/sampleDoc';
// import { CollapsibleBullet } from './CollapsibleBullet';

function App() {
  return (
    <ColumnView rootChunks={sampleDoc} />
  );
  
  // CollapsibleBullet code preserved but disconnected from display:
  // <CollapsibleBullet text="Melody">
  //   <CollapsibleBullet text="Phrasing">
  //     <CollapsibleBullet text="scales">
  //       <CollapsibleBullet text="major"></CollapsibleBullet>
  //       <CollapsibleBullet text="minor"></CollapsibleBullet>
  //     </CollapsibleBullet>
  //     <CollapsibleBullet text="rhythm"></CollapsibleBullet>
  //   </CollapsibleBullet>
  // </CollapsibleBullet>
}

export default App;