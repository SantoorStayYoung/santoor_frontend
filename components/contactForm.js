import LoadingIcon from "../components/loadingIcon";
import {useState} from 'react'
import {API_URI} from '../config'
export default function ContactForm() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [message, setMessage] = useState("");
  const [messageError, setMessageError] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success,setSuccess] = useState(false)
  function validationError() {
    return nameError || emailError || messageError;
  }
  function validateMessage() {
    if (message.length < 2) {
      setMessageError(true);
    } else {
      setMessageError(false);
    }
  }
  function onMessageChange(message) {
    setMessage(message);
    validateMessage();
  }
  function validateEmail() {
    if (email.length < 1) {
      setEmailError(true);
    } else {
      setEmailError(false);
    }
  }
  function onEmailChange(email) {
    setEmail(email);
    validateEmail();
  }
  function validateName() {
    if (name.length < 1) {
      setNameError(true);
    } else {
      setNameError(false);
    }
  }
  function onNameChange(name) {
    setName(name);
    validateName();
  }
  function submitFormData() {
    if (!validationError()) {
      setLoading(true)
      fetch(`${API_URI}/api/dashboard/contact`, {
        method: 'POST', 
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({name,email,message}) 
      })
      .then(res=>res.json())
      .then(result=>{
          if(result.status=="OK"){
              setSuccess(true)
          } else if(result.status=="validation_error") {
              setEmailError(true)
          }
          else{
            setServerError(true)
          } 
          setLoading(false)
      }).catch(err=>{
          console.log(err)
          setServerError(true)
          setLoading(false)
      })  
    }
  }
  let btnContent = loading ? (
    <LoadingIcon
      width="2.2rem"
      height="2.2rem"
      centered={true}
      show={true}
      weight="thin"
    />
  ) : (
    "SUBMIT"
  );
  return (
    <>
    <div className="contact-form-wrapper">
      <h1 className="text-center purple">SUPPORT</h1>
      <div className="contact-form">
        {success &&
          <p>We have received your enquiry and will be in touch soon.</p>
        }
        {!success &&
          <div className="form-elements-wrapper">
          <div className="form-group">
            <input
              type="name"
              className="form-control"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Name"
            />
            {nameError && <div className="error">Please enter a name</div>}
          </div>
          <div className="form-group">
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder="E-mail address"
            />
            {emailError && (
              <div className="error">Please enter a valid email.</div>
            )}
          </div>

          <div className="form-group">
            <textarea
              className="form-control"
              value={message}
              onChange={(e) => onMessageChange(e.target.value)}
              placeholder="Message"
            ></textarea>
            {messageError && <div className="error">Please enter a message.</div>}
          </div>
          <div className="form-group text-center text-white text-center">
            <button
              onClick={() => submitFormData()}
              className={`btn btn-primary btn-larger margin-auto ${
                validationError() ? "disabled" : ""
              }`}
            >
              {btnContent}
            </button>
          </div>
          {serverError && (
            <div className="error server-error text-center">
              Something went wrong. Could not submit the form.
            </div>
          )}
        </div>
        }
      </div>
    </div>
    <style jsx>{`
        .contact-form-wrapper{
            display:flex;
            flex-direction:column;
            justify-content:center;
            height:100%;
        }
        .form-control{
            width:100%;
        }
        .contact-form{
          display:flex;
          flex-direction:column;
          justify-content:center;
          height:100%;
        }
        .error{
          margin-top:0.5rem;
        }
    `}</style>
    </>

  );
}
