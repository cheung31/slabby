import type { NextPage } from 'next'
import {Timeline} from "../components/timeline";

const Layout: NextPage = () => {

    return (
        <div className="container mx-auto">
            <Timeline />
        </div>
    )
}

export default Layout
