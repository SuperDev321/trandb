import React from 'react';

const ImageView = ({url, scrollEvent, ...props}) => {

    const myRef = React.useRef(null)
    const [checked, setChecked] = React.useState(false);

    React.useEffect(() => {
        if(checked) {
            scrollEvent();
        }
    }, [checked, scrollEvent])

    return (
        <span ref={myRef} {...props}>
        {!checked ? <a href="#!" style={{color: '#046eb9'}}>
        <strong
            onClick={() => {setChecked(true)}}
            style={{cursor: "pointer"}}>click to view</strong></a> :
        <img src={'/'+url} style={{ width: 'auto', height: 'auto', maxWidth: 250}} alt="" />}
        </span>
    )
}
export default ImageView;