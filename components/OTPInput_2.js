import React from 'react'
import styles from '../styles/OTPInput2.module.scss'
class OTPInput extends React.Component{
    constructor(props){
        super(props)
        this.state = {values:[]}
        this.refArray = []
    }
    submitOTP = ()=>{
        console.log('otp submit')
    }
    onEntryInput = (i,value)=>{
        let values = JSON.parse(JSON.stringify(this.state.values))
        if(value!="" && !isNaN(value)){
            values[i] = value
            this.setState({values},()=>{
                if(i == this.props.fields-1)
                    this.submitOTP()
                else
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
    renderEntries(){
        let entries = []
        for(let i = 0;i<this.props.fields;i++){
            this.refArray[i] = React.createRef()
            entries.push(<div key={`entry_${i}`} className={styles.entry} ref={this.refArray[i]} value={this.state.values[i] || ""} />)
        }
        return (
            <div>
                {entries.map(entry=>entry)}
                <input type="hidden" className="hidden-otp-input" />
            </div>
        )
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