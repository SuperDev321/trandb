import React from 'react'
import MaskedInput from 'react-text-mask'
import PropTypes from 'prop-types'

const IpMaskInput = ({ inputRef, ...other }) => {
  return <MaskedInput
    {...other}
    ref={ref => {
      inputRef(ref ? ref.inputElement : null)
    }}
    // 192.168.1.1
    mask= {value => {
      let result = [];
      const chunks = value.split(".");
      for (let i = 0; i < 4; ++i) {
        const chunk = (chunks[i] || "").replace(/_/gi, "");
        if (chunk === "") {
          result.push(/\d/, /\d/, /\d/, ".");
          continue;
        } else if (chunk === 0) {
          result.push(/\d/, ".");
          continue;
        } else if (
          chunks.length < 4 ||
          (chunk.length < 3 && chunks[i].indexOf("_") !== -1)
        ) {
          if (
            (chunk.length < 2 && +`${chunk}00` > 255) ||
            (chunk.length < 3 && +`${chunk}0` > 255)
          ) {
            result.push(/\d/, /\d/, ".");
            continue;
          } else {
            if(i===3) {
              result.push(...new Array(chunk.length).fill(/\d/), ".");
            } else {
              result.push(/\d/, /\d/, /\d/, ".");
            }
            continue;
          }
        } else {
          result.push(...new Array(chunk.length).fill(/\d/), ".");
          
          continue;
        }
      }
      result = result.slice(0, -1);
      return result;
    }
  }
    // ensures that every subsection of the ip address is greater than 0 and lower than 256
    pipe ={value => {
      if (value === "." || value.endsWith("..")) return false;
  
      const parts = value.split(".");
  
      if (
        parts.length > 4 ||
        parts.some(part => part === "00" || part < 0 || part > 255)
      ) {
        return false;
      }
  
      return value;
    }}
    guide={true}
  />
}

PropTypes.propTypes = {
  inputRef: PropTypes.func.isRequired
}

export default IpMaskInput