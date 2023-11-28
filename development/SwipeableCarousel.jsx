import React from "react";

export default function SwipeableCarousel({ children }) {
    const [activeCard, setActiveCard] = React.useState(0);

    // use a ref for each card
    const cardRefs = React.useRef([]);

    // set up the ref
    React.useEffect(() => {
        cardRefs.current = cardRefs.current.slice(0, children.length);
    }, [children]);

    // set up the event listeners to scroll to the active card when it changes
    React.useEffect(() => {
        const card = cardRefs.current[activeCard];
        if (card) {
          card.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        }
    }, [activeCard]);

    return (
        <>
            <div className="flex max-w-screen m-4 overflow-x-scroll gap-[4%] border border-green-300 p-4">
                {children.map((child, index) => {
                    return (
                        <div
                            key={index}
                            className="h-[500px] w-[90%] rounded-lg shrink-0 bg-blue-300"
                            ref={(el) => (cardRefs.current[index] = el)}
                            style={{
                                opacity: index === activeCard ? 1 : 0.5,
                                transition: "opacity 0.5s ease",
                            }}
                        >
                            {child}
                        </div>
                    );
                })}
            </div>
            {/* prev/next button */}
            <div className="flex gap-2">
                <button
                    onClick={() => {
                        if (activeCard > 0) {
                            setActiveCard(activeCard - 1);
                        }
                    }}
                >
                    prev
                </button>
                <button
                    onClick={() => {
                        if (activeCard < children.length - 1) {
                            setActiveCard(activeCard + 1);
                        }
                    }}
                >
                    next
                </button>
            </div>
        </>
    );
}
