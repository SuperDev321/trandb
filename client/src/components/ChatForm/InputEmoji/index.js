import React, { useState, useImperativeHandle, useEffect, useRef, forwardRef, useCallback, useContext } from 'react'
import {
    IconButton,
    Popper,
    Fade
} from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import Picker from 'emoji-picker-react';
import CustomEmojiPicker from '../CustomEmojiPicker';
import t from 'prop-types'
import './styles.css'
import useStyles from './styles';
import { SettingContext } from '../../../context';

function emojiUnicode (emoji) {
    var comp;
    if (emoji.length === 1) {
        comp = emoji.charCodeAt(0);
    }
    comp = (
        (emoji.charCodeAt(0) - 0xD800) * 0x400
      + (emoji.charCodeAt(1) - 0xDC00) + 0x10000
    );
    if (comp < 0) {
        comp = emoji.charCodeAt(0);
    }
    return comp.toString("16");
};

function InputEmoji ({
    value,
    onChange,
    cleanOnEnter,
    onEnter,
    placeholder,
    onResize,
    onClick,
    onFocus,
    onBlur,
    maxLength,
    keepOpenend,
    onKeyDown,
    inputClass,
    disableRecent,
    tabIndex,
    // style
    height,
    fontSize,
    fontFamily,
    color,
    fontWeight,
}, ref) {
    const classes = useStyles({color});
    const { emojiOption } = useContext(SettingContext);

    const textInputRef = useRef(null)
    const cleanedTextRef = useRef('')
    const placeholderRef = useRef(null);
    const [disabled, setDisabled] = useState(true);
    const [pickerAnchorEl, setPickerAnchorEl] = React.useState(null);

    const onSend = () => {
        replaceAllTextEmojiToString()
        const cleanedText = cleanedTextRef.current
        if (typeof onEnter === 'function') {
            onEnter(cleanedText)
        }
        
        if (cleanOnEnter) {
            updateHTML('');
            cleanedTextRef.current = '';
            emitChange();
        }
    }
 
    useImperativeHandle(ref, () => ({
        get value () {
            return cleanedTextRef.current
        },
        set value (value) {
            setValue(value)
        },
        focus: () => {
            textInputRef.current.focus()
        },
        blur: () => {
            // replaceAllTextEmojiToString()
        }
    }))

    useEffect(() => {
        if (value && value.length > 0) {
        placeholderRef.current.style.opacity = 0
        } else {
        placeholderRef.current.style.opacity = 1
        }
    }, [value])

    const replaceAllTextEmojis = useCallback((text) => {
        let allEmojis = getAllEmojisFromText(text)
        if (allEmojis) {
        allEmojis = [...new Set(allEmojis)] // remove duplicates

        allEmojis.forEach(emoji => {
            text = replaceAll(
            text,
            emoji,
            `<img data-emoji="${emoji}" src="https://cdn.jsdelivr.net/gh/iamcal/emoji-data@master/img-apple-64/${emojiUnicode(emoji)}.png" />`
            )
        })
        }

        return text
    }, [])

    const updateHTML = useCallback((nextValue) => {
        nextValue = nextValue || value
        textInputRef.current.innerHTML = replaceAllTextEmojis(nextValue || '');
    }, [replaceAllTextEmojis, value])

    // const checkAndEmitResize = useCallback(() => {
    //     const nextSize = {
    //     width: textInputRef.current.offsetWidth,
    //     height: textInputRef.current.offsetHeight
    //     }

    //     if (!currentSize ||
    //     currentSize.width !== nextSize.width ||
    //     currentSize.height !== nextSize.height) {
    //     onResize(nextSize)
    //     setCurrentSize(nextSize)
    //     }
    // }, [currentSize, onResize])

    const checkPlaceholder = useCallback(() => {
        if(textInputRef.current && placeholderRef.current) {
            const text = textInputRef.current.innerHTML;
            if (text !== '' && placeholderRef.current.opacity !== 0) {
                placeholderRef.current.style.opacity = 0
            } else {
                placeholderRef.current.style.opacity = 1
            }
        } else {

        }
    }, []);

    const replaceAllTextEmojiToString = useCallback(() => {
        if (!textInputRef.current) {
            cleanedTextRef.current = '';
            return false;
        }
        if(textInputRef.current.innerHTML === '') {
            return false;
        }

        const container = document.createElement('div');
        container.innerHTML = textInputRef.current.innerHTML

        const images = Array.prototype.slice.call(container.querySelectorAll('img'))

        images.forEach(image => {
            image.outerHTML = image.dataset.emoji
        })

        let text = container.innerText
        text = text.replace(/\n/ig, '')

        cleanedTextRef.current = text
        // 

        checkPlaceholder()
        return true;

    }, [cleanedTextRef, cleanedTextRef, checkPlaceholder])

    const emitChange = useCallback(() => {
        if(textInputRef.current && textInputRef.current.innerHTML !== '') {
            setDisabled(false);
        } else {
            setDisabled(true);
        }
        checkPlaceholder();
    }, [textInputRef, checkPlaceholder])

    useEffect(() => {
        function handleKeydown (event) {
            if(textInputRef.current && textInputRef.current.innerHTML !== '') {
                placeholderRef.current.style.opacity = 0
            }
                
            if (typeof maxLength !== 'undefined' && event.keyCode !== 8 && totalCharacters() >= maxLength) {
                event.preventDefault()
            }

            if (event.keyCode === 13) {
                event.preventDefault()
                // console.log('enter')
                replaceAllTextEmojiToString()
                if(cleanedTextRef.current.trim() === ''){
                    return
                }
                if (typeof onEnter === 'function') {
                    onEnter(cleanedTextRef.current)
                }
                
                if (cleanOnEnter) {
                    updateHTML('')
                    cleanedTextRef.current = '';
                    emitChange()
                }
                
                if (typeof onKeyDown === 'function') {
                    onKeyDown(event)
                }
                
                return false
            }

            if (typeof onKeyDown === 'function') {
                // console.log('keydown')
                onKeyDown(event)
            }
        }

        function handleKeyup(event) {
            // replaceAllTextEmojiToStringDebounced()
            // replaceAllTextEmojiToString()
        }

        const inputEl = textInputRef.current

        inputEl.addEventListener('keydown', handleKeydown)
        inputEl.addEventListener('keyup', handleKeyup)

        return () => {
            inputEl.removeEventListener('keydown', handleKeydown)
            inputEl.removeEventListener('keyup', handleKeyup)
        }
    }, [cleanOnEnter, onEnter, updateHTML, replaceAllTextEmojiToString, maxLength, onKeyDown, emitChange])
    // }, [onChange, cleanOnEnter, onEnter, updateHTML, replaceAllTextEmojiToString, replaceAllTextEmojiToStringDebounced, emitChange, maxLength, onKeyDown])

    useEffect(() => {
        function handleFocus() {
            if (typeof onFocus === 'function') {
                onFocus()
            }
        }
        function handleBlur() {
            if (typeof onBlur === 'function') {
                onBlur()
            }
        }

        const inputEl = textInputRef.current

        inputEl.addEventListener('focus', handleFocus)
        inputEl.addEventListener('blur', handleBlur)

        return () => {
            inputEl.removeEventListener('focus', handleFocus)
            inputEl.removeEventListener('blur', handleBlur)
        }
    }, [onFocus, onBlur])

    function totalCharacters () {
        const text = textInputRef.current.innerText
        const html = textInputRef.current.innerHTML

        const textCount = text.length
        const emojisCount = (html.match(/<img/g) || []).length

        return textCount + emojisCount
    }

    // useEffect(() => {
    //     if (textInputRef.current) {
    //     setCurrentSize({
    //         width: textInputRef.current.offsetWidth,
    //         height: textInputRef.current.offsetHeight
    //     })
    //     }
    // }, [])

    useEffect(() => {
        function handleCopy (e) {
          const selectedText = window.getSelection()
    
          let container = document.createElement('div')
    
          for (let i = 0, len = selectedText.rangeCount; i < len; ++i) {
            container.appendChild(selectedText.getRangeAt(i).cloneContents())
          }
    
          container = replaceEmojiToString(container)
    
          e.clipboardData.setData('text', container.innerText)
          e.preventDefault()
    
          function replaceEmojiToString (container) {
            const images = Array.prototype.slice.call(container.querySelectorAll('img'))
    
            images.forEach(image => {
              image.outerHTML = image.dataset.emoji
            })
    
            return container
          }
        }
    
        function handlePaste (e) {
          e.preventDefault()
          let content
          if (window.clipboardData) {
            content = window.clipboardData.getData('Text')
            content = replaceAllTextEmojis(content)
            if (window.getSelection) {
              var selObj = window.getSelection()
              var selRange = selObj.getRangeAt(0)
              selRange.deleteContents()
              selRange.insertNode(document.createTextNode(content))
            }
          } else if (e.clipboardData) {
            content = e.clipboardData.getData('text/plain')
            content = replaceAllTextEmojis(content)
            document.execCommand('insertHTML', false, content)
          }
        }
    
        const inputEl = textInputRef.current
    
        const handleContentEditableInputCopyAndPaste = () => {
          inputEl.addEventListener('copy', handleCopy)
          inputEl.addEventListener('paste', handlePaste)
        }
    
        handleContentEditableInputCopyAndPaste()
    
        return () => {
          inputEl.removeEventListener('copy', handleCopy)
          inputEl.removeEventListener('paste', handlePaste)
        }
    }, [replaceAllTextEmojis])

    
    useEffect(() => {
        updateHTML()
        emitChange()
    }, [updateHTML, emitChange])


    function setValue (value) {
        updateHTML(value)
        emitChange()
    }

    function toggleShowPicker (event) {
        setPickerAnchorEl(pickerAnchorEl ? null : event.currentTarget);
    }

    function pasteHtmlAtCaret (html) {
        let sel, range
        if (window.getSelection) {
            // IE9 and non-IE
            sel = window.getSelection()
            if (sel.getRangeAt && sel.rangeCount) {
                range = sel.getRangeAt(0)
                range.deleteContents()

                // Range.createContextualFragment() would be useful here but is
                // non-standard and not supported in all browsers (IE9, for one)
                const el = document.createElement('div')
                el.innerHTML = html
                const frag = document.createDocumentFragment(); var node; var lastNode
                while ((node = el.firstChild)) {
                    lastNode = frag.appendChild(node)
                }
                range.insertNode(frag)

                // Preserve the selection
                if (lastNode) {
                    range = range.cloneRange()
                    range.setStartAfter(lastNode)
                    range.collapse(true)
                    sel.removeAllRanges()
                    sel.addRange(range)
                }
            }
        } else if (document.selection && document.selection.type !== 'Control') {
            // IE < 9
            document.selection.createRange().pasteHTML(html)
        }
    }

    function replaceAll (str, find, replace) {
        return str.replace(new RegExp(find, 'g'), replace)
    }

    function getImage (emoji) {
        return `<img data-emoji="${emoji.emoji}" src="https://cdn.jsdelivr.net/gh/iamcal/emoji-data@master/img-apple-64/${emoji.unified}.png" />`
    }

    function getCustomEmojiCode (emoji) {
        const { name } = emoji;
        if (name) {
            return `>${name}<`;
        } else {
            return '';
        }
    }

    function handleSelectEmoji (event, emojiObject) {
        if (!keepOpenend) {
            setPickerAnchorEl(null)
        }
        placeholderRef.current.style.opacity = 0
        textInputRef.current.focus()
        pasteHtmlAtCaret(getImage(emojiObject))
        textInputRef.current.focus()
        
        // emitChange()
    }

    function handleSelectCustomEmoji (emojiObj) {
        placeholderRef.current.style.opacity = 0
        textInputRef.current.focus()
        pasteHtmlAtCaret(getCustomEmojiCode(emojiObj));
        textInputRef.current.focus()
        
        if (!keepOpenend) {
            setPickerAnchorEl(null)
        }
    }

    function getAllEmojisFromText (text) {
        return text.match(
        /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?)*/g
        )
    }

    function handleClick () {
        if (typeof onClick === 'function') {
        onClick()
        }
    }

    const showPicker = Boolean(pickerAnchorEl);
    const id = showPicker ? 'picker-popper' : undefined;

    return (
        <div className={classes.emoji}>
        <div
            className={classes.emojiPickerContainer}
        >
            <div className={
            `${classes.emojiPickerWrapper}${
                showPicker ? ` ${classes.emojiPickerWrapperShow}` : ''
            }`
            }>
                <div
                    className={`${classes.emojiPicker}` +(showPicker ? ` ${classes.emojiPickerShow}` : '')}
                >
                    <Popper id={id} open={showPicker} anchorEl={pickerAnchorEl} transition style={{zIndex: 1000}}>
                    {({ TransitionProps }) => (
                        <Fade {...TransitionProps}>
                        { emojiOption ?
                            <Picker onEmojiClick={handleSelectEmoji} preload={true} />
                            :
                            <CustomEmojiPicker onEmojiClick={handleSelectCustomEmoji} />
                        }
                        </Fade>
                    )}
                    </Popper>
                </div>
            </div>
        </div>
        <button
            className={
            `${classes.inputEmojiButton}${
                showPicker ? ` ${classes.inputEmojiButtonShow}` : ''
            }`
            }
            aria-describedby={id} type="button"
            onClick={toggleShowPicker}
            >
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'><path d='M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0m0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10' /><path d='M8 7a2 2 0 1 0-.001 3.999A2 2 0 0 0 8 7M16 7a2 2 0 1 0-.001 3.999A2 2 0 0 0 16 7M15.232 15c-.693 1.195-1.87 2-3.349 2-1.477 0-2.655-.805-3.347-2H15m3-2H6a6 6 0 1 0 12 0' /></svg>
        </button>
        <div
            className={`${classes.inputEmojiContainer}`}
            style={{
            fontSize,
            fontFamily,
            color,
            fontWeight
            }}
        >
            <div className={`${classes.inputEmojiWrapper}`} onClick={handleClick}>
                <div
                    ref={placeholderRef}
                    className={`${classes.inputEmojiPlaceholder}`}
                >
                    {placeholder}
                </div>
            <div
                ref={textInputRef}
                tabIndex={tabIndex}
                contentEditable
                className={`${classes.inputEmojiInput}${inputClass ? ` ${inputClass}` : ''}`}
                onBlur={emitChange}
                onInput={emitChange}
            />
            </div>
        </div>
        <IconButton aria-label="send"
            // className={classes.sendButton}
            variant="contained"
            disabled={disabled}
            onClick={onSend}
            color="primary"
        >
            <SendIcon fontSize="default"/>
        </IconButton>
        {showPicker &&
        <div
            className={`${classes.inputEmojiOverlay}`}
            onClick={toggleShowPicker}
        />
        }
        </div>
    )
}

const InputEmojiWithRef = forwardRef(InputEmoji)

InputEmojiWithRef.propTypes = {
    value: t.string,
    onChange: t.func,
    cleanOnEnter: t.bool,
    onEnter: t.func,
    placeholder: t.string,
    onResize: t.func,
    onClick: t.func,
    onFocus: t.func,
    maxLength: t.number,
    keepOpenend: t.bool,
    onKeyDown: t.func,
    inputClass: t.string,
    disableRecent: t.bool,
    tabIndex: t.number,
    // style
    height: t.number,
    fontSize: t.number,
    fontFamily: t.string,
    color: t.string,
    fontWeight: t.string,
}

InputEmojiWithRef.defaultProps = {
    height: 30,
    placeholder: 'Type a message',
    fontSize: 15,
    fontFamily: 'sans-serif',
    tabIndex: 0,
    color: 'black',
    fontWeight: 400,
}

export default InputEmojiWithRef