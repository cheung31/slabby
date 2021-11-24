import type { NextPage } from 'next'
import {Timeline} from "../components/timeline";

const Layout: NextPage = () => {

    return (
        <div className="bg-white dark:bg-gray-800">
            <Timeline />
        </div>
    )
}

export default Layout
