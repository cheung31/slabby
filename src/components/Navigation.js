const Navigation = () => {
    return (
        <div className="navigation-links">
            <h1>recently.</h1>
            <ul>
                <li className="selected"><a href="#/photos">photos</a></li>
                <li><a href="#/projects">projects</a></li>
                <li><a href="#/tunes">tunes</a></li>
            </ul>
            <style jsx>{`
            h1 {
            color: #111;
     font-size: 28px;
    margin-bottom: 20px;
            }

            .navigation-links {
    position: absolute;
    left: 10%;
    top: 15px;
    color: #AAA;
    font-size: 24px;
    text-transform: lowercase;
    text-align: right;
    letter-spacing: -1px;
    z-index: 100;
}
            `}</style>
        </div>
    );
};

export default Navigation;