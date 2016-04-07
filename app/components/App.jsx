import React from 'react';
import Notes from './Notes.jsx';
import NoteActions  from '../actions/NoteActions.js';
import NoteStore from '../stores/NoteStore.js';
import AltContainer from 'alt-container';


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
            <button className="add-note" onClick={this.addNote}>+</button>
            <AltContainer
                stores={[NoteStore]}
                inject={{
                    notes: () => NoteStore.getState().notes
                }}
            >
                <Notes onEdit={this.editNote} onDelete={this.deleteNote}/>
            </AltContainer>
        </div>);
    }

    addNote = () => {
        NoteActions.create({task: 'New task'});
    };

    editNote = (id, task) => {
        if (!task.trim()) {
            return;
        }

        NoteActions.update({id, task});
    };

    deleteNote = (id, e) => {
        e.stopPropagation();

        NoteActions.delete(id);
    };
}