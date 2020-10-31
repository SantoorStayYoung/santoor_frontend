import React from 'react'
import styles from '../styles/OTPInput.module.scss'
import isEqual from 'lodash/isEqual'
class OTPInput extends React.Component{
    constructor(props){
        super(props)
        this.state = {values:[]}
        this.refArray = []
    }
    onEntryInput = (i,value)=>{
        let values = JSON.parse(JSON.stringify(this.state.values))
        if(value!="" && !isNaN(value)){
            values[i] = value
            this.setState({values},()=>{
                if(i != this.props.fields-1)
                    this.refArray[i+1].current.focus()
            })
        } else {
            values[i] = ""
            this.setState({values})
        }
    }
    onKeyUp = (i,keyCode)=>{
        if (keyCode === 8 || keyCode == 46) {
            let values = JSON.parse(JSON.stringify(this.state.values))
            values[i] = ""
            this.setState({values},()=>{
                if(i-1 >= 0)
                this.refArray[i-1].current.select()
            })
        }
    }
    componentDidUpdate(prevProps,prevState){
        if(!isEqual(this.state.values,prevState.values)){
            let submitOtp = true
            let code = ""
            for(let i=0;i<this.props.fields;i++){
                if(this.state.values[i]=="" || isNaN(this.state.values[i])){
                    submitOtp = false
                    break;
                }
                code=code.concat(this.state.values[i])
            }
            if(submitOtp && this.props.submit)
                this.props.submit(code)
            if(this.props.onChange)
                this.props.onChange(code)
        }
    }
    renderEntries(){
        let entries = []
        for(let i = 0;i<this.props.fields;i++){
            this.refArray[i] = React.createRef()
            entries.push(<input maxlength="1" type="number" key={`entry_${i}`} className={styles.entry} ref={this.refArray[i]} value={this.state.values[i] || ""} onChange={(e)=>this.onEntryInput(i,e.target.value)} onKeyUp={(e)=>this.onKeyUp(i,e.keyCode || e.charCode)} />)
        }
        return (
            <div>
                {entries.map(entry=>entry)}
            </div>
        )
    }
    componentDidMount(){
        if(this.fields > 0)
        this.refArray[0].current.focus()
    }
    render(){
        return (
            <>
                {this.renderEntries()}
            </>
        )
    }
}
export default OTPInput