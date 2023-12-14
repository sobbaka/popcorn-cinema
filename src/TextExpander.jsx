import { useState } from "react";

function TextExpander({ blockStyle = "", textStyle = "", buttonStyle = "", children }) {
    const [isOpen, setIsOpen] = useState(false)

    const defaultText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

    let displayedText = children ? children : defaultText

    return (
        <div className={blockStyle}>
            <p className={textStyle}>{isOpen ? displayedText : displayedText.substring(0, 50) + "..."}</p>
            <button onClick={() => setIsOpen((isOpen) => !isOpen)} className={buttonStyle}>{isOpen ? "Show less" : "Show more"}</button>
        </div>
    )
}

export default TextExpander