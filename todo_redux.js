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
const todoApp = combineReducers({ todos, visibilityFilter });

// the combined reducer is now placed inside the store which holds the state.
const { createStore } = Redux;
const store = createStore(todoApp);

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

class FilterLink extends Component {
  componentDidMount() {
    this.unsubscribe = store.subscribe(()=>
      this.forceUpdate()
    );
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const props = this.props;
    const state = store.getState();

    return (
      <Link
        active={props.filter === state.visibilityFilter}
        onClick={() =>
          store.dispatch({
            type: 'SET_VISIBILITY_FILTER',
            filter: props.filter
          })
        }
      >
        {props.children}
      </Link>
    );
  }
}

const Footer = () => (
  <p>
    Show:
    {' '}
    <FilterLink
      filter='SHOW_ALL'
    >
      All
    </FilterLink>
    {' '}
    <FilterLink
      filter='SHOW_ACTIVE'
    >
      Active
    </FilterLink>
    {' '}
    <FilterLink
      filter='SHOW_COMPLETED'
    >
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

let nextTodoId = 0;
const AddTodo = () => {
  let input;
    <div>
      <input ref={node => {
        input = node;
      }} />
      <button onClick={() => {
        store.dipatch({
          type: 'ADD_TODO',
          id: nextTodoId++,
          text: input.value
        })
        // and here the input is rendered blank as it is saved to the list.
        input.value = '';
      }}>
        Add TODO
      </button>
    </div>
  }


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

class VisibleTodoList extends Component {
  componentDidMount() {
    this.unsubscribe = store.subscribe(()=>
      this.forceUpdate()
    );
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const props = this.props;
    const state = store.getState();

    return (
      <TodoList
        todos={getVisibileTodos(state.todos, state.visibilityFilter)}
        onTodoClick={id=> store.dispatch({
          type: 'TOGGLE_TODO',
          id
        })}
      />
    )
  }
}


const TodoApp = () => (
  <div>
    <AddTodo />
    <VisibleTodoList />
    <Footer />
  </div>
);

  ReactDom.render(
    <TodoApp />,
    document.getElementById('root')
  );
};
// this subscribe method will actively re-render the dom when the state has been
// changed within the store.
store.subscribe(render);
render();
