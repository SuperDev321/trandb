import React from 'react';

const ImageView = ({url, scrollEvent, ...props}) => {

    const myRef = React.useRef(null)
    const [checked, setChecked] = React.useState(false);
    const executeScroll = () => {
        console.log('executeScroll')
        myRef.current.scrollIntoView();
    }
    React.useEffect(() => {
        if(checked) {
            scrollEvent();
        }
    }, [checked])

    return (
        <span ref={myRef} {...props}>
        {!checked ? <a href="#!" style={{color: '#046eb9'}}>
        <strong
            onClick={() => {setChecked(true)}}
            style={{cursor: "pointer"}}>click to view</strong></a> :
        <img src={'/'+url} style={{ width: 'auto', height: 'auto', maxWidth: 250}} />}
        </span>
    )
}
export default ImageView;