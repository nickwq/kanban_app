//noinspection JSUnresolvedVariable
import React from 'react';
import {DragSource, DropTarget} from 'react-dnd';
import ItemTypes from '../constants/itemType';

const noteSource = {
    beginDrag(props) {
        return {id: props.id};
    },

    isDragging(props, monitor) {
        return props.id === monitor.getItem().id
    }
};

const noteTarget = {
    hover(targetProps, monitor) {
        const targetId = targetProps.id;
        const sourceProps = monitor.getItem();
        const sourceId = sourceProps.id;

        if(sourceId !== targetId) {
            targetProps.onMove({sourceId, targetId});
        }
    }
};


@DragSource(ItemTypes.NOTE, noteSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
}))

@DropTarget(ItemTypes.NOTE, noteTarget, (connect) => ({
    connectDropTarget: connect.dropTarget()
}))

class Note extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            editing: false
        };
    }

    render() {

        const {connectDragSource, connectDropTarget, isDragging,
            onMove, id, editing, ...props} = this.props;
        const dragSource = editing ? a => a : connectDragSource;
        // if (this.state.editing) {
        //     return this.renderEdit();
        // }
        //
        // return this.renderNote();

        return dragSource( connectDropTarget(
            <li style={{opacity: isDragging?0 :1}}
                {...this.props}>{this.props.children}</li>
        ));
    }

    renderEdit = () => {
        return (
            <input type="text"
                   ref={
                     (e) => e?e.selectionStart = this.props.task.length : null
                   }
                   autoFocus={true}
                   defaultValue={this.props.task}
                   onBlur={this.finishEdit}
                   onKeyPress={this.checkEnter}
            />
        );
    };
    renderNote = () => {
        const onDelete = this.props.onDelete;
        return (
            <div onClick={this.edit}>
                <span className="task">{this.props.task}</span>
                {onDelete ? this.renderDelete() : null}
            </div>
        );
    };
    renderDelete = () => {
        return <button className="delete-note" onClick={this.props.onDelete}>x</button>
    };
    edit = () => {
        this.setState({
            editing: true
        });
    };
    checkEnter = (e) => {
        if (e.key === 'Enter') {
            this.finishEdit(e);
        }
    };
    finishEdit = (e) => {
        const value = e.target.value;

        if (this.props.onEdit) {
            this.props.onEdit(value);

            this.setState({
                editing: false
            });
        }
    };

}

Note.propTypes = {
    id: React.PropTypes.string.isRequired,
    editing: React.PropTypes.bool,
    connectDragSource: React.PropTypes.func,
    connectDropTarget: React.PropTypes.func,
    isDragging: React.PropTypes.bool,
    onMove: React.PropTypes.func
};
Note.defaultProps = {
    onMove: () => {}
};
export default Note;