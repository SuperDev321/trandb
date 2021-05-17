import { useEffect, useRef, useState, useCallback } from 'react';


const useAnalysis = ({stream}) => {
    const audioContext = useRef(null);
    const analyser = useRef(null);
    const dataArray = useRef(null);
    const source = useRef(null);
    const rafId = useRef(null);
    const [data, setData] = useState(0);

    const tick = useCallback(() => {
        if(analyser.current) {
            analyser.current.getByteFrequencyData(dataArray.current);
            let sum = 0;
            dataArray.current.forEach((value) => {
                sum += value;
            });
            sum /= dataArray.current.length
            setData(Math.floor(sum));
        }
        setTimeout(() => {
            rafId.current = requestAnimationFrame(tick);
        }, 50);
    }, [])

    useEffect(() => {
        let audioTracks = stream?.getAudioTracks();
        if(audioTracks && audioTracks.length) {
            audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
            analyser.current = audioContext.current.createAnalyser();
            analyser.current.fftSize = 2048;
            dataArray.current = new Uint8Array(analyser.current.frequencyBinCount);
            source.current = audioContext.current.createMediaStreamSource(stream);
            source.current.connect(analyser.current);
            rafId.current = requestAnimationFrame(tick);
        }
        return () => {
            if(rafId.current)
                cancelAnimationFrame(rafId.current);
            rafId.current = null;
            if(analyser.current)
                analyser.current.disconnect();
            analyser.current = null;
            if(source.current)
                source.current.disconnect();
            source.current = null;
        }
    }, [stream, tick])

    return {
        data
    }
    

}

export default useAnalysis;