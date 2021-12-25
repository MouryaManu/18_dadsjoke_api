import React, { Component } from 'react'
import axios from "axios";
import Joke from './Joke';
import {v4 as uuidv4} from "uuid";

import "./JokeList.css"
const JOKE_API= "https://icanhazdadjoke.com/";

class JokesList extends Component {
    static defaultProps= {
        maxJokes: 10
    };
    constructor(props) {
        super(props);
        this.state={
            jokes: JSON.parse(window.localStorage.getItem("jokes") || "[]" ),
            loading: false
        };
        this.seenJokes= new Set(this.state.jokes.map(j =>j.text));
        //this.handleVote=this.handleVote.bind(this);
       this.handleChange=this.handleChange.bind(this);
    };

    componentDidMount() {
        if(this.state.jokes.length===0) {
            this.getJokes();
        }
    }
    async getJokes() {
        try{
        let jokes=[];
        while(jokes.length < this.props.maxJokes) {
                let res=await axios.get(`${JOKE_API}`,{headers: {Accept: "application/json"}
        });
        let newJoke= res.data.joke;
        if(!this.seenJokes.has(newJoke)) {
            jokes.push({id:uuidv4(), text:newJoke, votes:0});
        }else {
            console.log("Found a Duplicate!!");
            console.log(newJoke)
        }
    }   
            this.setState(st => ({
                loading: false,
                jokes: [...st.jokes, ...jokes]
            }),
         () => window.localStorage.setItem("jokes",JSON.stringify(this.state.jokes)))
        }catch(err) {
        console.log(err);
        alert(err);
        this.setState({loading:false});
    }
        // console.log(jokes);
       //console.log(res.data);
      // console.log(this.state.jokes)
    }

    handleVote(id, diff) {
     this.setState(
         st => ({
             jokes: st.jokes.map(j=> 
                j.id===id ? {...j,votes: j.votes+diff} : j 
             )
         }),
         () => window.localStorage.setItem("jokes",JSON.stringify(this.state.jokes))
     )
    }

    handleChange() {
        this.setState({loading:true}, this.getJokes)
       
    }


    render() {
        if(this.state.loading) {
            return(
                <div className="JokeList-spinner"> 
                    <i className="far fa-8x fa-laugh fa-spin" />
                    <h1 className="JokeList-title">Loading...</h1>
                </div>
            )
        }
        let jokes= this.state.jokes.sort((a,b) => b.votes - a.votes);
        return(

                <div className="JokeList">
                    <div className="JokeList-sidebar">
                        <h1 className="JokeList-title">
                                <span>Daddy's</span> Jokes!!
                        </h1>
                        <img src="https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg"/>
                        <button className="JokeList-getmore" onClick={this.handleChange}>New Jokes!!</button>
                    </div>
                    <div className="JokeList-jokes">
                     {jokes.map(j => (
                    //    <div>{j.joke}-{j.votes} </div>
                      <Joke key={j.id} votes={j.votes} text={j.text} upvote= {() => {this.handleVote(j.id, 1)}} downvote={() => {this.handleVote(j.id, -1)}}/>
                     ))}
                    </div>
                </div>            
        )
    }
}

export default JokesList;