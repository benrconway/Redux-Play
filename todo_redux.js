// The top functions called Todo, Todos and visibilityFilter are all 'reducers'
// which effect all the changes to the state of the application.
// Only an "action" can be sent to a reducer with appropriate type and information
// and this will change the data in the state which is held external to the application
// in a place called "the store".


//In redux, everything that changes, both UI and otherwise has its information held
// within the State or State Tree.

// Any changes to that state will be made possible through defined Actions

//These are action creator functions.
let nextTodoId = 0;
const addTodo = (text) => {
  return {
    type: 'ADD_TODO',
    id: nextTodoId++;,
    text
  };
};

const toggleTodo = (id) => {
  return {
    type: 'TOGGLE_TODO',
    id
  };
}

const setVisibilityFilter = (filter) => {
  return {
      type: 'SET_VISIBILITY_FILTER',
      filter: filter
  };
};

const todo = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        id: action.id,
        text: action.text,
        completed: false
      };
    case 'TOGGLE_TODO':
      if (state.id !== action.id){
        return state;
      }

      return {
        ...state,
        completed: !state.completed
      };

    default:
      return state;
  }
};

const todos = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        todo(undefined, action)
      ];
    case 'TOGGLE_TODO':
      return state.map(t =>
        todo(t, action)
      );
    default:
      return state;
  }
};

const visibilityFilter = (state = 'SHOW_ALL', action) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
    default:
      return state;
  }
};
// Seeing as many reducers are commonly used to effectively seperate the functionality
// into readable understandable code, the following is how to combine them all
// into the reducer used by the store to aggregate all the information needed.

// In the example below, they are associated key/value pairs, but es6 has the
// capacity to write only one word if the key and value are the same. In ES5 I
//expect that you would need to write 'todos: todos' etc.


const { combineReducers } = Redux;
const todoApp = combineReducers({ todos, visibilityFilter });



const { Component } = React;

const Link = ({ active, children, onClick }) => {
  if(active) {
    return <span>{children}</span>
  }

  return (
    <a href='#'
      onClick={e => {
        e.preventDefault();
        onClick();
      }}
      >
        {children}
      </a>
  );
};
//This will replace the filterlink class below.
// Own props is clear about the container component props, as opposed to the return
// value of mapstatetoprops which is given to its children.
const mapStateToLinkProps = (state, ownProps) => {
  return {
    active: ownProps.filter === state.visibilityFilter
  };
};
const mapDispatchToLinkProps = (dispatch, ownProps) => {
  return {
    onClick: () => dispatch(setVisibilityFilter(ownProps.filter))
  };
};
const FilterLink = connect(mapStateToLinkProps, mapDispatchToLinkProps)(Link)

// class FilterLink extends Component {
//   componentDidMount() {
//     const { store } = this.context;
//     this.unsubscribe = store.subscribe(()=>
//       this.forceUpdate()
//     );
//   }
//
//   componentWillUnmount() {
//     this.unsubscribe();
//   }
//
//   render() {
//     const props = this.props;
//     const { store } = this.context;
//     const state = store.getState();
//
//     return (
//       <Link
//         active={props.filter === state.visibilityFilter}
//         onClick={ () =>
//           store.dispatch({
//             type: 'SET_VISIBILITY_FILTER',
//             filter: props.filter
//           })
//         }
//       >
//         {props.children}
//       </Link>
//     );
//   }
// }
// // If you want the context to work, it must be declared in the following.
// // If you skip the declaration, it will not receive the context as an argument.
// FilterLink.contextTypes = {
//   store: React.PropTypes.object
// };

const Footer = () => (
  <p>
    Show:
    {' '}
    <FilterLink filter='SHOW_ALL'>
      All
    </FilterLink>
    {', '}
    <FilterLink filter='SHOW_ACTIVE'>
      Active
    </FilterLink>
    {', '}
    <FilterLink filter='SHOW_COMPLETED'>
      Completed
    </FilterLink>
  </p>
)

