import React from 'react';
// import Notes from './Notes.jsx';
// import NoteActions  from '../actions/NoteActions.js';
// import NoteStore from '../stores/NoteStore.js';
import AltContainer from 'alt-container';
import Lanes from './Lanes';
import LaneActions from '../actions/LaneActions';
import LaneStore from '../stores/LaneStore';


export default class App extends React.Component {
    // constructor(props) {
    //     super(props);
    //
    //     this.state = NoteStore.getState();
    //
    // }

    // componentDidMount(){
    //     NoteStore.listen(this.storeChanged);
    // }
    // componentWillUnmount(){
    //     NoteStore.unlisten(this.storeChanged);
    // }
    // storeChanged = (state) => {
    //     this.setState(state);
    // };

    render() {
        // const notes = this.state.notes;
        return (<div>
            <button className="add-lane" onClick={this.addLane}>+</button>
            <AltContainer
                stores={[LaneStore]}
                inject={{
                    lanes: () => LaneStore.getState().lanes || []
                }}
            >
                <Lanes/>
            </AltContainer>
        </div>);
    }

   addLane() {
       LaneActions.create({name: 'New Lane'});
   }
}