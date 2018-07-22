import { withRouter } from 'next/router';
import Layout from '../src/components/Layout';
import Photos from '../src/components/Photos';
import Projects from '../src/components/Projects';
import Tunes from '../src/components/Tunes';

function getContentComponentFromTitle(title) {
    switch (title) {
        case 'photos':
            return <Photos />;
        case 'projects':
            return <Projects />;
        case 'tunes':
            return <Tunes />;
        default:
            return <h1>Hello World</h1>;
    }
}

const IndexPage = (props) => {
    console.log(props.router.query);
    return (
        <Layout>
            {getContentComponentFromTitle(props.router.query.title)}
        </Layout>
    );
};

export default withRouter(IndexPage);