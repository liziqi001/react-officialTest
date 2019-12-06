import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

  function Square(props){
      return (
        <button 
            key={props.index}
            className="square" 
            onClick={ props.myclick }
        >
            <span className={props.winner && props.winNum.indexOf(props.index)>-1 ?'redColor':""} >{props.value}</span>
        </button>
      )
  }

  class Board extends React.Component {
   
    renderSquare(i) {
      return (
        <Square 
            key={i}
            index={i}
            winner={this.props.winner}
            winNum={this.props.winNum}
            value={this.props.squares[i]}
            myclick={() => this.props.myclick2(i)}
        />
      );
    }
  
    render() {
        let outerDiv=[];
        for(var i=0;i<9;i+=3){
            var squares=[];
            for(var j=i;j<i+3;j=j+1){
                var square=this.renderSquare(j)
                squares.push(square)
            }
            outerDiv.push(<div key={i} className="board-row">{squares}</div>)
        }
      return (
        <div>
            {outerDiv}
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props){
      super();
      this.state={
          history:[{
            squares:Array(9).fill(null),
              
          }],
          clickNum:[],
          xIsNext:true,
          stepNumber: 0,
          desc:false,//降序
          winNum:[null,null,null],//三行num 012 345 678
          winner:null,
      }   
    }
    calculateWinner(squares) {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return {winner:squares[a],winNum:lines[i]};
            }
        }
        return null;
    }
    handleClick(i){
        const history = this.state.history.slice(0,this.state.stepNumber+1);
        const current = history[history.length - 1];
        const squares=current.squares.slice()
        if(this.calculateWinner(squares)||history.length==10||squares[i]){
            return;
        }
        squares[i]=this.state.xIsNext?'x':'o'
        let winResult=this.calculateWinner(squares)

        this.setState({
            winNum:winResult?winResult.winNum:null,
            winner:winResult?winResult.winner:null 
        }) 
       
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            clickNum:this.state.clickNum.concat(i),
            stepNumber:history.length,
            xIsNext:!this.state.xIsNext,
           
        })
      
    }
    jumpTo(step){
        const history=this.state.history.concat();
        const current = history[step];
        let winResult=this.calculateWinner(current.squares)
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
            winNum:winResult?winResult.winNum:null,
            winner:winResult?winResult.winner:null 
        });
    }
    sort(){
        this.setState({
            desc:!this.state.desc,
        })
    }
    render() {
        let [history,current] =['','']
        history=this.state.history.concat();
        current = history[this.state.stepNumber];
        let winResult=this.calculateWinner(current.squares)

        let coordinate=[[1,1],[1,2],[1,3],[2,1],[2,2],[2,3],[3,1],[2,2],[3,3]]
        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            let coor='';
            if(this.state.clickNum.length>0&&move>0){
                let arr=coordinate[this.state.clickNum[move-1]]
                coor=arr.join(',')
            }
            let className=this.state.stepNumber===move?'boldLi':''
            return (
                <li className={className} key={move}> 
                    <button className={className} onClick={() => this.jumpTo(move)}>{desc}</button>({coor})
                </li>
            );
        });

        let status;
        if (winResult) {
          status = 'Winner: ' + winResult.winner;
        } else if(this.state.stepNumber!=9){
          status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }else if(this.state.stepNumber==9){
            status = '无人胜出';
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                        winner={this.state.winner}
                        winNum={this.state.winNum}
                        squares={current.squares} 
                        myclick2={ (i)=>{this.handleClick(i)} }
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>      
                    <ol>{this.state.desc?moves.reverse():moves}</ol>
                </div>   
                <div ><button onClick={() =>this.sort()}>排序</button></div>
            </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game/>,
    document.getElementById('root')
  );
 