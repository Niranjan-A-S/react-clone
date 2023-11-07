//Virtual Dom
//Hooks
//Concurrent Dom

let React = {
    createElement: (tag, props, ...children) => {
        if (typeof tag === 'function') return tag(props);
        const element = {
            tag,
            props: { ...props, children }
        }
        return element
    }
}
const states = [];
let stateCursor = 0;

const render = (reactElement, container) => {
    if (['string', 'number'].includes(typeof reactElement)) {
        const actualElement = document.createTextNode(String(reactElement));
        container.appendChild(actualElement);
        return;
    }
    const actualElement = document.createElement(reactElement.tag);
    if (reactElement.props) {
        Object.keys(reactElement.props).filter(p => p !== 'children').forEach(p => { actualElement[p] = reactElement.props[p]; })
    }
    if (reactElement.props.children) {
        reactElement.props.children.forEach(child => {
            render(child, actualElement);
        })
    }

    container.appendChild(actualElement);
}

const rerender = () => {
    stateCursor = 0;
    document.getElementById('root').firstChild.remove();
    render(<App />, document.getElementById('root'));
}

const useState = (initialState) => {
    const FROZEN_CURSOR = stateCursor;
    states[FROZEN_CURSOR] = states[FROZEN_CURSOR] || initialState;
    const setState = (newState) => {
        states[FROZEN_CURSOR] = newState
        rerender();
    };
    stateCursor++;
    return [states[FROZEN_CURSOR], setState];
}


const App = () => {

    const [name, setName] = useState('Niranjan');
    const [count, setCount] = useState(0);

    return (<div className="react-clone">
        <h1>Hi {name}</h1>
        <input type="text" placeholder="Enter your name" value={name} onchange={(event) => {
            console.log(event.target.value);
            setName(event.target.value)
        }} />
        <p>The count is {count}</p>
        <button onclick={() => setCount(count + 1)}>Increment</button>
        <button onclick={() => setCount(count - 1)}>Decrement</button>
        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dignissimos, vitae voluptate itaque quam necessitatibus odit fugiat saepe sunt! Natus, delectus!</p>
    </div>
    )
}

render(<App />, document.getElementById('root'));

