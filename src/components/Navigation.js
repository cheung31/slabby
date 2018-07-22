import Link from 'next/link'

const NavigationLink = (props) => {
    return (
        <div>
            <Link href={`/?title=${props.title}`} as={`/${props.title}`}>
                <a>{props.title}</a>
            </Link>
            <style jsx>{`
            a {
        text-decoration: none;
        font-size: 18px;
        color: #AAA; }

    a:hover {
        color: #777; }

    .selected a {
        font-weight: bold;
        color: #333; }
            `}</style>
        </div>
    );
};

const Navigation = () => {
    return (
        <div className="navigation-links">
            <h1>recently.</h1>
            <ul>
                <li className="selected">
                    <NavigationLink title="photos" />
                </li>
                <li>
                    <NavigationLink title="projects" />
                </li>
                <li>
                    <NavigationLink title="tunes" />
                </li>
            </ul>
            <style jsx>{`
            h1 {
            color: #111;
     font-size: 28px;
     font-weight: 400;
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