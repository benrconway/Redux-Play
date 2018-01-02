// The top functions called Todo, Todos and visibilityFilter are all 'reducers'
// which effect all the changes to the state of the application.
// Only an "action" can be sent to a reducer with appropriate type and information
// and this will change the data in the state which is held external to the application
// in a place called "the store".

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
// into readable understandable code, there following is how to combine them all
// into the reducer used by the store to aggregate all the information needed.

// In the example below, they are associated key/value pairs, but es6 has the
// capacity to write only one word if the key and value are the same. In ES5 I
//expect that you would need to write 'todos: todos' etc.


const { combineReducers } = Redux;
const todoApp = combineReducers({
  todos,
  visibilityFilter
});

// the combined reducer is now placed inside the store which holds the state.
const { createStore } = Redux;
const store = createStore(todoApp);

const { Component } = React;

// A new functional component for activating filters on the todo list.
const FilterLink = ({
  filter,
  children
}) => {
  if(filter === currentFilter){
    return <span>{children}</span>
  }

  return (
    <a href='#'
      onClick={e => {
        e.preventDefault();
        store.dispatch({
          type: 'SET_VISIBILITY_FILTER',
          filter
        });
      }}
      >
        {children}
      </a>
  );
};

const Todo =({
  onClick,
  completed,
  text
}) => (
  <li
    //This onClick will activate whatever behaviour is sent through props
    onClick={onClick}>
    {/*  personally keep this in CSS, but for the purpose of learning. */}
    {/* the styling below will cause it to be struck through  */}
    style={{
      textDecoration:
        completed ? 'line-through' : 'none'
    }}
  >
    {text}
  </li>
);

const TodoList = ({
  todos,
  onTodoClick
}) => (
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

let nextTodoId = 0;
class TodoApp extends Component {
  render () {
    // I don't yet understand, but this action takes these two things out of
    // 'this.props.etc' and allows more direct access in the following functions
    const {
      todos,
      visibilityFilter
    } = this.props;
    //previously, this had this.props.todos etc, variable above removes the need
    // through JS magic as yet not understood.
    const visibleTodos = getVisibileTodos(
      todos,
      visibilityFilter
    );
    return (
      <div>
        {/* this input is able to call upon part of the react library
          allowing the node to have a name and thus be called further down */}
        <input ref={node => {
          this.input = node;
        }} />
        <button onClick={() => {
          // state can only be altered by dispatching actions to the store.
          // its type will inform whether or not a change is made to the state.
          store.dispatch({
            type: 'ADD_TODO',
            // this is where the node is called to supply its value.
            text: this.input.value;,
            id: nextTodoId++
            })
            // and here the input is rendered blank as it is saved to the list.
            this.input.value = '';
        }}>
          Add TODO
        </button>
        <TodoList
          todos={visibleTodos}
          onTodoClick={id=>
          store.dispatch({
            type: 'TOGGLE_TODO',
            id
          })}
          ></TodoList>
        <p>
          Show:
          {' '}
          <FilterLink
            filter='SHOW_ALL'
            currentFilter={visibilityFilter}
          >
            All
          </FilterLink>
          {' '}
          <FilterLink
            filter='SHOW_ACTIVE'
            currentFilter={visibilityFilter}
          >
            Active
          </FilterLink>
          {' '}
          <FilterLink
            filter='SHOW_COMPLETED'
            currentFilter={visibilityFilter}
          >
            Completed
          </FilterLink>
        </p>
      </div>
    );
  }
}


const render = () => {
  // these todos are the props being passed down.
  ReactDom.render(
    <TodoApp
      {...store.getState()}
    />,
    document.getElementById('root')
  );
};
// this subscribe method will actively re-render the dom when the state has been
// changed within the store.
store.subscribe(render);
render();
