import './Card.css';

export default function Card(props){
    return(
        <div className='card'>
            <img src={props.img}></img>
            <h3>{props.title}</h3>
        </div>
    );
}