const Todo =({onClick, completed, text}) => (
  <li
    onClick={onClick}>
    {/*  personally keep this in CSS, but for the purpose of learning. */}
    {/* the styling below will cause the todo to be struck through when toggled  */}
    style={{
      textDecoration:
        completed ? 'line-through' : 'none'
    }}
  >
    {text}
  </li>
);

const TodoList = ({todos, onTodoClick}) => (
  <ul>
    {todos.map(todo =>
      <Todo
        key={todo.id}
        {...todo}
        onClick={() => onTodoClick(todo.id)}
      />
    )}
  </ul>
)


// the second argument is the context, which has the "{store}" arguement to
// take only the singular part of the greater context.
let AddTodo = ({ dispatch }) => {
  let input;

  return (
    <div>
      <input ref={ node => { input = node; }} />
      <button onClick={() => {
        dipatch(addTodo(input.value))
        //After dispatching a new todo to the store, the input is made blank.
        input.value = '';
      }}>
        Add TODO
      </button>
    </div>
  );
};
  // Connect without arguments will cause ReactRedux to generate a component that
  // doesn't subscribe to the store, however it will inject dispatch to whatever it
  // wrapping. Below it is wrapping the AddTodo.
AddTodo = connect()(AddToDo);

//A function that filters the visible todos based on whether or not they are
// completed and this is called in the render to provide a list from those
// available in state.
const getVisibileTodos = (todos, filter) => {
  switch (filter) {
    case 'SHOW_ALL':
      return todos;
    case 'SHOW_COMPLETED':
        return todos.filter(
          t => todos.completed
        );
    case 'SHOW_ACTIVE':
      return todos.filter(
        t => !todos.completed
      );

  }
}

const { connect } = ReactRedux;

//This re-writes the VisibleTodoList class below using the connect
// functon from ReactRedux
const mapStateToTodoListProps = (state) => {
  return {
    todos: getVisibileTodos(state.todos, state.visibilityFilter)
  }
};
const mapDispatchToTodoListProps = (dispatch) => {
  return {
    onTodoClick: (id) => {
      dispatch(toggleTodo(id))
    };
  };
};

// This is the container, with the connect and its props, and callback props
const VisibleTodoList = connect(
  mapStateToTodoListProps,
  mapDispatchToTodoListProps
)(TodoList);

// class VisibleTodoList extends Component {
//   componentDidMount() {
//     const { store } = this.context;
//     this.unsubscribe = store.subscribe(()=>
//       this.forceUpdate()
//     );
//   }
//
//   componentWillUnmount() {
//     this.unsubscribe();
//   }
//
//   render() {
//     const props = this.props;
//     const { store } = this.context;
//     const state = store.getState();
//
//     return (
//       <TodoList />
//     )
//   }
// }
// VisibleTodoList.contextTypes = {
//   store: React.PropTypes.object
// };

const TodoApp = () => (
  <div>
    <AddTodo />
    <VisibleTodoList  />
    <Footer />
  </div>
);

//The whole Provider class written out below exists in the react-redux library

//This provider class allows us to pass the store down implicitly by context rather
// than explicitly through props.
// class Provider extends Component {
//   getChildContext() {
//     return {
//       store: this.props.store;
//     };
//   }
//
//
//   render() {
//     return this.props.children;
//   }
// }
// //This line allows the other components to hook into this specific attribute
// // with this key and it needs to be an object.
// Provider.childContextTypes = {
//   store: React.PropTypes.object
// };

//ES6 syntax
const { Provider } = ReactRedux;
//import { Provider } from 'react-redux';
//var Provider = require('react-redux').Provider;

// creates the store which needs a reducer to refer back to.
const { createStore } = Redux;

// the combined reducer is placed inside the store which holds the state.
  ReactDom.render(
    <Provider store={createStore(todoApp)}>
      <TodoApp  />
    </Provider>,
    document.getElementById('root')
  );
};
