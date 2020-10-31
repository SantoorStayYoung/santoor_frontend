import React, { useRef, useEffect,useState } from "react";

/**
 * Hook that alerts clicks outside of the passed ref
 */
function useOutsideAlerter(ref,showDropdown) {
    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                showDropdown(false)
            }
        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);
}
export default function SearchAndSelect({options,onSelect,onInputChange,inputFieldValue,inputClasses,disabled}){
    const wrapperRef = useRef(null);
    const [dropdownShown,showDropdown] = useState(false)
    useOutsideAlerter(wrapperRef,showDropdown);
    let filteredOptions = options.filter(option=>{
        if(inputFieldValue==''){
            return true // show all countries in the list
        } else {
            return option.toLowerCase().indexOf(inputFieldValue.toLowerCase()) != -1
        }
    })
    function onOptionSelect(value){
        onSelect(value)
        showDropdown(false)
    }
    return (
        <>
        <span className="select-wrapper" ref={wrapperRef} placeholder="Search">
            <span className="arrow-down"></span>
            <input className={`${inputClasses}`} value={inputFieldValue} onChange={(e)=>onInputChange(e.target.value)} type="text" placeholder="Search" onFocus={()=>showDropdown(true)} disabled={disabled}/>
            <ul className={`options-list dropdown ${dropdownShown?"show":""}`}>
                {filteredOptions.map(option=>
                    <li key={option} onClick={()=>onOptionSelect(option)}>{option}</li>
                )}
            </ul>
        </span>
        <style jsx>{`
            .select-wrapper{
                display:inline-block;
                position:relative;
                width:100%;
            }
            .arrow-down {
                width: 0;
                height: 0;
                border-left: 5px solid transparent;
                border-right: 5px solid transparent;
                border-top: 8px solid #b8b7b7;
                position: absolute;
                right: 0.8rem;
                top: 1.6rem;
            }
            .options-list{
                position:absolute;
                display:none;
                background:#ffffff;
                overflow:hidden;
                width:100%;
                z-index:1;
                max-height:20rem;
                list-style: none;
                padding-left: 0;
            }
            .options-list.show{
                display:block;
                overflow:scroll;
            }
            .dropdown li {
                padding: 1rem;
                border-top: 1px solid #dadada;
                border-right: 1px solid #dadada;
                border-bottom: none;
                border-left: 1px solid #dadada;
                cursor:pointer;
            }
            .dropdown li:first-child {
                padding: 1rem;
                border-top: none;
                border-bottom: none;
                border-right: 1px solid #dadada;
                border-left: 1px solid #dadada;
            }
            .dropdown li:last-child {
                padding: 1rem;
                border-bottom: 1px solid #dadada;
            }
        `}</style>
        </>
    )
}